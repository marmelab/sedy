/**
 * Check if string is ASCII only
 * @see http://stackoverflow.com/a/14313213
 */
function isASCII(str) {
    return /^[\x00-\xFF]*$/.test(str);
}

function parsePullRequestReviewComment(request) {
    return {
        type: 'pull_request_review_comment',
        comment: {
            id: request.body.comment.id,
            body: request.body.comment.body,
            sender: request.body.sender.login,
            path: request.body.comment.path,
            position: request.body.comment.position,
            createdDate: request.body.comment.created_at,
            url: request.body.comment.html_url,
        },
        commit: {
            id: request.body.comment.commit_id,
        },
        repository: {
            user: request.body.repository.owner.login,
            name: request.body.repository.name,
        },
        pullRequest: {
            number: request.body.pull_request.number,
            ref: request.body.pull_request.head.ref,
        },
    };
}

module.exports = function parser(request) {
    var match;
    var matches = [];
    var eventData;

    var regex = new RegExp('s\/(.*)\/(.*)\/', 'g');
    var event = request.headers['x-github-event'];

    switch (event) {
    case 'ping':
        return null;
    case 'pull_request_review_comment':
        eventData = parsePullRequestReviewComment(request);
        break;
    // @todo commit_comment
    // @todo issue_comment
    default:
        eventData = null;
    }

    // Not in the range of SedBot
    if (eventData === null) {
        return null;
    }

    // @todo Check authorization
    match = regex.exec(eventData.comment.body);
    while (match) {
        if (isASCII(match[1]) && isASCII(match[2])) {
            matches.push({from: match[1], to: match[2]});
        }
        match = regex.exec(eventData.comment.body);
    }

    return {
        type: eventData.type,
        comment: eventData.comment,
        commit: eventData.commit,
        repository: eventData.repository,
        pullRequest: eventData.pullRequest,
        matches: matches,
    };
};
