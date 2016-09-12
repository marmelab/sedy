module.exports = {
    appName: 'Sedy Installer',
    apps: {
        frontend: {
            url: 'http://localhost:8080',
            enableDevTools: true,
        },
    },
    github: {
        token: 'TOKEN',
    },
    babel_ignore: /node_modules\/(?!admin-config|fakerest)/,
};
