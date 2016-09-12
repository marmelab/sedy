/* global APP_URL, GITHUB_CLIENT_ID */
import hello from 'hellojs';

const githubUrl = 'https://api.github.com';

const signInWithGithub = () => new Promise(resolve => {
    hello.init({
        github: GITHUB_CLIENT_ID,
    }, {
        redirect_uri: `${APP_URL}/github/callback`,
    });

    hello
        .login('github', { scope: ['write:repo_hook'] })
        .then(auth => {
            resolve({
                accessToken: auth.authResponse.access_token,
            });
        }, err => resolve({ error: err.error }));
});

const retrieveUserGithubInfos = token => () => {
    const headers = {
        Authorization: `token ${token}`,
    };

    return fetch(`${githubUrl}/user`, { headers })
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

export default {
    signInWithGithub,
    retrieveUserGithubInfos,
};
