export default (config, logger) => {
    /**
     * Check if string is ASCII only
     * @see http://stackoverflow.com/a/14313213
     */
    const isASCII = str => /^[\x00-\xFF]*$/.test(str);

    const parsePullRequestReviewComment = request => ({
        type: 'pull_request_review_comment',
        // @TODO Split comment part into mutliple ones: diff, action, sender, etc
        comment: {
            action: request.body.action,
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

        const regex = new RegExp('(^s\/|.*?\\ss\/)(.*?())\/(.*?)\/.*?', 'g');
        const event = request.headers && request.headers['X-GitHub-Event'];

        if (!event) {
            logger.debug('no event in github payload');
            return null;
        }

        logger.debug('event in github payload', event);

        switch (event) {
            case 'ping':
                return null;
            case 'pull_request_review_comment':
                eventData = parsePullRequestReviewComment(request);
                logger.debug('eventData extracted from github payload', eventData);

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

        let match = regex.exec(eventData.comment.body);
        logger.debug('matched sed command', match);

        while (match) {
            if (isASCII(match[2]) && isASCII(match[4])) {
                matches.push({ from: match[2], to: match[4] });
            }
            match = regex.exec(eventData.comment.body);
        }

        const result = {
            type: eventData.type,
            comment: eventData.comment,
            commit: eventData.commit,
            repository: eventData.repository,
            pullRequest: eventData.pullRequest,
            matches,
        };

        logger.debug('result of github payload parsing', result);
        return result;
    };

    return {
        isASCII,
        parsePullRequestReviewComment,
        parse,
    };
};
