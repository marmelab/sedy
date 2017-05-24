Want to open a PR on Sedy? Thank you! Here are a few things you need to know.

# Project organisation
This repository is splitted into two parts.

- The actual Sedy code triggered by the GitHub webhook (`sedy`)
- The Sedy website hosted on https://marmelab.com/sedy/ (`installer`)

They all contain their own `makefile` and `package.json`.

```bash
.
├── docs       # Built website served by GitHub pages
├── installer  # Website code
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
Create a new `sedy/config/development.json` with the following informations:

```json
{
    "bot": {
        "login": "GITHUB-ACCOUNT",
        "oauthToken": "GITHUB-OAUTH-ACCESS-TOKEN",
        "appId": "GITHUB-APP-ID"
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
- `GITHUB-APP-ID`: You GitHub Application id (if needed)
- `COMMITTER-NAME`: The name that'll appear on commits
- `an@example.mail`: The email that'll appear on commits


# Run the project

```bash
make run-sedy       # Run sedy API on port 3000
make run-installer  # Run installer on port through webpack on port 8080
```

To test you local code on a GitHub repository, expose your Sedy port on the internet with [ngrok](https://ngrok.com/):
```bash
ngrok http 3000
```

It will give you an ngrok endpoint `https://XXXXXXX.ngrok.io` that you can use as a GitHub webhook.


# Testing
No PR will be merged if the tests don't pass.

```bash
make test
```
