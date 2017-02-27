export default {
    appBaseUrl: 'http://localhost:8080',
    webhookUrl: 'https://sedy.marmelab.com',
    sedyUsername: 'sedy-bot',
    ga: false,
    setup: 'http://localhost:8080/setup',
    github: {
        url: 'https://github.com',
        api: 'https://api.github.com',
        appId: 'xxx',
        publicScopes: ['write:repo_hook', 'public_repo'],
        privateScopes: ['write:repo_hook', 'repo'],
        redirect_uri: 'http://localhost:8080',
    },
    oauth: {
        url: 'http://localhost:3010',
        secret: 'MY-VERY-PRIVATE-OAUTH-SECRET',
    },
    requestedScopes: ['pull_request_review'],
};
