export default (githubApi, treeManager) => {
    const fixBlob = (parsedContent, lastCommit, blob, match) => {
        const buffer = new Buffer(blob.raw.content, blob.raw.encoding);
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
                path: blob.path,
                content: newBlobContent,
                mode: blob.mode,
                type: blob.type,
            },
            baseTree: blob.parentTreeSha,
            parents: [lastCommit.sha],
        };
    };

    const fixMatch = function* (parsedContent, match) {
        const lastCommit = yield githubApi.getCommitFromId({
            repoUser: parsedContent.repository.user,
            repoName: parsedContent.repository.name,
            commitId: parsedContent.commit.id,
        });

        const tree = yield treeManager.getFromSha(lastCommit.tree.sha);
        const blob = tree[parsedContent.comment.path];

        if (!blob || !blob.content) {
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
