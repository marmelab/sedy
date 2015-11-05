function* digestCommit(config, githubApi, content, typoFix) {
    var author = {
        name: config.committer.name,
        email: config.committer.email,
        date: content.comment.createdDate,
    };

    var message = 'Typo fix authored by ' + content.comment.sender + '\n' +
                  '\n' +
                  config.committer.name + ' is configured to automatically ' +
                  'commit change authored by specific syntax in comment. \n' +
                  'See the trigger at ' + content.comment.url;

    // Create tree with edited file
    var tree = yield githubApi.createTree({
        repoUser: content.repository.user,
        repoName: content.repository.name,
        baseTree: typoFix.baseTree,
        tree: [typoFix.tree],
    });

    // Commit the change
    var commit = yield githubApi.createCommit({
        repoUser: content.repository.user,
        repoName: content.repository.name,
        commitMessage: message,
        commitAuthor: author,
        commitTree: tree.sha,
        commitParents: typoFix.parents,
    });

    yield githubApi.updateReference({
        repoUser: content.repository.user,
        repoName: content.repository.name,
        reference: 'heads/' + content.pullRequest.ref,
        sha: commit.sha,
        force: true,
    });

    return commit;
}

function commitFactory(config) {
    return function* commit(fixedContent, githubApi) {
        var index;
        var message;
        var commits = [];
        var commitIds = [];
        var content = fixedContent.content;
        var fixes = fixedContent.fixes;

        for (index = 0; index < fixes.length; index++) {
            commits.push(digestCommit(config, githubApi, content, fixes[index]));
        }

        try {
            commits = yield commits;

            for (index = 0; index < commits.length; index++) {
                commitIds.push(commits[index].sha);
            }

            commitIds = commitIds.join(', ');
            message = ':white_check_mark: @' + content.comment.sender + ', check out my ' +
                      'commits ! I have fixed your typo(s) at : ' + commitIds;

            yield githubApi.replyToPullRequestReviewComment({
                repoUser: content.repository.user,
                repoName: content.repository.name,
                pullRequestNumber: content.pullRequest.number,
                commentId: content.comment.id,
                message: message,
            });
        } catch (Exception) {
            message = ':warning: @' + content.comment.sender + ', an error ' +
                      'occured. Be sure to check all my commits !';

            yield githubApi.replyToPullRequestReviewComment({
                repoUser: content.repository.user,
                repoName: content.repository.name,
                pullRequestNumber: content.pullRequest.number,
                commentId: content.comment.id,
                message: message,
            });
        }
    };
}


module.exports = function(config) {
    return {
        digestCommit: digestCommit,
        commit: commitFactory(config),
    };
};
