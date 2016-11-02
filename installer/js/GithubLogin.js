import FontIcon from 'material-ui/FontIcon';
import RaisedButton from 'material-ui/RaisedButton';
import React, { Component, PropTypes } from 'react';

import { authenticate, getUserInfo } from './installer/github';

class GithubLogin extends Component {
    onClick = () => {
        authenticate()
            .then(({ accessToken }) => {
                window.localStorage.setItem('accessToken', accessToken);
                getUserInfo(accessToken).then(
                    user => {
                        window.localStorage.setItem('user', JSON.stringify(user));
                        window.location.href = '/setup';
                    },
                );
            });
    };

    render() {
        return (
            <RaisedButton
                onClick={this.onClick}
                onTouchTap={this.onClick}
                label="Signin with GitHub"
                icon={<FontIcon className="github-icon" />}
            />
        );
    }
}

GithubLogin.propTypes = {
    appId: PropTypes.string.isRequired,
    redirectUri: PropTypes.string.isRequired,
    scopes: PropTypes.array.isRequired,
};

export default GithubLogin;
