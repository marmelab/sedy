/* global config, SEDY_USERNAME, WEBHOOK_URL */

import { getWindowSearchParams } from './utils';

export const authenticate = () => {
    const { github } = config;
    const params = {
        'client_id': github.appId, // eslint-disable-line quote-props
        'redirect_uri': github.redirect_uri, // eslint-disable-line quote-props
        scope: github.scopes.join(' '),
    };

    window.location.href = `${github.url}/login/oauth/authorize?` + Object // eslint-disable-line prefer-template
        .keys(params)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`, '')
        .join('&');
};

export const digestGithubRedirection = () => new Promise((resolve, reject) => {
    const { code } = getWindowSearchParams();

    if (!code) {
        return resolve(false);
    }

    const options = {
        method: 'POST',
        headers: {
            Authorization: `token ${config.oauth.secret}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
    };

    return fetch(config.oauth.url, options)
        .then((response) => {
            if (!response.ok) {
                return response.text().then(result => reject(new Error(result)));
            }

            return response.json();
        })
        .then((response) => {
            const accessToken = response.body.access_token;
            if (accessToken) {
                return resolve(accessToken);
            }

            return resolve(false);
        })
        .catch(reject);
});

export const getUserInfo = (token) => {
    const headers = {
        Authorization: `token ${token}`,
    };

    return fetch(`${config.github.api}/user`, { headers })
        .then((response) => {
            if (!response.ok) {
                return response.text().then(result => Promise.reject(new Error(result)));
            }

            return response.json();
        })
        .then(
            user => ({ user }),
            error => ({ error }),
        );
};

const isContributorAdded = (accessToken, user, repository) => {
    const headers = {
        Authorization: `token ${accessToken}`,
    };

    // Response if user is a collaborator
    // Status: 204 No Content
    // Response if user is not a collaborator
    // Status: 404 Not Found

    return fetch(`${config.github.api}/repos/${user.user.login}/${repository.name}/collaborators/${SEDY_USERNAME}`, { headers })
        .then(response => Promise.resolve(response.status === 204));
};

const getHookId = (accessToken, user, repository) => {
    const headers = {
        Authorization: `token ${accessToken}`,
    };

    return fetch(`${config.github.api}/repos/${user.user.login}/${repository.name}/hooks`, { headers })
        .then((response) => {
            if (!response.ok) {
                return response.text().then(result => Promise.reject(new Error(result)));
            }

            return response.json();
        })
        .then((hooks) => {
            const sedyHooks = hooks.filter(hook => hook.config.url === WEBHOOK_URL);

            if (sedyHooks.length) {
                return sedyHooks[0].id;
            }
            return Promise.reject();
        }, error => error);
};

const isHookAdded = (accessToken, user, repository) => getHookId(accessToken, user, repository)
    .then(() => true, () => false);

const isSedyInstalled = (accessToken, user, repository) =>
    Promise.all([
        isContributorAdded(accessToken, user, repository),
        isHookAdded(accessToken, user, repository),
    ])
    .then(values => values[0] && values[1]);

export const getRepositories = (accessToken, user, page = 1, perPage = 30) => {
    const headers = {
        Authorization: `token ${accessToken}`,
    };

    return fetch(`${config.github.api}/user/repos?affiliation=owner&page=${page}&per_page=${perPage}`, { headers })
        .then((response) => {
            if (!response.ok) {
                return response.text().then(result => Promise.reject(new Error(result)));
            }

            return response.json();
        })
        .then(repositories => Promise.all(repositories.map(r => isSedyInstalled(accessToken, user, r)))
            .then(sedyInstallations => repositories.map((repository, index) => ({
                ...repository,
                sedy_installed: sedyInstallations[index],
            })),
        ));
};

const addHook = (accessToken, user, repository) => {
    const options = {
        method: 'POST',
        headers: {
            Authorization: `token ${accessToken}`,
        },
        body: JSON.stringify({
            name: 'web',
            active: true,
            events: config.requestedScopes,
            config: {
                url: WEBHOOK_URL,
                content_type: 'json',
            },
        }),
    };

    return fetch(`${config.github.api}/repos/${user.user.login}/${repository.name}/hooks`, options)
        .then((response) => {
            if (!response.ok) {
                return response.text().then(result => Promise.reject(new Error(result)));
            }

            return response.json();
        })
        .then(
            () => ({ ...repository }),
            error => ({ error }),
        );
};

const addContributor = (accessToken, user, repository) => {
    const options = {
        method: 'PUT',
        headers: {
            Authorization: `token ${accessToken}`,
        },
    };

    return fetch(`${config.github.api}/repos/${user.user.login}/${repository.name}/collaborators/${SEDY_USERNAME}?permission=push`, options)
        .then((response) => {
            if (!response.ok) {
                return response.text().then(result => Promise.reject(new Error(result)));
            }
            return Promise.resolve();
        });
};

export const install = (accessToken, user, repository) => Promise.all([
    addHook(accessToken, user, repository),
    addContributor(accessToken, user, repository),
]);

const removeHook = (accessToken, user, repository) => {
    const options = {
        method: 'DELETE',
        headers: {
            Authorization: `token ${accessToken}`,
        },
    };

    return getHookId(accessToken, user, repository)
        .then((hookId) => {
            return fetch(`${config.github.api}/repos/${user.user.login}/${repository.name}/hooks/${hookId}`, options)
                .then((response) => {
                    if (!response.ok) {
                        return response.text().then(result => Promise.reject(new Error(result)));
                    }

                    return Promise.resolve();
                });
        });
};

const removeContributor = (accessToken, user, repository) => {
    const options = {
        method: 'DELETE',
        headers: {
            Authorization: `token ${accessToken}`,
        },
    };

    return fetch(`${config.github.api}/repos/${user.user.login}/${repository.name}/collaborators/${SEDY_USERNAME}`, options)
        .then((response) => {
            if (!response.ok) {
                return response.text().then(result => Promise.reject(new Error(result)));
            }

            return Promise.resolve();
        });
};

export const uninstall = (accessToken, user, repository) => Promise.all([
    removeHook(accessToken, user, repository),
    removeContributor(accessToken, user, repository),
]);
