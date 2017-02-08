/* global config */
import injectTapEventPlugin from 'react-tap-event-plugin';

import React from 'react';
import ReactDOM from 'react-dom';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { Card, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import typography from 'material-ui/styles/typography';
import { darkWhite } from 'material-ui/styles/colors';
import GithubLogin from './github/GithubLogin';
import FullWidthSection from './FullWidthSection';

import { digestGithubRedirection, getUserInfo } from './github';

digestGithubRedirection().then((token) => {
    if (token) {
        window.localStorage.setItem('accessToken', token);
        getUserInfo(token).then((user) => {
            window.localStorage.setItem('user', JSON.stringify(user));
            window.location.href = config.setup;
        });
    }
});

const isMobile = window.innerWidth <= 640;
const images = {
    comment: require(`../images/pr_sed_comment${isMobile ? '_mobile' : ''}.png`), // eslint-disable-line
    commit: require(`../images/pr_sed_commit${isMobile ? '_mobile' : ''}.png`),  // eslint-disable-line
    diff: require(`../images/pr_sed_diff${isMobile ? '_mobile' : ''}.png`), // eslint-disable-line
};

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

const styles = {
    root: {
        overflow: 'hidden',
    },
    h1: {
        color: darkWhite,
        fontWeight: typography.fontWeightLight,
        textAlign: 'center',
        fontSize: 50,
    },
    mainH2: {
        color: darkWhite,
        fontSize: 30,
        lineHeight: '28px',
        paddingTop: 19,
        marginBottom: 13,
        letterSpacing: 0,
        textAlign: 'center',
    },
    h2: {
        color: darkWhite,
        fontSize: 25,
        lineHeight: '28px',
        paddingTop: 48,
        marginBottom: 25,
        letterSpacing: 0,
    },
    card: {
        marginBottom: '1rem',
    },
};

ReactDOM.render(
    <MuiThemeProvider>
        <div>
            <FullWidthSection style={styles.root}>
                <div style={styles.tagline}>
                    <h1 style={styles.h1}>Sedy</h1>
                    <h2 style={styles.mainH2}>
                        A bot listening to PR comments in GitHub to fix typos for you
                    </h2>
                </div>
            </FullWidthSection>

            <GithubLogin />

            <div className="wrapper">
                <h2 style={styles.h2}>What does it look like?</h2>
                <Card style={styles.card}>
                    <CardTitle title="1. Comment a pull request with a sed command" />
                    <CardMedia>
                        <img alt="Comment a PR" src={images.comment} />
                    </CardMedia>
                </Card>
                <Card style={styles.card}>
                    <CardTitle title="2. Watch sedy do its job" />
                    <CardMedia>
                        <img alt="Watch Sedy" src={images.commit} />
                    </CardMedia>
                </Card>
                <Card style={styles.card}>
                    <CardTitle title="3. Relax :)" />
                    <CardMedia>
                        <img alt="Relax" src={images.diff} />
                    </CardMedia>
                </Card>
                <GithubLogin />
                <h2 style={styles.h2}>How does it work?</h2>
                <Card style={styles.card}>
                    <CardTitle title="It's just a webhook" />
                    <CardText>
                        <p>You simply need to register the sedy webhook for the following events:</p>
                        <ul>
                            <li>Pull request review comment</li>
                            <li>Pull request review</li>
                        </ul>

                        <p>This website will make the webhook registration process a bliss!</p>
                        <p><strong>The GitHub user <a href="https://github.com/sedy-bot">Sedy Bot</a> will receive permission to commit on your repository.</strong></p>
                    </CardText>
                </Card>
                <Card style={styles.card}>
                    <CardTitle title="It checks comments for sed substitution commands" />
                    <CardText>
                        <p>
                            Whenever a new single comment is added, or a new review is submitted,
                            sedy will check the comments for sed substitution syntax:
                        </p>
                        <code>
                            s/[TEXT TO FIND]/[REPLACEMENT]/
                        </code>

                        <p>
                            When it finds one, it will checkout the pull request branch,
                            perform the sed substitution and commit the result.
                        </p>
                    </CardText>
                </Card>
                <Card style={styles.card}>
                    <CardTitle title="Limitations" />
                    <CardText>
                        <p>
                            <b>sed</b> does far more than simple substitution,
                            however, we currently only support the most simple one.
                        </p>
                        <p>In time, we will add support for regular expressions, global flags, and so on.</p>
                        <p>Feel free to <a href="https://github.com/marmelab/sedy/issues">open an issue</a> with your suggestions!</p>
                    </CardText>
                </Card>
                <h2 style={styles.h2}>{"It's Open Source!"}</h2>
                <Card style={styles.card}>
                    <CardText>
                        <p>
                            The project is open-source and available <a href="https://github.com/marmelab/sedy">here on github</a>,
                            courtesy of <a href="http://marmelab.com/">Marmelab</a>.
                        </p>
                    </CardText>
                </Card>
            </div>
        </div>
    </MuiThemeProvider>,
    document.getElementById('login'),
);
