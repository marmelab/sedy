# Project Configuration

This projects supports various runtime environments. This means that you can switch to en entirely different configuration based on the `NODE_ENV` environment variable:

```sh
# run the API server in development mode (default)
$ node ./api/index.js
# run the API server in test mode
$ NODE_ENV=test node ./api/index.js
# run the API server in production mode
$ NODE_ENV=production node ./api/index.js
```

**Tip**: On the production servers, you should set the `NODE_ENV` variable using supervisor.

It uses [node-config](https://github.com/lorenwest/node-config) to let you configure the project for the development, test, and production environments. `node-config` supports configuration cascade, so the actual configuration for a given environment is the combination of `config/default.js` and `config/[NODE_ENV].js` (the configuration settings for a given environment override the default settings).

Before running the app in development, you must copy the `config/development-dist.js` into `config/development.js` (this is done by the `make install` command), and edit the server and database settings to your development environment. Same for the `test-dist.js` if you intend to run unit tests.
