import React from 'react';
import FontIcon from 'material-ui/FontIcon';
import RaisedButton from 'material-ui/RaisedButton';
import { darkWhite } from 'material-ui/styles/colors';

const styles = {
    container: {
        color: darkWhite,
        fontSize: 20,
        lineHeight: '28px',
        paddingTop: 19,
        marginBottom: 13,
        letterSpacing: 0,
        textAlign: 'center',
    },
    button: {
        margin: '0 1rem',
    },
};

const redirect = () => {
    window.location = 'https://github.com/apps/sedy';
};

export default () => (
    <div style={styles.container}>
        <p><strong>Sedy</strong> is a <a href="https://github.com/marketplace">GitHub App</a>, just install it on your repository and you can use it!</p>
        <div style={styles.button}>
            <RaisedButton
                onClick={redirect}
                onTouchTap={redirect}
                label="Install Sedy"
                icon={<FontIcon className="github-icon" />}
            />
        </div>
    </div>
);
