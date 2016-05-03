const callbackProxy = callback => (error, statusCode, response) => {
    if (error) {
        callback(error);
    } else {
        callback(null, response);
    }
};

export default github => ({
    replyToPullRequestReviewComment: content => callback => {
        const { repoUser, repoName, message, commentId, pullRequestNumber } = content;
        const endpoint = `/repos/${ repoUser }/${ repoName }/pulls/${pullRequestNumber}/comments`;

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

        github.get(endpoint, callbackProxy(callback));
    },

    getTreeFromId: ({ repoUser, repoName, id }) => callback => {
        const endpoint = `/repos/${repoUser}/${repoName}/git/trees/${id}?recursive=1`;

        github.get(endpoint, callbackProxy(callback));
    },

    getBlobFromId: ({ repoUser, repoName, id }) => callback => {
        const endpoint = `/repos/${repoUser}/${repoName}/git/blobs/${id}`;

        github.get(endpoint, callbackProxy(callback));
    },

    createTree: ({ repoUser, repoName, tree, baseTree }) => callback => {
        const endpoint = `/repos/${repoUser}/${repoName}/git/trees`;

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

        github.post(endpoint, {
            user: repoUser,
            repo: repoName,
            message: commitMessage,
            author: commitAuthor,
            tree: commitTree,
            parents: commitParents,
        }, callbackProxy(callback));
    },

    updateReference: ({ repoUser, repoName, reference, sha, force }) => callback => {
        const endpoint = `/repos/${repoUser}/${repoName}/git/refs/${reference}`;

        github.patch(endpoint, {
            user: repoUser,
            repo: repoName,
            ref: reference,
            sha,
            force,
        }, callbackProxy(callback));
    },
});
