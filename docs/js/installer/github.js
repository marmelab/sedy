import hello from 'hellojs';

export const authenticate = () => new Promise((resolve, reject) => {
    hello.init({
        github: GITHUB_APP_ID,
    }, {
        redirect_uri: GITHUB_REDIRECTION,
    });

    hello
        .login('github', { scope: GITHUB_SCOPES })
        .then(auth => {
            resolve({
                accessToken: auth.authResponse.access_token,
            });
        }, reject);
});

export const getUserInfo = token => {
    const headers = {
        Authorization: `token ${token}`,
    };

    return fetch(`${GITHUB_URL}/user`, { headers })
        .then(response => {
            if (!response.ok) {
                return response.text().then(result => Promise.reject(new Error(result)));
            }

            return response.json();
        })
        .then(
            user => ({ user }),
            error => ({ error })
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

    return fetch(`${GITHUB_URL}/repos/${user.user.login}/${repository.name}/collaborators/${SEDY_USERNAME}`, { headers })
        .then(response => Promise.resolve(response.status == 204));
};

const getHookId = (accessToken, user, repository) => {
    const headers = {
        Authorization: `token ${accessToken}`,
    };

    return fetch(`${GITHUB_URL}/repos/${user.user.login}/${repository.name}/hooks`, { headers })
        .then(response => {
            if (!response.ok) {
                return response.text().then(result => Promise.reject(new Error(result)));
            }

            return response.json();
        })
        .then(
            (hooks) => {
                let sedyHooks = hooks.filter(hook => hook.config.url == WEBHOOK_URL);

                if(sedyHooks.length){
                    return sedyHooks[0].id;
                }
                return Promise.reject();
            },
            error => { error; }
        );
}

const isHookAdded = (accessToken, user, repository) => getHookId(accessToken, user, repository)
    .then(hookId => true, () => false);

const isSedyInstalled = (accessToken, user, repository) => {
    return Promise.all([
        isContributorAdded(accessToken, user, repository),
        isHookAdded(accessToken, user, repository),
    ]).then(values => {
        return values[0] && values[1];
    });
};

export const getRepositories = (accessToken, user, page = 1, perPage = 30) => {
    const headers = {
        Authorization: `token ${accessToken}`,
    };

    return fetch(`${GITHUB_URL}/user/repos?affiliation=owner&page=${page}&per_page=${perPage}`, { headers })
        .then(response => {
            if (!response.ok) {
                return response.text().then(result => Promise.reject(new Error(result)));
            }

            return response.json();
        })
        .then(repositories => {
            return Promise.all(
                repositories.map(r => isSedyInstalled(accessToken, user, r))
            ).then(sedyInstallations => repositories.map((repository, index) => ({
                ...repository,
                sedy_installed: sedyInstallations[index],
            })));
        })
        .then(r => {
            console.log(r); return r;
        });
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
            events: ['pull_request_review_comment'],
            config: {
                url: WEBHOOK_URL,
                content_type: 'json',
            },
        }),
    };

    return fetch(`${GITHUB_URL}/repos/${user.user.login}/${repository.name}/hooks`, options)
        .then(response => {
            if (repository.full_name === 'jpetitcolas/cartouche-decoder') {
                console.log(response.json());
            }
            if (!response.ok) {
                return response.text().then(result => Promise.reject(new Error(result)));
            }

            return response.json();
        })
        .then(
            () => ({ ...repository}),
            error => ({ error })
        );
};

const addContributor = (accessToken, user, repository) => {
    const options = {
        method: 'PUT',
        headers: {
            Authorization: `token ${accessToken}`,
        },
    };

    return fetch(`${GITHUB_URL}/repos/${user.user.login}/${repository.name}/collaborators/${SEDY_USERNAME}?permission=push`, options)
        .then(response => {
            if (!response.ok) {
                return response.text().then(result => Promise.reject(new Error(result)));
            }
            return Promise.resolve();
        });
};

export const install = (accessToken, user, repository) => {
    if(repository.sedy_installed) {
        return;
    }
    return Promise.all([
        addHook(accessToken, user, repository),
        addContributor(accessToken, user, repository),
    ]);
};

const removeHook = (accessToken, user, repository) => {
    const options = {
        method: 'DELETE',
        headers: {
            Authorization: `token ${accessToken}`,
        }
    };

    return getHookId(user, repository)
        .then((hookId) => {
            return fetch(`${GITHUB_URL}/repos/${user.user.login}/${repository.name}/hooks/${hookId}`, options)
                .then(response => {
                    if (!response.ok) {
                        return response.text().then(result => Promise.reject(new Error(result)));
                    }
                    Promise.resolve();
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

    return fetch(`${GITHUB_URL}/repos/${user.user.login}/${repository.name}/collaborators/${SEDY_USERNAME}`, options)
        .then(response => {
            if (!response.ok) {
                return response.text().then(result => Promise.reject(new Error(result)));
            }
            return Promise.resolve();
        });
};

export const uninstall = (accessToken, user, repository) => {
    if(!repository.sedy_installed) {
        return Promise.resolve();
    }

    return Promise.all([
        removeHook(accessToken, user, repository),
        removeContributor(accessToken, user, repository),
    ]);
};
