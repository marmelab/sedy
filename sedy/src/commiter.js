export default (logger, githubApi, git) => {
    const digestCommit = function* (parsedContent, fix) {
        yield git.checkout(parsedContent.pullRequest.ref);

        const newBlob = {
            ...fix.blob,
            content: fix.content,
            mode: '100644',
        };

        yield git.add(newBlob, `/${parsedContent.comment.path}`);

        const message = `Typo fix s/${fix.match.from}/${fix.match.to}/

As requested by @${parsedContent.sender} at ${parsedContent.comment.url}`;

        return yield git.commit(parsedContent.pullRequest.ref, message);
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

    const checkCommenterCanCommit = function* (parsedContent) {
        const collaborators = yield githubApi.getRepoCollaborators({
            repoUser: parsedContent.repository.user,
            repoName: parsedContent.repository.name,
        });

        const commenter = collaborators.find(c => c.login === parsedContent.sender);

        // Commenter is not a collaborator of the repo
        if (!commenter) return false;

        return commenter.permissions.push || commenter.permissions.admin;
    };

    const commit = function* (parsedContent, fixedContent) {
        const commentSender = parsedContent.sender;
        if (!fixedContent || fixedContent.length === 0) {
            yield replyToAuthor(parsedContent, `:confused: @${commentSender}, I did not understand the request.`);

            return false;
        }

        const commenterCanCommit = yield checkCommenterCanCommit(parsedContent);
        if (!commenterCanCommit) {
            yield replyToAuthor(
                parsedContent,
                `:x: @${commentSender}, you are not allowed to commit on this repository.`,
            );

            return false;
        }

        try {
            const commits = [];
            for (const fix of fixedContent) {
                const digestedCommit = yield digestCommit(parsedContent, fix);
                commits.push(digestedCommit);
            }

            if (commits.length > 0) {
                yield git.push(parsedContent.pullRequest.ref);
            }

            logger.info('Successful commits', { commitsIds: commits.map(c => c.sha) });

            return true;
        } catch (error) {
            // @TODO Rollback branch reference
            logger.error('An error occured while commiting', error);

            yield replyToAuthor(parsedContent, `:warning: @${parsedContent.sender}, an error occured.
Be sure to check all my commits!`);

            return false;
        }
    };

    return { commit, digestCommit };
};
