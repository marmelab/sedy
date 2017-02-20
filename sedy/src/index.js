/* eslint-disable import/prefer-default-export */
/* global config */
import co from 'co';
import github from 'octonode';

import answererFactory from './answerer';
import commiterFactory from './commiter';
import fixerFactory from './fixer';
import gitFactory from './git';
import githubClientFactory from './git/clients/github';
import loggerFactory from './lib/logger';
import parseFactory from './parser';
import safeguardFactory from './safeguard';

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

    const answerer = answererFactory(githubClient, parsedContent);
    const safeguard = safeguardFactory(githubClient, answerer, parsedContent);

    const commenterCanCommit = yield safeguard.checkCommenterCanCommit();
    if (!commenterCanCommit) {
        return {
            success: false,
            reason: 'Commenter is not allowed to commit on the repository',
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

    const commiter = commiterFactory(githubClient, git, logger, parsedContent);
    const fixer = fixerFactory(git, commiter, logger, parsedContent);
    const traces = [];

    yield commiter.init();

    let lastCommitSha = null;
    for (const fixRequest of parsedContent.fixes) {
        logger.debug('Fixing request', JSON.stringify(fixRequest, null, 4));
        const { fixes, commitSha } = yield fixer.processFixRequest(fixRequest, lastCommitSha);
        lastCommitSha = commitSha;

        logger.debug('Fixing response', JSON.stringify(fixes, null, 4));
        traces.push({ matches: fixRequest.matches });
    }

    let success = false;
    if (lastCommitSha) {
        success = yield commiter.push(lastCommitSha);
    }

    return { success, fixes: traces };
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
