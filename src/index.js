/* global config */
import co from 'co';
import defer from 'co-defer';

import commiterFactory from './commiter';
import fixerFactory from './fixer';
import gitFactory from './git';
import github from 'octonode';
import githubClientFactory from './git/clients/github';
import loggerFactory from './lib/logger';
import parseFactory from './parser';

const main = function* (event, context, logger, conf) {
    const githubClient = githubClientFactory(logger, github.client(conf.bot.oauthToken));
    const parse = parseFactory(githubClient, logger);
    const parsedContents = yield parse(event);

    if (!parsedContents || parsedContents.length === 0 || parsedContents.every(parsedContent => parsedContent.matches.length === 0)) {
        logger.debug('Parsed content', JSON.stringify(parsedContents, null, 4));

        return {
            success: false,
            reason: 'No fix found',
        };
    }

    logger.debug('Fixes found', JSON.stringify(parsedContents, null, 4));
    const git = gitFactory(githubClient, {
        commitAuthor: {
            name: conf.committer.name,
            email: conf.committer.email,
        },
        repository: {
            owner: parsedContents[0].repository.user,
            name: parsedContents[0].repository.name,
        },
    });

    const fixer = fixerFactory(git, logger);
    const fixedContents = [];
    for (let i = 0; i < parsedContents.length; i++) {
        const parsedContent = parsedContents[i];

        const fixedContent = yield fixer.fix(parsedContent);
        logger.debug('Content fixed', { fixedContent });
        const commiter = commiterFactory(logger, githubClient, git);
        const success = yield commiter.commit(parsedContent, fixedContent);

        fixedContents.push({
            success,
            matches: parsedContent.matches,
        });
    };

    return fixedContents;
};

export const handler = function (event, context, callback, conf = config) {
    const logger = loggerFactory(conf);

    return co(function* () {
        logger.debug('Handler initialized', { event, context });
        return yield main(event, context, logger, conf);
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
