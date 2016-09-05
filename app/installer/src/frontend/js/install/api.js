const githubUrl = 'https://api.github.com';

const retrieveUserRepositories = user => () => {
    const headers = {
        Authorization: `token ${user.token}`,
    };

    return fetch(`${githubUrl}/user/repos`, { headers })
        .then(response => {
            if (!response.ok) {
                return response.text().then(result => Promise.reject(new Error(result)));
            }

            return response.json();
        })
        .then(
            repositories => ({ repositories }),
            error => ({ error })
        );
};

const installRepositoryHook = (user, repository) => () => {
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
                url: 'https://sedy.marmelab.com',
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
            () => ({ ...repository, hookInstalled: true }),
            error => ({ error })
        );
};

export default {
    retrieveUserRepositories,
    installRepositoryHook,
};
