module.exports = function githubapi(github) {
    return {
        replyToPullRequestReviewComment: function(content) {
            return function(callback) {
                github.pullRequests.createCommentReply({
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
                github.gitdata.getCommit({
                    user: content.repoUser,
                    repo: content.repoName,
                    sha: content.commitId,
                }, callback);
            };
        },

        getTreeFromId: function(content) {
            return function(callback) {
                github.gitdata.getTree({
                    user: content.repoUser,
                    repo: content.repoName,
                    sha: content.id,
                    recursive: true,
                }, callback);
            };
        },

        getBlobFromId: function(content) {
            return function(callback) {
                github.gitdata.getBlob({
                    user: content.repoUser,
                    repo: content.repoName,
                    sha: content.id,
                }, callback);
            };
        },
    };
};
