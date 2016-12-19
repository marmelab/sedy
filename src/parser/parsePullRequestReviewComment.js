import getSedyCommandsFromComment from './getSedyCommandsFromComment';

export default request => {
    if (request.body.action !== 'created') return [];

    return [{
        // @TODO Split comment part into mutliple ones: diff, action, sender, etc
        comment: {
            id: request.body.comment.id,
            body: request.body.comment.body,
            sender: request.body.sender.login,
            path: request.body.comment.path,
            diffHunk: request.body.diff_hunk || request.body.comment.diff_hunk,
            position: request.body.position || request.body.comment.position,
            createdDate: request.body.comment.created_at,
            url: request.body.comment.html_url,
        },
        commit: {
            id: request.body.comment.commit_id,
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
    }];
};
