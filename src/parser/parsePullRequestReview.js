import getSedyCommandsFromComment from './getSedyCommandsFromComment';

export default (client, logger) =>
    async (request) => {
        if (request.body.action !== 'submitted') return [];

        const comments = await client.getCommentsFromReviewId({
            repoUser: request.body.repository.owner.login,
            repoName: request.body.repository.name,
            pullRequestNumber: request.body.pull_request.number,
            reviewId: request.review.id,
        });

        return comments.map(comment => ({
            // @TODO Split comment part into mutliple ones: diff, action, sender, etc
            comment: {
                id: comment.id,
                body: comment.body,
                sender: comment.user.login,
                path: comment.path,
                diffHunk: comment.diff_hunk,
                position: comment.position,
                createdDate: comment.created_at,
                url: comment.html_url,
            },
            commit: {
                id: comment.commit_id,
            },
            matches: getSedyCommandsFromComment(request.body.comment.body),
            repository: {
                user: request.body.repository.owner.login,
                name: request.body.repository.name,
            },
            pullRequest: {
                number: request.body.pull_request.number,
                ref: `refs/heads/${request.body.pull_request.head.ref}`,
            },
        }));
    };
