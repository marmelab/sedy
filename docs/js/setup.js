require ('react-tap-event-plugin')();

import React from 'react';
import ReactDOM from 'react-dom';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import GithubLogin from './GithubLogin';

ReactDOM.render(
    <MuiThemeProvider>
        <GithubLogin />
    </MuiThemeProvider>,
    document.getElementById('setup')
);
