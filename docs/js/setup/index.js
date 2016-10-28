require ('react-tap-event-plugin')();

import React from 'react';
import ReactDOM from 'react-dom';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RepositoryList from './repositories/RepositoryList';

const repositories = require('./repositories.js')

ReactDOM.render(
    <MuiThemeProvider>
        <div className="wrapper">
            <p>You can enable/disable Sedy bot only on repositories you own.</p>
            <RepositoryList repositories={repositories} />
        </div>
    </MuiThemeProvider>,
    document.getElementById('setup')
);
