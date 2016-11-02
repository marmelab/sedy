/* global config */
import co from 'co';
import commiterFactory from './commiter';
import fixerFactory from './fixer';
import gitFactory from './git';
import github from 'octonode';
import githubClientFactory from './git/clients/github';
import loggerFactory from './lib/logger';
import parserFactory from './parser';

const main = function* (event, context, logger) {
    const parser = parserFactory(config, logger);
    const parsedContent = parser.parse(event);

    if (!parsedContent || parsedContent.matches.length === 0) {
        logger.debug('Parsed content', { parsedContent });

        return {
            success: false,
            reason: 'No fix found',
        };
    }

    logger.debug('Fixes found', { parsedContent });
    const githubClient = githubClientFactory(logger, github.client(config.bot.oauthToken));
    const git = gitFactory(githubClient, {
        commitAuthor: {
            name: config.committer.name,
            email: config.committer.email,
        },
        repository: {
            owner: parsedContent.repository.user,
            name: parsedContent.repository.name,
        },
    });

    const fixer = fixerFactory(git, logger);
    const fixedContent = yield fixer.fix(parsedContent);
    logger.debug('Content fixed', { fixedContent });

    const commiter = commiterFactory(logger, githubClient, git);
    const success = yield commiter.commit(parsedContent, fixedContent);

    return {
        success,
        result: parsedContent.matches,
    };
};

export const handler = function (event, context, callback) {
    const logger = loggerFactory(config);

    return co(function* () {
        logger.debug('Handler initialized', { event, context });
        return yield main(event, context, logger);
    })
    .then(value => callback(null, value))
    .catch(error => {
        logger.error('An error occured', {
            name: error.name,
            message: error.message,
            stack: error.stack,
        });

        callback(null, {
            success: false,
            error: 'An error occured, please contact an administrator.',
        });
    });
};
