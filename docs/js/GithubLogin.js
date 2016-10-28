import FontIcon from 'material-ui/FontIcon';
import RaisedButton from 'material-ui/RaisedButton';
import React, { PropTypes } from 'react';

const GithubLogin = ({appId, scopes, redirectUri}) => {
    console.log(redirectUri);
    const href = `https://github.com/login/oauth/authorize?client_id=${appId}&scope=${encodeURIComponent(scopes.join(','))}&redirect_uri=${encodeURIComponent(redirectUri)}`;
    return (
        <RaisedButton
            label="Signin with GitHub"
            icon={<FontIcon className="github-icon" />}
            href={href}
        />
    );
};

GithubLogin.propTypes = {
    appId: PropTypes.string.isRequired,
    redirectUri: PropTypes.string.isRequired,
    scopes: PropTypes.array.isRequired,
};

export default GithubLogin;
