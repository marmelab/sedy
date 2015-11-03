function parsePullRequestReviewComment(request) {
    return {
        type: 'pull_request_review_comment',
        comment: {
            id: request.body.comment.id,
            body: request.body.comment.body,
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

    if (eventData === null) {
        // @todo Comment an error
        return null;
    }

    // @todo Check authorization
    match = regex.exec(eventData.comment.body);
    while (match) {
        matches.push({from: match[1], to: match[2]});
        match = regex.exec(eventData.comment.body);
    }

    return {
        'type': eventData.type,
        'matches': matches,
    };
};
