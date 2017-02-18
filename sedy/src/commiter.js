export default (logger, githubApi, git, answerer) => {
    const digestCommit = function* (parsedContent, fix, fixChunk, parent) {
        const newBlob = {
            ...fixChunk.blob,
            content: fixChunk.content,
            mode: '100644',
        };

        yield git.add(newBlob, `/${fix.comment.path}`);

        const message = `Typo fix s/${fixChunk.match.from}/${fixChunk.match.to}/

As requested by ${fix.sender} at ${fix.comment.url}`;

        return yield git.commit(parsedContent.pullRequest.ref, message, parent);
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
            yield answerer.replyToComment(
                parsedContent,
                fixedContent[0].comment.id,
                `:confused: @${commentSender}, I did not understand the request.`,
            );

            return false;
        }

        const commenterCanCommit = yield checkCommenterCanCommit(parsedContent);
        if (!commenterCanCommit) {
            yield answerer.replyToComment(
                parsedContent,
                fixedContent[0].comment.id,
                `:x: @${commentSender}, you are not allowed to commit on this repository.`,
            );

            return false;
        }

        try {
            const commits = [];
            let lastCommitSha = null;
            yield git.checkout(parsedContent.pullRequest.ref);

            for (const fix of fixedContent) {
                for (const chunk of fix.chunks) {
                    const digestedCommit = yield digestCommit(parsedContent, fix, chunk, lastCommitSha);
                    lastCommitSha = digestedCommit.sha;
                    commits.push(digestedCommit);
                }
            }

            if (commits.length > 0) {
                yield git.push(parsedContent.pullRequest.ref);
            }

            logger.info('Successful commits', { commitsIds: commits.map(c => c.sha) });

            return true;
        } catch (error) {
            // @TODO Rollback branch reference
            logger.error('An error occured while commiting', error);

            yield answerer.replyToComment(
                parsedContent,
                fixedContent[0].comment.id,
                `:warning: @${parsedContent.sender}, an error occured.
Be sure to check all my commits!`);

            return false;
        }
    };

    return { commit, digestCommit };
};
