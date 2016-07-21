/* global config */
import co from 'co';
import commiterFactory from './commiter';
import fixerFactory from './fixer';
import gitFactory from './git';
import github from 'octonode';
import githubClientFactory from './git/clients/github';
import loggerFactory from './lib/logger';
import parserFactory from './parser';

const logger = loggerFactory(config);

const main = function* (event, context) {
    const parser = parserFactory(config);
    const parsedContent = parser.parse(event);

    if (!parsedContent || parsedContent.matches.length === 0) {
        logger.info('Request', { parsedContent });

        return {
            success: false,
            reason: 'No fix found',
        };
    }

    logger.debug('Fixes found', { parsedContent });
    const githubClient = githubClientFactory(logger, github.client(config.bot.oauthToken));
    const git = gitFactory(githubClient, {
        owner: parsedContent.repository.user,
        repository: parsedContent.repository.name,
    });

    const fixer = fixerFactory(git);
    const fixedContent = yield fixer.fixTypo(parsedContent);
    logger.debug('Content fixed', { fixedContent });

    // TODO: replace githubClient by git
    const commiter = commiterFactory(config, githubClient);
    const success = yield commiter.commit(parsedContent, fixedContent);

    const response = {
        success,
        result: parsedContent.matches,
    };
    logger.info('Request', { parsedContent, response });

    return response;
};

export const handler = function (event, context, callback) {
    return co(function* () {
        logger.debug('Handler initialized', { event, context });
        return yield main(event, context);
    })
    .then(value => callback(null, value))
    .catch(error => {
        logger.error('An error occured', error);
        callback(new Error('An error occured, please contact an administrator.'));
    });
};
