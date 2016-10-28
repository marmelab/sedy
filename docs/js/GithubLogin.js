import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import FontIcon from 'material-ui/FontIcon';

const GithubLogin = () => (
    <RaisedButton
        label="Signin with GitHub"
        icon={<FontIcon className="github-icon" />}
        href="https://github.com/login/oauth/authorize?client_id=xxx&scope=repo"
    />
);

export default GithubLogin;
