export default (githubApi, parsedContent) => {
    const replyToComment = function* (commentId, message) {
        yield githubApi.replyToPullRequestReviewComment({
            repoUser: parsedContent.repository.user,
            repoName: parsedContent.repository.name,
            pullRequestNumber: parsedContent.pullRequest.number,
            commentId,
            message,
        });
    };

    return { replyToComment };
};
