/* global fetch */
const githubUrl = 'https://api.github.com';
const webhookUrl = 'https://sedy.marmelab.com';
const sedyUsername = 'sedy-bot';


const isContributorAdded = (user, repository) => {
    const headers = {
        Authorization: `token ${user.token}`,
    };

    // Response if user is a collaborator
    // Status: 204 No Content
    // Response if user is not a collaborator
    // Status: 404 Not Found

    return fetch(`${githubUrl}/repos/${user.name}/${repository.name}/collaborators/${sedyUsername}`, { headers})
        .then(response => Promise.resolve(response.status == 204));
};

const isHookAdded = (user, repository) => {
    const headers = {
        Authorization: `token ${user.token}`,
    };

    return fetch(`${githubUrl}/repos/${user.name}/${repository.name}/hooks`, { headers })
        .then(response => {
            if (!response.ok) {
                return response.text().then(result => Promise.reject(new Error(result)));
            }

            return response.json();
        })
        .then(
            (hooks) => hooks.filter(hook => hook.config.url == webhookUrl).length > 0,
            error => { error; }
        );
};

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

    return fetch(`${githubUrl}/user/repos?affiliation=owner&page=${page}&per_page=${perPage}`, { headers })
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
                url: webhookUrl,
                content_type: 'json',
            },
        }),
    };

    return fetch(`${githubUrl}/repos/${user.name}/${repository.name}/hooks`, options)
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

    return fetch(`${githubUrl}/repos/${user.name}/${repository.name}/collaborators/${sedyUsername}?permission=push`, options)
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

export default {
    getRepositories,
    install,
};
