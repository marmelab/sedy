require ('react-tap-event-plugin')();

import { getUserInfo } from '../installer/github';

import React from 'react';
import ReactDOM from 'react-dom';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RepositoryList from './repositories/RepositoryList';

ReactDOM.render(
    <MuiThemeProvider>
        <div className="wrapper">
            <p>You can enable/disable Sedy bot only on repositories you own.</p>
            <RepositoryList />
        </div>
    </MuiThemeProvider>,
    document.getElementById('setup')
);
