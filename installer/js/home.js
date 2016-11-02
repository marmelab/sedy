require ('react-tap-event-plugin')();

import React from 'react';
import ReactDOM from 'react-dom';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import GithubLogin from './GithubLogin';

ReactDOM.render(
    <MuiThemeProvider>
        <GithubLogin
            appId={GITHUB_APP_ID}
            scopes={GITHUB_SCOPES}
            redirectUri={`${APP_BASE_URL}${GITHUB_REDIRECTION}`}
        />
    </MuiThemeProvider>,
    document.getElementById('login')
);
