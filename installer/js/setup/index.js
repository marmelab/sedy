/* global APP_BASE_URL */
import injectTapEventPlugin from 'react-tap-event-plugin';

import React from 'react';
import ReactDOM from 'react-dom';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import { darkWhite } from 'material-ui/styles/colors';
import FlatButton from 'material-ui/FlatButton';

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
        cursor: 'pointer',
    },
    wrapper: {
        color: darkWhite,
        margin: 'auto',
        maxWidth: '60rem',
        paddingTop: 60,
    },
};

const homeRedirection = () => {
    window.location.href = APP_BASE_URL;
};

const onLogout = () => {
    window.localStorage.removeItem('accessToken');
    window.localStorage.removeItem('user');
    homeRedirection();
};

ReactDOM.render(
    <MuiThemeProvider>
        <div>
            <AppBar
                title="Sedy"
                style={styles.appBar}
                titleStyle={styles.appBarTitle}
                showMenuIconButton={false}
                onTitleTouchTap={homeRedirection}
                iconElementRight={<FlatButton label="Logout" onClick={onLogout} />}
            />
            <div style={styles.wrapper}>
                <p>You can enable/disable Sedy bot only on repositories you own.</p>
                <RepositoryList />
            </div>
        </div>
    </MuiThemeProvider>,
    document.getElementById('setup'),
);
