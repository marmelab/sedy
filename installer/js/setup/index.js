import injectTapEventPlugin from 'react-tap-event-plugin';

import { getUserInfo } from '../installer/github';

import React from 'react';
import ReactDOM from 'react-dom';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import { darkWhite } from 'material-ui/styles/colors';
import RepositoryList from './repositories/RepositoryList';

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

const styles = {
    appBar: {
        backgroundColor: '#65658E',
        position: 'fixed',
        top: 0,
    },
    appBarTitle: {
        color: '#92A8D1',
    },
    wrapper: {
        color: darkWhite,
        margin: 'auto',
        maxWidth: '60rem',
        paddingTop: 60,
    },
};

ReactDOM.render(
    <MuiThemeProvider>
        <div>
            <AppBar
                title="Sedy"
                style={styles.appBar}
                showMenuIconButton={false}
            />
            <div style={styles.wrapper}>
                <p>You can enable/disable Sedy bot only on repositories you own.</p>
                <RepositoryList />
            </div>
        </div>
    </MuiThemeProvider>,
    document.getElementById('setup')
);
