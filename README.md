[![Build Status](https://travis-ci.org/marmelab/sedbot.js.svg)](https://travis-ci.org/marmelab/sedbot.js)

# SedBot.js
A github webhook which helps you to correct your commits

# Install npm dependencies

```bash
make install
```

# Run project

```bash
make run
```

You should locally use [ngrok](https://ngrok.com/) to expose your port for link with Github.

For example: With the command `ngrok http 3000` you'll get a link like `https://XXXXXXXXX.ngrok.io/` that you can use as a webhook.

Don't forget to configure your webhook to push these events: **Pull Request review comment** and **Issue comment**. All other events will be ignored.

# Unit-testing

```bash
make test
```
