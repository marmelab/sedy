/* global config */
import co from 'co';
import commiterFactory from './commiter';
import fixerFactory from './fixer';
import github from 'octonode';
import githubApiFactory from './githubApi';
import loggerFactory from './lib/logger';
import parserFactory from './parser';
import treeManagerFactory from './treeManager';

const logger = loggerFactory(config);
const parser = parserFactory(config);
const githubClient = github.client(config.bot.oauthToken);
const githubApi = githubApiFactory(logger, githubClient);

const main = function* (event, context) {
    const parsedContent = parser.parse(event);

    if (!parsedContent || parsedContent.matches.length === 0) {
        logger.info('Request', { parsedContent });
        return {
            success: false,
            reason: 'No fix found',
        };
    }

    logger.debug('Fixes found', { parsedContent });
    const treeManager = treeManagerFactory(githubApi, parsedContent);
    const fixer = fixerFactory(githubApi, treeManager);
    const commiter = commiterFactory(config, githubApi);

    const fixedContent = yield fixer.fixTypo(parsedContent);
    logger.debug('Content fixed', { fixedContent });

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
