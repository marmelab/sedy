export default (logger, githubApi, git) => {
    const digestCommit = function* (parsedContent, fix) {
        yield git.checkout(parsedContent.pullRequest.ref);

        const newBlob = {
            ...fix.blob,
            content: fix.content,
            mode: '100644',
        };

        yield git.add(newBlob, '/' + parsedContent.comment.path);

        const message = `Typo fix s/${fix.match.from}/${fix.match.to}/

As requested by @${parsedContent.comment.sender} at ${parsedContent.comment.url}`;

        const commit = yield git.commit(parsedContent.pullRequest.ref, message);

        yield git.push(parsedContent.pullRequest.ref);

        return commit;
    };

    const replyToAuthor = function* (parsedContent, message) {
        yield githubApi.replyToPullRequestReviewComment({
            repoUser: parsedContent.repository.user,
            repoName: parsedContent.repository.name,
            pullRequestNumber: parsedContent.pullRequest.number,
            commentId: parsedContent.comment.id,
            message,
        });
    };

    const commit = function* (parsedContent, fixedContent) {
        if (!fixedContent || fixedContent.length === 0) {
            yield replyToAuthor(parsedContent, `:confused: @${parsedContent.comment.sender}, I did not understand the request.`);

            return false;
        }

        try {
            const commits = [];
            for (const fix of fixedContent) {
                const commit = yield digestCommit(parsedContent, fix);
                commits.push(commit);
            }

            logger.info('Successful commits', { commitsIds: commits.map(commit => commit.sha) });

            return true;
        } catch (error) {
            // @TODO Rollback branch reference
            console.error('An error occured while commiting', error);

            yield replyToAuthor(parsedContent, `:warning: @${parsedContent.comment.sender}, an error occured.
Be sure to check all my commits!`);

            return false;
        }
    };

    return { commit, digestCommit };
};
