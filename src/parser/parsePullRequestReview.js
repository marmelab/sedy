import getSedyCommandsFromComment from './getSedyCommandsFromComment';

export default client =>
    async (request) => {
        if (request.body.action !== 'submitted') return [];

        const comments = await client.getCommentsFromReviewId({
            pullRequestNumber: request.body.pull_request.number,
            repoName: request.body.repository.name,
            repoUser: request.body.repository.owner.login,
            reviewId: request.body.review.id,
        });

        return comments.map(comment => ({
            // @TODO Split comment part into mutliple ones: diff, action, sender, etc
            comment: {
                body: comment.body,
                createdDate: comment.created_at,
                diffHunk: comment.diff_hunk,
                id: comment.id,
                path: comment.path,
                position: comment.position,
                sender: comment.user.login,
                url: comment.html_url,
            },
            commit: {
                id: comment.commit_id,
            },
            matches: getSedyCommandsFromComment(comment.body),
            pullRequest: {
                number: request.body.pull_request.number,
                ref: `refs/heads/${request.body.pull_request.head.ref}`,
            },
            repository: {
                name: request.body.repository.name,
                user: request.body.repository.owner.login,
            },
        }));
    };
