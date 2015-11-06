/**
 * Proxy object to call the Github API
 * @param github - Must be an instance of github library
 * @see https://github.com/mikedeboer/node-github
 */
module.exports = function githubApi(github) {
    return {
        replyToPullRequestReviewComment: function(content) {
            return function(callback) {
                return github.pullRequests.createCommentReply({
                    user: content.repoUser,
                    repo: content.repoName,
                    body: content.message,
                    in_reply_to: content.commentId,
                    number: content.pullRequestNumber,
                }, callback);
            };
        },

        getCommitFromId: function(content) {
            return function(callback) {
                return github.gitdata.getCommit({
                    user: content.repoUser,
                    repo: content.repoName,
                    sha: content.commitId,
                }, callback);
            };
        },

        getTreeFromId: function(content) {
            return function(callback) {
                return github.gitdata.getTree({
                    user: content.repoUser,
                    repo: content.repoName,
                    sha: content.id,
                    recursive: true,
                }, callback);
            };
        },

        getBlobFromId: function(content) {
            return function(callback) {
                return github.gitdata.getBlob({
                    user: content.repoUser,
                    repo: content.repoName,
                    sha: content.id,
                }, callback);
            };
        },

        createTree: function(content) {
            return function(callback) {
                return github.gitdata.createTree({
                    user: content.repoUser,
                    repo: content.repoName,
                    tree: content.tree,
                    base_tree: content.baseTree,
                }, callback);
            };
        },

        createCommit: function(content) {
            return function(callback) {
                return github.gitdata.createCommit({
                    user: content.repoUser,
                    repo: content.repoName,
                    message: content.commitMessage,
                    author: content.commitAuthor,
                    tree: content.commitTree,
                    parents: content.commitParents,
                }, callback);
            };
        },

        updateReference: function(content) {
            return function(callback) {
                return github.gitdata.updateReference({
                    user: content.repoUser,
                    repo: content.repoName,
                    ref: content.reference,
                    sha: content.sha,
                    force: content.force,
                }, callback);
            };
        },
    };
};
