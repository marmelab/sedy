/* global config */
import co from 'co';
import github from 'octonode';

import commiterFactory from './commiter';
import fixerFactory from './fixer';
import gitFactory from './git';
import githubClientFactory from './git/clients/github';
import loggerFactory from './lib/logger';
import parseFactory from './parser';

const main = function* (event, context, logger, conf) {
    const githubClient = githubClientFactory(logger, github.client(conf.bot.oauthToken));
    const parse = parseFactory(githubClient, logger);
    const parsedContent = yield parse(event);

    logger.debug('Parsed content', JSON.stringify(parsedContent, null, 4));

    const hasNoFix = !parsedContent ||
        !parsedContent.fixes ||
        parsedContent.fixes.length === 0 ||
        parsedContent.fixes.every(fix => fix.matches.length === 0);

    if (hasNoFix) {
        return {
            success: false,
            reason: 'No fix found',
        };
    }

    const git = gitFactory(githubClient, {
        commitAuthor: {
            name: conf.committer.name,
            email: conf.committer.email,
        },
        repository: {
            owner: parsedContent.repository.user,
            name: parsedContent.repository.name,
        },
    });

    const fixer = fixerFactory(git, logger);
    const fixedContents = [];
    for (const fix of parsedContent.fixes) {
        logger.debug('Fixing', JSON.stringify(fix, null, 4));
        const contentToFix = {
            ...fix,
            pullRequest: parsedContent.pullRequest,
            repository: parsedContent.repository,
            sender: parsedContent.sender,
        };

        const fixedContent = yield fixer.fix(contentToFix);

        logger.debug('Content fixed', JSON.stringify(fixedContent, null, 4));
        const commiter = commiterFactory(logger, githubClient, git);
        const success = yield commiter.commit(contentToFix, fixedContent);

        fixedContents.push({
            success,
            matches: contentToFix.matches,
        });
    }

    return fixedContents;
};

export const handler = function (event, context, callback, conf = config) {
    const logger = loggerFactory(conf);

    return co(function* () {
        logger.debug('Handler initialized', { event, context });
        return yield main(event, context, logger, conf);
    })
    .then(value => callback(null, value))
    .catch((error) => {
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
