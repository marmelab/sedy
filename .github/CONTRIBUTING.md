Want to open a PR on Sedy? Thank you! Heare are a few things you need to know.

# Project organisation
This repository is splitted into three parts with very different roles.

- The actual Sedy code triggered by the GitHub webhook (`sedy`)
- The Sedy website hosted on https://marmelab.com/sedy/ (`installer`)
- An AWS lambda function which transforms GitHub code in access token (`oauth`)

They all contains their own `makefile` and `package.json`.

```bash
.
├── docs       # Built website served by GitHub pages
├── installer  # Website code
├── oauth      # AWS Lambda to transform code to access token
├── pm2        # Development server configuration
└── sedy       # AWS Lambda triggered by webhook
```

# Installation

```bash
git clone git@github.com:marmelab/sedy.git
cd sedy/
make install # Install the dependencies of the three projects
```

# Configuration

## Sedy
Create a new file `sedy/config/development.json` with the following informations:

```json
{
    "bot": {
        "login": "GITHUB-ACCOUNT",
        "oauthToken": "GITHUB-OAUTH-ACCESS-TOKEN"
    },
    "committer": {
        "name": "COMMITTER-NAME",
        "email": "an@example.mail"
    },
    "logs": {
        "debug": false
    }
}
```

Where:
- `GITHUB-ACCOUNT`: Your bot GitHub account username
- `GITHUB-OAUTH-ACCESS-TOKEN`: Your bot GitHub account password or personal access token
- `COMMITTER-NAME`: The name that'll appear on commits
- `an@example.mail`: The email that'll appear on commits

## Installer
Create a new file `installer/config/development.json` with the following informations:

```js
export default {
    github: {
        appId: 'xxxx',
        redirect_uri: 'http://localhost:8080',
    },
};
```

# Run the project

```bash
make run-sedy       # Run sedy API on port 3000
make run-oauth      # Run oauth API on port 3010
make run-installer  # Run installer on port through webpack on port 8080
make run            # A shortcut to run oauth & installer with PM2
make stop           # Stop PM2
```

To test you local code on a GitHub repository, you can expose your Sedy port on the internet with [ngrok](https://ngrok.com/):
```bash
ngrok http 3000
```

It will give you an ngrok endpoint `https://XXXXXXX.ngrok.io` that you can use as a GitHub webhook.


# Testing
No PR will be merged if the tests don't pass.

```bash
make test
```
