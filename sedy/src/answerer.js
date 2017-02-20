export default (githubClient, parsedContent) => {
    const replyToComment = function* (commentId, message) {
        yield githubClient.replyToPullRequestReviewComment({
            repoUser: parsedContent.repository.user,
            repoName: parsedContent.repository.name,
            pullRequestNumber: parsedContent.pullRequest.number,
            commentId,
            message,
        });
    };

    return { replyToComment };
};
