/* TODO: Split and clean this crappy file */

export default (logger, github) => {
    github.requestDefaults.headers = {
        ...github.requestDefaults.headers,
        Accept: 'application/vnd.github.black-cat-preview+json',
    };

    const callbackProxy = callback => (error, statusCode, response) => {
        if (error) {
            logger.error('Github API Error', { error, response });
            callback(error);
        } else {
            logger.debug('Github API Response', { response });
            callback(null, response);
        }
    };

    return {
        replyToPullRequestReviewComment: content => callback => {
            const { repoUser, repoName, message, commentId, pullRequestNumber } = content;
            const endpoint = `/repos/${ repoUser }/${ repoName }/pulls/${pullRequestNumber}/comments`;
            logger.debug('Github API Request', { endpoint, method: 'POST' });

            github.post(endpoint, {
                user: repoUser,
                repo: repoName,
                number: pullRequestNumber,
                in_reply_to: commentId,
                body: message,
            }, callbackProxy(callback));
        },

        getCommitFromId: ({ repoUser, repoName, commitId }) => callback => {
            const endpoint = `/repos/${repoUser}/${repoName}/git/commits/${commitId}`;
            logger.debug('Github API Request', { endpoint, method: 'GET' });

            github.get(endpoint, callbackProxy(callback));
        },

        getCommentsFromReviewId: ({ repoUser, repoName, pullRequestNumber, reviewId }) => callback => {
            const endpoint = `/repos/${repoUser}/${repoName}/pulls/${pullRequestNumber}/reviews/${reviewId}/comments`;
            logger.debug('Github API Request', { endpoint, method: 'GET' });

            github.get(endpoint, callbackProxy(callback));
        },

        getTreeFromId: ({ repoUser, repoName, id }) => callback => {
            const endpoint = `/repos/${repoUser}/${repoName}/git/trees/${id}?recursive=1`;
            logger.debug('Github API Request', { endpoint, method: 'GET' });

            github.get(endpoint, callbackProxy(callback));
        },

        getBlobFromId: ({ repoUser, repoName, id }) => callback => {
            const endpoint = `/repos/${repoUser}/${repoName}/git/blobs/${id}`;
            logger.debug('Github API Request', { endpoint, method: 'GET' });

            github.get(endpoint, callbackProxy(callback));
        },

        createTreeFromBase: ({ repoUser, repoName, tree, baseTree }) => callback => {
            const endpoint = `/repos/${repoUser}/${repoName}/git/trees`;
            logger.debug('Github API Request', { endpoint, method: 'POST' });

            github.post(endpoint, {
                user: repoUser,
                repo: repoName,
                tree,
                base_tree: baseTree,
            }, callbackProxy(callback));
        },

        createCommit: content => callback => {
            const { repoUser, repoName } = content;
            const { commitMessage, commitAuthor, commitTree, commitParents } = content;
            const endpoint = `/repos/${repoUser}/${repoName}/git/commits`;
            logger.debug('Github API Request', { endpoint, method: 'POST' });

            github.post(endpoint, {
                user: repoUser,
                repo: repoName,
                message: commitMessage,
                author: commitAuthor,
                tree: commitTree,
                parents: commitParents,
            }, callbackProxy(callback));
        },

        getReferenceFromId: ({ repoUser, repoName, reference }) => callback => {
            const ref = reference.replace('refs/', '');
            const endpoint = `/repos/${repoUser}/${repoName}/git/refs/${ref}`;
            logger.debug('Github API Request', { endpoint, method: 'GET' });

            github.get(endpoint, callbackProxy(callback));
        },

        updateReference: ({ repoUser, repoName, reference, sha, force }) => callback => {
            const ref = reference.replace('refs/', '');
            const endpoint = `/repos/${repoUser}/${repoName}/git/refs/${ref}`;
            logger.debug('Github API Request', { endpoint, method: 'PATCH' });

            github.patch(endpoint, {
                user: repoUser,
                repo: repoName,
                ref: reference,
                sha,
                force,
            }, callbackProxy(callback));
        },

        getRepoCollaborators: ({ repoUser, repoName }) => callback => {
            const endpoint = `/repos/${repoUser}/${repoName}/collaborators`;
            logger.debug('Github API Request', { endpoint, method: 'GET' });

            github.get(endpoint, callbackProxy(callback));
        },
    };
};
