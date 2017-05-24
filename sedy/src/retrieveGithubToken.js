/* global GITHUB_APP_PRIVATE_KEY */
import jwt from 'jsonwebtoken';
import request from 'request';

const INTEGRATION_HEADER = 'application/vnd.github.machine-man-preview+json';

const retrieveGithubToken = function* (config, eventBody) {
    const installationId = eventBody.installation && eventBody.installation.id;

    if (!installationId) {
        // Return the oauthToken if specified in the configuration (a GitHub user or a bot)
        return config.oauthToken;
    }

    const now = Math.floor(Date.now() / 1000);
    const payload = {
        iat: now,
        exp: now + 60,
        iss: config.appId,
    };

    const token = jwt.sign(payload, GITHUB_APP_PRIVATE_KEY, { algorithm: 'RS256' });

    const headers = {
        Accept: INTEGRATION_HEADER,
        Authorization: `Bearer ${token}`,
        'User-Agent': 'Sedy-Bot',
    };

    const url = `https://api.github.com/installations/${installationId}/access_tokens`;
    const response = yield cb => request.post(url, { headers }, (err, res) => cb(err, res));

    const responseBody = JSON.parse(response.body);

    if (!responseBody.token) {
        throw new Error(`Unable to retrieve a token: ${responseBody.message}`);
    }

    return responseBody.token;
};

export default retrieveGithubToken;
