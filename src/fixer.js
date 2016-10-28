export default (git, logger) => {
    const getLineIndexFromDiff = (hunk, position) => {
        // Github API send the diff with a application/vnd.github.v3.diff media type
        // See https://developer.github.com/v3/pulls/comments/#input
        const diff = hunk.split(/\n/);
        let line = diff[position];

        if (!line) {
            logger.error('debug infos', { hunk, position });
            throw new Error('Inefficient diff parser');
        }
        if (line.startsWith('-')) {
            return null;
        }
        const offset = parseInt(diff[0].match(/@@.*?\+(\d+)/)[1], 10) - 1;
        // if negative offset, then it means there is no add
        if (offset < 0) {
            return null;
        }
        // count nb of line till target line without the deleted line
        const index = diff.slice(0, position).filter(line => !line.startsWith('-')).length - 1;
        return offset + index;
    };

    const fixBlob = (parsedContent, blob, match) => {
        const buffer = new Buffer(blob.content, blob.encoding);
        const blobContent = buffer.toString('utf8');

        const { diffHunk, position } = parsedContent.comment;
        const index = getLineIndexFromDiff(diffHunk, position);
        if (index === null) {
            return null;
        }

        const lines = blobContent.split('\n');
        logger.debug(`found ${lines.length} lines`);
        const line = lines[index];

        if (!line) {
            console.log('debug infos', { parsedContent, lines, index, diffHunk, position });
            return null;
        }

        // TODO: Allow to specify refex flags with sed comment
        const regex = new RegExp(match.from, 'gi');
        const newLine = line.replace(regex, match.to);
        logger.debug('current new line', newLine);

        if (line === newLine) {
            // No need to commit the same file
            return null;
        }

        // Rebuild the file with the modifed line
        lines[index] = newLine;

        return {
            blob,
            content: lines.join('\n'),
            match,
        };
    };

    // @TODO Move this function into git.trees.findBlob
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

    const fix = function* (parsedContent) {
        const fixes = [];

        if (parsedContent.matches.length === 0) {
            return fixes;
        }

        for (let match of parsedContent.matches) {
            const lastCommit = yield git.commits.get(parsedContent.commit.id);
            const tree = yield git.trees.get(lastCommit.tree.sha);
            const blob = yield findBlob(tree, parsedContent.comment.path);

            if (!blob) {
                // @TODO Something went wrong, you should warn the user
                continue;
            }

            const _fix = yield fixBlob(parsedContent, blob, match);

            if (_fix) {
                fixes.push(_fix);
            }
        }

        return fixes;
    };

    return { fix, fixBlob, getLineIndexFromDiff };
};
