export default git => {
    const fixBlob = (parsedContent, lastCommit, blob, match) => {
        const buffer = new Buffer(blob.content, blob.encoding);
        const blobContent = buffer.toString('ascii');

        // Github API send the diff with a application/vnd.github.v3.diff media type
        // See https://developer.github.com/v3/pulls/comments/#input
        const diff = parsedContent.comment.diffHunk.split('\n');
        let diffLine = diff[parsedContent.comment.position];

        // TODO: If comment.position is null: warn the comment author

        if (!diffLine) {
            console.log('debug infos', { parsedContent });
            throw new Error('Inefficient diff parser');
        }

        if (diffLine.startsWith('+') || diffLine.startsWith('-')) {
            diffLine = diffLine.substring(1);
        }

        const lines = blobContent.split('\n');
        const index = lines.indexOf(diffLine);
        const line = lines[index];

        if (!line) {
            console.log('debug infos', { parsedContent, lines, index, diffLine });
            return null;
        }

        // TODO: Allow to specify refex flags with sed comment
        const regex = new RegExp(match.from, 'gi');
        const newLine = line.replace(regex, match.to);

        if (line === newLine) {
            // No need to commit the same file
            return null;
        }

        // Rebuild the file with the modifed line
        lines[index] = newLine;
        const newBlobContent = lines.join('\n');

        return {
            blob,
            content: newBlobContent,
            match,
        };
    };

    const findBlob = function* (rootTree, path) {
        const chunkPaths = path.split('/');

        let chunk = { ...rootTree }; // Isolation purposes

        for (const chunkPath of chunkPaths) {
            chunk = chunk.tree.find(obj => ['tree', 'blob'].includes(obj.type) && obj.path === chunkPath);

            if (!chunk) {
                return null;
            }

            chunk = yield git[chunk.type + 's'].get(chunk.sha);
        }

        return chunk;
    };

    const fixMatch = function* (parsedContent, match) {
        const lastCommit = yield git.commits.get(parsedContent.commit.id);
        const tree = yield git.trees.get(lastCommit.tree.sha);
        const blob = yield findBlob(tree, parsedContent.comment.path);

        if (!blob) {
            return null;
        }

        return fixBlob(parsedContent, lastCommit, blob, match);
    };

    const fixTypo = function* (parsedContent) {
        const fixes = [];

        if (parsedContent.matches.length === 0) {
            return [];
        }

        for (let match of parsedContent.matches) {
            const fix = yield fixMatch(parsedContent, match);

            if (fix) {
                fixes.push(fix);
            }
        }

        return fixes;
    };

    return { fixBlob, fixMatch, fixTypo };
};
