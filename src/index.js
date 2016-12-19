/* global config */
import co from 'co';
import commiterFactory from './commiter';
import fixerFactory from './fixer';
import gitFactory from './git';
import github from 'octonode';
import githubClientFactory from './git/clients/github';
import loggerFactory from './lib/logger';
import parseFactory from './parser';

const main = function* (event, context, logger) {
    const githubClient = githubClientFactory(logger, github.client(config.bot.oauthToken));
    const parse = parseFactory(githubClient, logger);
    const parsedContents = parse(event);

    if (!parsedContents || parsedContents.length === 0 || !parsedContents.every(p => p.matches.length === 0)) {
        logger.debug('Parsed content', JSON.stringify(parsedContents, null, 4));

        return {
            success: false,
            reason: 'No fix found',
        };
    }

    logger.debug('Fixes found', JSON.stringify(parsedContents, null, 4));
    const git = gitFactory(githubClient, {
        commitAuthor: {
            name: config.committer.name,
            email: config.committer.email,
        },
        repository: {
            owner: parsedContents[0].repository.user,
            name: parsedContents[0].repository.name,
        },
    });

    const fixer = fixerFactory(git, logger);
    const fixedContent = yield parsedContents.map(parsedContent => co.wrap(function* () {
        fixer.fix(parsedContent);
        logger.debug('Content fixed', { fixedContent });

        const commiter = commiterFactory(logger, githubClient, git);
        return {
            success: yield commiter.commit(parsedContent, fixedContent),
            matches: parsedContent.matches,
        };
    }));

    return fixedContent;
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
