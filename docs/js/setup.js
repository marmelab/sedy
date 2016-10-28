/* global GITHUB_APP_ID, GITHUB_SCOPES */
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
        />
    </MuiThemeProvider>,
    document.getElementById('setup')
);
