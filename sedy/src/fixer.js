import escapeRegex from 'escape-string-regexp';

const isDeletedLine = line => line.startsWith('-');
const isNoNewlineAtEOFWarning = line => line === '\\ No newline at end of file';

export default (git, commiter, logger, parsedContent) => {
    const getLineIndexFromDiff = (hunk, position) => {
        // Github API send the diff with a application/vnd.github.v3.diff media type
        // See https://developer.github.com/v3/pulls/comments/#input
        const diff = hunk.split('\n');
        const line = diff[position];

        if (!line) {
            logger.error('debug infos', { hunk, position });
            throw new Error('Inefficient diff parser');
        }

        if (line.startsWith('-')) {
            return null;
        }

        const offset = parseInt(diff[0].match(/@@.*?\+(\d+)/)[1], 10) - 1;

        // If negative offset, it means that the comment is targeting a deleted line
        // Since Sedy can't change a deleted line, we stop the fix here
        // @TODO Send an error comment to the commenter
        if (offset < 0) {
            return null;
        }

        // Count nb of line until the target line without the deleted and empty lines
        const index = diff
            .slice(0, position)
            .filter(l => !isDeletedLine(l) && !isNoNewlineAtEOFWarning(l))
            .length - 1;
        return offset + index;
    };

    const fixBlob = (fixRequest, blob, match) => {
        const buffer = new Buffer(blob.content, blob.encoding);
        const blobContent = buffer.toString('utf8');

        const { diffHunk, position } = fixRequest.comment;
        const index = getLineIndexFromDiff(diffHunk, position);
        if (index === null) {
            return null;
        }

        const lines = blobContent.split('\n');

        logger.debug(`found ${lines.length} lines`);
        const line = lines[index];

        if (!line) {
            logger.debug('debug infos', {
                parsedContent,
                lines,
                index,
                diffHunk,
                position,
            });
            return null;
        }

        // TODO: Allow to specify regex flags with sed comment
        const regex = new RegExp(escapeRegex(match.from), 'gi');
        const newLine = line.replace(regex, match.to);
        logger.debug('current new line', newLine);

        if (line === newLine) {
            // No need to commit the same file
            return {};
        }

        // Rebuild the file with the modified line
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

            chunk = yield git[`${chunk.type}s`].get(chunk.sha);
        }

        return chunk;
    };

    const processFixRequest = function* (fixRequest, defaultLastCommitSha = null) {
        const fixes = [];

        let lastCommitSha = defaultLastCommitSha;
        if (!lastCommitSha) {
            const lastCommitFromReference = yield git.references.get(parsedContent.pullRequest.ref);
            lastCommitSha = lastCommitFromReference;
        }

        for (const match of fixRequest.matches) {
            const lastCommit = yield git.commits.get(lastCommitSha);
            const tree = yield git.trees.get(lastCommit.tree.sha);
            const blob = yield findBlob(tree, fixRequest.comment.path);

            if (!blob) {
                // @TODO Something went wrong, you should warn the user
                // continue; // eslint-disable-line no-continue
                return {};
            }

            const fix = fixBlob(fixRequest, blob, match);

            if (fix) {
                lastCommitSha = yield commiter.prepareFix(fixRequest, fix, lastCommitSha);
                fixes.push(fix);
            } else {
                logger.error('Unable to fix blob', JSON.stringify({ fixRequest, blob, match }));
            }
        }

        // TODO: Warn user that he didn't understood the comment
        return { fixes, commitSha: lastCommitSha };
    };

    return { fixBlob, getLineIndexFromDiff, processFixRequest };
};
