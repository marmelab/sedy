export default git => {
    const fixBlob = (parsedContent, lastCommit, blob, treeBlob, match) => {
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
            tree: {
                path: treeBlob.path,
                content: newBlobContent,
                mode: treeBlob.mode,
                type: treeBlob.type,
            },
            baseTree: lastCommit.tree.sha,
            parents: [lastCommit.sha],
        };
    };

    const fixMatch = function* (parsedContent, match) {
        const lastCommit = yield git.commits.get(parsedContent.commit.id);
        const lastCommitTree = yield git.trees.get(lastCommit.tree.sha);
        const treeBlob = lastCommitTree.tree.find(b => b.path === parsedContent.comment.path);

        if (treeBlob === null) {
            return null;
        }

        const blob = yield git.blobs.get(treeBlob.sha);

        return fixBlob(parsedContent, lastCommit, blob, treeBlob, match);
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
