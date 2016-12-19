import getGitHubEventHeader from './getGitHubEventHeader';
import parsePullRequestReviewFactory from './parsePullRequestReview';
import parsePullRequestReviewComment from './parsePullRequestReviewComment';

export default (client, logger) => {
    const parsers = {
        ping: null,
        pull_request_review_comment: parsePullRequestReviewComment,
        pull_request_review: parsePullRequestReviewFactory(client),
    };

    return request => {
        let result;

        const event = getGitHubEventHeader(request.headers);

        if (!event) {
            logger.debug('no event in github payload');
            return [];
        }

        logger.debug('event in github payload', event);

        const parser = parsers[event];
        if (!parser) {
            logger.debug(`no parser found for event ${event}`);
            return [];
        };

        result = parsePullRequestReviewComment(request);

        logger.debug('result of github payload parsing', result);
        return result;
    };
};
