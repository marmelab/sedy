import FontIcon from 'material-ui/FontIcon';
import RaisedButton from 'material-ui/RaisedButton';
import React, { Component, PropTypes } from 'react';
import { darkWhite } from 'material-ui/styles/colors';

import { authenticate } from './';

const styles = {
    p: {
        color: darkWhite,
        fontSize: 20,
        lineHeight: '28px',
        paddingTop: 19,
        marginBottom: 13,
        letterSpacing: 0,
        textAlign: 'center',
    },
    button: {
        display: 'inline-block',
        margin: '0 1rem',
    },
};

class GithubLogin extends Component {
    onPublicClick = () => authenticate();
    onPrivateClick = () => authenticate(true);

    render() {
        return (
            <div style={styles.p}>
                {this.props.text}
                <div style={styles.button}>
                    <RaisedButton
                        onClick={this.onPublicClick}
                        onTouchTap={this.onClick}
                        label="Authorize on Public Repositories"
                        icon={<FontIcon className="github-icon" />}
                    />
                </div>
                <div style={styles.button}>
                    <RaisedButton
                        onClick={this.onClick}
                        onTouchTap={this.onPrivateClick}
                        label="Authorize on Private & Public Repositories"
                        icon={<FontIcon className="github-icon" />}
                    />
                </div>
            </div>
        );
    }
}

GithubLogin.propTypes = {
    text: PropTypes.node,
};

GithubLogin.defaultProps = {
    text: <p>To start using <b>Sedy</b>, sign-in with your github account and assign <b>Sedy</b> to any repository.</p>,
};

export default GithubLogin;
