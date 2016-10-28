import config from 'config';

const getUserInfo = token => {
    const headers = {
        Authorization: `token ${token}`,
    };

    return fetch(`${config.githubUrl}/user`, { headers })
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

const isContributorAdded = (user, repository) => {
    const headers = {
        Authorization: `token ${user.token}`,
    };

    // Response if user is a collaborator
    // Status: 204 No Content
    // Response if user is not a collaborator
    // Status: 404 Not Found

    return fetch(`${config.githubUrl}/repos/${user.name}/${repository.name}/collaborators/${config.sedyUsername}`, { headers})
        .then(response => Promise.resolve(response.status == 204));
};

const getHookId = (user, repository) => {
    const headers = {
        Authorization: `token ${user.token}`,
    };

    return fetch(`${config.githubUrl}/repos/${user.name}/${repository.name}/hooks`, { headers })
        .then(response => {
            if (!response.ok) {
                return response.text().then(result => Promise.reject(new Error(result)));
            }

            return response.json();
        })
        .then(
            (hooks) => {
                let sedyHooks = hooks.filter(hook => hook.config.url == config.webhookUrl);

                if(sedyHooks.length){
                    return sedyHooks[0].id;
                }
                return Promise.reject();
            },
            error => { error; }
        );
}

const isHookAdded = (user, repository) => {
    return getHookId(user, repository)
        .then((hookId) => true)
        .catch(() => false);

const isSedyInstalled = (user, repository) => {
    return Promise.all([
        isContributorAdded(user, repository),
        isHookAdded(user, repository),
    ]).then(values => {
        return values[0] && values [1];
    });
};

const getRepositories = (user, page = 1, perPage = 30) => {
    const headers = {
        Authorization: `token ${user.token}`,
    };

    return fetch(`${config.githubUrl}/user/repos?affiliation=owner&page=${page}&per_page=${perPage}`, { headers })
        .then(response => {
            if (!response.ok) {
                return response.text().then(result => Promise.reject(new Error(result)));
            }

            return response.json();
        })
        .then(
            repositories => {
                return Promise.all(
                    repositories.map(repository => {
                        return isSedyInstalled(user, repository);
                    })
                ).then((values) => {
                    return values.map((value, index) => ({...repositories[index], sedy_installed: value}));
                });
            },
            error => ({ error })
        );
};

const addHook = (user, repository) => () => {
    const options = {
        method: 'POST',
        headers: {
            Authorization: `token ${user.token}`,
        },
        body: JSON.stringify({
            name: 'web',
            active: true,
            events: ['pull_request_review_comment'],
            config: {
                url: config.webhookUrl,
                content_type: 'json',
            },
        }),
    };

    return fetch(`${config.githubUrl}/repos/${user.name}/${repository.name}/hooks`, options)
        .then(response => {
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

const addContributor = (user, repository) => {
    const options = {
        method: 'PUT',
        headers: {
            Authorization: `token ${user.token}`,
        },
    };

    return fetch(`${config.githubUrl}/repos/${user.name}/${repository.name}/collaborators/${config.sedyUsername}?permission=push`, options)
        .then(response => {
            if (!response.ok) {
                return response.text().then(result => Promise.reject(new Error(result)));
            }
            return Promise.resolve();
        });
};

const install = (user, repository) => {
    if(repository.sedy_installed) {
        return;
    }
    return Promise.all([
        addHook(user, repository),
        addContributor(user, repository),
    ]);
};

const removeHook = (user, repository) => {
    const options = {
        method: 'DELETE',
        headers: {
            Authorization: `token ${user.token}`,
        }
    };

    return getHookId(user, repository)
        .then((hookId) => {
            return fetch(`${config.githubUrl}/repos/${user.name}/${repository.name}/hooks/${hookId}`, options)
                .then(response => {
                    if (!response.ok) {
                        return response.text().then(result => Promise.reject(new Error(result)));
                    }
                    Promise.resolve();
                });
        });


};

const removeContributor = (user, repository) => {
    const options = {
        method: 'DELETE',
        headers: {
            Authorization: `token ${user.token}`,
        },
    };

    return fetch(`${config.githubUrl}/repos/${user.name}/${repository.name}/collaborators/${config.sedyUsername}`, options)
        .then(response => {
            if (!response.ok) {
                return response.text().then(result => Promise.reject(new Error(result)));
            }
            return Promise.resolve();
        });
};

const uninstall = (user, repository) => {
    if(!repository.sedy_installed) {
        return;
    }
    return Promise.all([
        removeHook(user, repository),
        removeContributor(user, repository),
    ]);
};

export default {
    getUserInfo,
    getRepositories,
    install,
    uninstall,
};
