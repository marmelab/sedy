/* global GITHUB_INTEGRATION_PRIVATE_KEY */
import jwt from 'jsonwebtoken';
import request from 'request';

const integrationPreviewHeader = 'application/vnd.github.machine-man-preview+json';

const retrieveGithubToken = function* (config, eventBody) {
    const installationId = eventBody.installation && eventBody.installation.id;

    if (!installationId) {
        return config.oauthToken;
    }

    const now = Math.floor(Date.now() / 1000);
    const payload = {
        iat: now,
        exp: now + 60,
        iss: config.integrationId,
    };

    const token = jwt.sign(payload, GITHUB_INTEGRATION_PRIVATE_KEY, { algorithm: 'RS256' });

    const headers = {
        Accept: integrationPreviewHeader,
        Authorization: `Bearer ${token}`,
        'User-Agent': 'Sedy-Bot',
    };

    const url = `https://api.github.com/installations/${installationId}/access_tokens`;
    const response = yield cb => request.post(url, { headers }, (err, res) => cb(err, res));

    return JSON.parse(response.body).token;
};

export default retrieveGithubToken;
