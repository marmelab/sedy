import getSedyCommandsFromComment from './getSedyCommandsFromComment';

export default client =>
    function* (request) {
        if (request.body.action !== 'created') return [];
        if (request.body.comment.pull_request_review_id) return [];

        return {
            fixes: [{
                // @TODO Split comment part into mutliple ones: diff, action, sender, etc
                comment: {
                    body: request.body.comment.body,
                    createdDate: request.body.comment.created_at,
                    diffHunk: request.body.diff_hunk || request.body.comment.diff_hunk,
                    id: request.body.comment.id,
                    path: request.body.comment.path,
                    position: request.body.position || request.body.comment.position,
                    url: request.body.comment.html_url,
                },
                commit: {
                    id: request.body.comment.commit_id,
                },
                matches: getSedyCommandsFromComment(request.body.comment.body),
            }],
            pullRequest: {
                number: request.body.pull_request.number,
                ref: `refs/heads/${request.body.pull_request.head.ref}`,
            },
            repository: {
                user: request.body.repository.owner.login,
                name: request.body.repository.name,
            },
            sender: request.body.sender.login,
        };
    };
