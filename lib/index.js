/* global config */
// Fix babel issue
import regeneratorRuntime from 'babel-regenerator-runtime'; // eslint-disable-line no-unused-vars

import co from 'co';
import github from 'octonode';
import githubApiFactory from './githubApi';
import parserFactory from './parser';
import fixerFactory from './fixer';
import commiterFactory from './commiter';

const main = function* (event, context) {
    const parser = parserFactory(config);
    const parsedContent = parser.parse(event);

    if (!parsedContent || parsedContent.matches.length === 0) {
        return {
            success: false,
            reason: 'no fix found',
        };
    }

    const githubClient = github.client(config.bot.oauthToken);

    const githubApi = githubApiFactory(githubClient);
    const fixer = fixerFactory(githubApi);
    const commiter = commiterFactory(config, githubApi);

    const fixedContent = yield fixer.fixTypo(parsedContent);
    const success = yield commiter.commit(parsedContent, fixedContent);

    return {
        success,
        result: parsedContent.matches,
    };
};

export const handler = function (event, context, callback) {
    return co(function* () {
        return yield main(event, context);
    })
    .then(value => callback(null, value))
    .catch(callback);
};
