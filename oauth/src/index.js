/* global config */
import co from 'co';
import request from 'request';

import loggerFactory from '../../sedy/src/lib/logger';

const main = function* (event, context, logger, conf) {
    const { headers, body } = event;
    const origin = headers.origin || headers.Origin;
    const authorization = headers.authorization || headers.Authorization;

    if (!conf.allowedOrigins.includes(origin)) {
        throw new Error(`${headers.origin} is not an allowed origin.`);
    }

    if (!authorization || authorization.replace('token ', '') !== conf.secret) {
        throw new Error('Authorization token mismatch');
    }

    const url = 'https://github.com/login/oauth/access_token';
    const options = {
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
        },
        body: JSON.stringify({
            code: body.code,
            client_id: conf.github.clientId,
            client_secret: conf.github.clientSecret,
            redirect_uri: conf.github.redirectUri,
        }),
    };

    const response = yield cb => request(url, options, (err, res) => cb(err, res));

    return { success: true, body: JSON.parse(response.body) };
};

export const handler = function (event, context, callback, conf = config) {
    const logger = loggerFactory(conf);

    return co(function* () {
        logger.debug('Handler initialized', { event, context });
        return yield main(event, context, logger, conf);
    })
    .then(value => callback(null, value))
    .catch((error) => {
        logger.error('An error occurred', {
            name: error.name,
            message: error.message,
            stack: error.stack,
        });

        callback(null, {
            success: false,
            error: 'An error occurred, please contact an administrator.',
        });
    });
};
