export default (githubClient, answerer, parsedContent) => {
    const warnCommenterAboutRestriction = function* () {
        const commentSender = parsedContent.sender;
        const firstCommentid = parsedContent.fixes[0].comment.id;

        yield answerer.replyToComment(
            firstCommentid,
            `:x: @${commentSender}, you are not allowed to commit on this repository.`,
        );
    };

    const checkCommenterCanCommit = function* () {
        const collaborators = yield githubClient.getRepoCollaborators({
            repoUser: parsedContent.repository.user,
            repoName: parsedContent.repository.name,
        });

        const commenter = collaborators.find(c => c.login === parsedContent.sender);

        // Commenter is not a collaborator of the repo
        if (!commenter) {
            yield warnCommenterAboutRestriction();

            return false;
        }

        // @see https://developer.github.com/changes/2015-06-24-api-enhancements-for-working-with-organization-permissions/
        // For now, GitHub returns the permissions as:
        //      commenter.permissions === { admin: true, push: false, pull: true }
        // But in the future, GitHub will returns the permissions as:
        //      commenter.permission === 'admin' || 'write' || 'read' || 'none'
        let commenterCanCommit;
        if (typeof commenter.permission !== 'string') { // Support GitHub backward compatibility
            commenterCanCommit = !!(commenter.permissions.push || commenter.permissions.admin);
        } else {
            commenterCanCommit = ['admin', 'write'].includes(commenter.permission);
        }

        if (!commenterCanCommit) {
            yield warnCommenterAboutRestriction();
        }

        return commenterCanCommit;
    };


    return { checkCommenterCanCommit, warnCommenterAboutRestriction };
};
