require ('react-tap-event-plugin')();

import React from 'react';
import ReactDOM from 'react-dom';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import FontIcon from 'material-ui/FontIcon';

ReactDOM.render(
    <MuiThemeProvider>
        <RaisedButton
            label="Signin with GitHub"
            icon={<FontIcon className="github-icon" />}
        />
    </MuiThemeProvider>,
    document.getElementById('setup')
);
