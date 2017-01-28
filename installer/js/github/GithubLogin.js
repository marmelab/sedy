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
};

class GithubLogin extends Component {
    onClick = () => authenticate();

    render() {
        return (
            <div style={styles.p}>
                {this.props.text}
                <RaisedButton
                    onClick={this.onClick}
                    onTouchTap={this.onClick}
                    label="Signin with GitHub"
                    icon={<FontIcon className="github-icon" />}
                />
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
