export default config => {
    /**
     * Check if string is ASCII only
     * @see http://stackoverflow.com/a/14313213
     */
    const isASCII = str => /^[\x00-\xFF]*$/.test(str);

    const parsePullRequestReviewComment = request => ({
        type: 'pull_request_review_comment',
        comment: {
            action: request.body.action,
            id: request.body.comment.id,
            body: request.body.comment.body,
            sender: request.body.sender.login,
            path: request.body.comment.path,
            diffHunk: request.body.comment.diff_hunk,
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
            ref: `refs/heads/${request.body.pull_request.head.ref}`,
        },
    });

    const parse = request => {
        let eventData;
        const matches = [];

        const regex = new RegExp('s\/(.*)\/(.*)\/', 'g');
        const event = request.headers && request.headers['X-GitHub-Event'];

        if (!event) {
            return null;
        }

        switch (event) {
            case 'ping':
                return null;
            case 'pull_request_review_comment':
                eventData = parsePullRequestReviewComment(request);

                if (eventData.comment.action !== 'created') {
                    return null;
                }
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

        // If comment author not in allowed authors
        if (config.allowed.authors.indexOf(eventData.comment.sender) < 0) {
            return null;
        }

        let match = regex.exec(eventData.comment.body);
        while (match) {
            if (isASCII(match[1]) && isASCII(match[2])) {
                matches.push({ from: match[1], to: match[2] });
            }
            match = regex.exec(eventData.comment.body);
        }

        return {
            type: eventData.type,
            comment: eventData.comment,
            commit: eventData.commit,
            repository: eventData.repository,
            pullRequest: eventData.pullRequest,
            matches,
        };
    };

    return {
        isASCII,
        parsePullRequestReviewComment,
        parse,
    };
};
