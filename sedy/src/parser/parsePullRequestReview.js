import getSedyCommandsFromComment from './getSedyCommandsFromComment';

export default (client, logger) => function* (request) {
    if (request.body.action !== 'submitted') {
        logger.debug('The review is not submitted');
        return [];
    }

    const comments = yield client.getCommentsFromReviewId({
        pullRequestNumber: request.body.pull_request.number,
        repoName: request.body.repository.name,
        repoUser: request.body.repository.owner.login,
        reviewId: request.body.review.id,
    });

    const fixes = comments.map(comment => ({
        // @TODO Split comment part into mutliple ones: diff, action, sender, etc
        comment: {
            body: comment.body,
            createdDate: comment.created_at,
            diffHunk: comment.diff_hunk,
            id: comment.id,
            path: comment.path,
            position: comment.position,
            url: comment.html_url,
        },
        commit: {
            id: comment.commit_id,
        },
        matches: getSedyCommandsFromComment(comment.body),
    }));

    return {
        fixes,
        pullRequest: {
            number: request.body.pull_request.number,
            ref: `refs/heads/${request.body.pull_request.head.ref}`,
        },
        repository: {
            name: request.body.repository.name,
            user: request.body.repository.owner.login,
        },
        sender: request.body.review.user.login,
    };
};
