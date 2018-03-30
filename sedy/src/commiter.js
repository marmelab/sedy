export default (githubClient, git, logger, parsedContent) => {
    const prepareCommit = function* (fixRequest, fix, parent) {
        const newBlob = {
            ...fix.blob,
            content: fix.content,
            mode: '100644',
        };

        yield git.add(newBlob, `/${fixRequest.comment.path}`);

        const message = `Typo fix s/${fix.match.from}/${fix.match.to}/

As requested by ${parsedContent.sender} at ${fixRequest.comment.url}`;

        return yield git.commit(parsedContent.pullRequest.ref, message, parent);
    };

    const init = function* () {
        yield git.checkout(parsedContent.pullRequest.ref);
    };

    const prepareFix = function* (fixRequest, fix, defaultLastCommitSha = null) {
        const commit = yield prepareCommit(fixRequest, fix, defaultLastCommitSha);

        logger.info('Successful commit', { commitId: commit.sha });
        return commit.sha;
    };

    const push = function* (lastCommitSha) {
        if (lastCommitSha) {
            yield git.push(parsedContent.pullRequest.ref);
            logger.info('Successfully pushed the branch', { branch: parsedContent.pullRequest.ref });

            return true;
        }

        return false;
    };

    return {
        init,
        prepareCommit,
        prepareFix,
        push,
    };
};
