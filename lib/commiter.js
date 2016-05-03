export default (config, githubApi) => {
    const digestCommit = function* (parsedContent, typoFix) {
        const author = {
            name: config.committer.name,
            email: config.committer.email,
            date: parsedContent.comment.createdDate,
        };

        // Create tree with edited file
        const tree = yield githubApi.createTree({
            repoUser: parsedContent.repository.user,
            repoName: parsedContent.repository.name,
            baseTree: typoFix.baseTree,
            tree: [typoFix.tree],
        });

        // Commit the change
        const commit = yield githubApi.createCommit({
            repoUser: parsedContent.repository.user,
            repoName: parsedContent.repository.name,
            commitAuthor: author,
            commitTree: tree.sha,
            commitParents: typoFix.parents,
            commitMessage: `Typo fix authored by ${parsedContent.comment.sender}

${author.name} is configured to automatically commit change authored by specific syntax in a comment.
See the trigger at ${parsedContent.comment.url}`,
        });

        yield githubApi.updateReference({
            repoUser: parsedContent.repository.user,
            repoName: parsedContent.repository.name,
            reference: `heads/${parsedContent.pullRequest.ref}`,
            sha: commit.sha,
            force: true,
        });

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

        const digestedCommits = fixedContent.map(fix => digestCommit(parsedContent, fix));

        try {
            const commits = yield digestedCommits; // Commit & push
            const commitIds = commits.map(commit => commit.sha);

            yield replyToAuthor(parsedContent, `:white_check_mark: @${parsedContent.comment.sender}, check out my commits!
I have fixed your typo(s) at ${commitIds.join(', ')}`);

            return true;
        } catch (error) {
            console.error('An error occured while commiting', error);

            yield replyToAuthor(parsedContent, `:warning: @${parsedContent.comment.sender}, an error occured.
Be to to check all my commits!`);

            return false;
        }
    };

    return { commit, digestCommit };
};
