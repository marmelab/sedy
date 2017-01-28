/* global config */
import co from 'co';
import config from 'config';
import request from 'request';

import loggerFactory from '../../sedy/src/lib/logger';

const main = function* (event, context, logger, conf) {
    const { headers, body } = event;

    if (!config.allowedOrigins.includes(headers.origin)) {
        throw new Error(`${headers.origin} is not an allowed origin.`);
    }

    const authorization = headers.authorization && headers.authorization.replace('token ', '');

    if (!authorization || authorization !== config.secret) {
        throw new Error('Authorization token mismatch');
    }

    const url = 'https://github.com/login/oauth/access_token';
    const options = {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({
            code: body.code,
            client_id: config.github.clientId,
            client_secret: config.github.clientSecret,
            redirect_uri: config.github.redirectUri,
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
