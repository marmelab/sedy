# marmelab-boilerplate [![Build Status](https://travis-ci.org/marmelab/javascript-boilerplate.svg?branch=master)](https://travis-ci.org/marmelab/javascript-boilerplate)

A starter kit for new apps, based on:

* ES6 everywhere (with some bits of ES7, e.g. spread operator on objects)
* React.js, React Router, and Redux (for the frontend)
* Angular.js and ng-admin (for the admin)
* Node.js, Koa.js and PostgreSQL (for the API server)
* Makefile, webpack and Mocha (for the build and test)

Features:

* Babel transpilation (es2015, react, stage-0) for both client and server code
* Node.js API built on top of Koa.js (successor of Express) for cleaner async code
* Automated CRUD resources based on a PostgreSQL database (using `pg` and `co-pg`)
* State-of the art robustness and security for the API (JWT, rate limiting, secure headers, based on `helmet`)
* Separated API for the admin, with different security settings (and login form)
* Built-in database migration handling (using `db-migrate`)
* Production-level logging (using `winston`)
* CORS support (including on IE8, thanks to `xDomain`)
* Fully automated start and stop (see `Makefile`)
* Auto-reload of Node.js code upon modification (using `pm2`)
* Frontend app built with React, `redux`, `redux-saga`, `react-router`, and `redux-form`
* Using `react-dev-tools` and hot reload for easier development
* SASS preprocessor (using `node-sass`)
* Including a non-trivial example with several routes, Ajax calls, and functional tests
* Fully automated build with `webpack`, including development (`webpack-dev-server`) and production target (minified)
* Admin app built with Angular and `ng-admin`
* Including a full-featured admin panel with references
* Unified test build, running unit and functional tests on all apps, powered by `mocha`, `selenium`, and `nightwatch`
* AWS deployment automated by Fabric
* Sensible `eslint` defaults, based on Airbnb's rules

The boilerplate contains a sample app with three domains: users, products, and orders. Feel free to remove the corresponding files once you start implementing your own domain.

## Install

Requirements:

* Node.js V5
* PostgreSQL

```sh
# install npm dependencies and Selenium (for tests)
make install
```

## Understand

The project directory structure is as follows:

![architecture](doc/api-centric-architecture.png)

```
bin/ # CLI tasks
build/ # compiled JS and CSS files for the admin and frontend app. The web root in production.
config/ # Project configuration
doc/
e2e/ # Functional tests
src/
  api/ # The server API code (Node.js, Koa.js)
  admin/ # The admin dashboard code (Angular.js, ng-admin)
  frontend/ # The frontend code (React.js, Redux)
  isomorphic/ # Code common to several apps
webpack/ # Webpack configuration (for admin and frontend compilation)
```

The entire code (api, admin, and frontend) is written in ES6 and transpiled to ES5 by babel.

**Tip**: In production, the compiled JS and CSS files (under `build/`) are served by the Node.js server. In development, it's done by webpack-dev-server.

The main entry point for understanding the code is probably `src/api/server.js`.

## Project Configuration

This projects supports various runtime environments. This means that you can switch to an entirely different configuration based on the `NODE_ENV` environment variable:

```sh
# run the API server in development mode (default)
$ node ./src/api/index.js
# run the API server in test mode
$ NODE_ENV=test node ./src/api/index.js
# run the API server in production mode
$ NODE_ENV=production node ./src/api/index.js
```

**Tip**: On the production servers, you should set the `NODE_ENV` variable using supervisor.

It uses [node-config](https://github.com/lorenwest/node-config) to let you configure the project for the development, test, and production environments. `node-config` supports configuration cascade, so the actual configuration for a given environment is the combination of `config/default.js` and `config/[NODE_ENV].js` (the configuration settings for a given environment override the default settings).

Before running the app in development, you must copy the `config/development-dist.js` into `config/development.js` (this is done by the `make install` command), and edit the server and database settings to your development environment. Same for the `test-dist.js` if you intend to run unit tests.

**Note**: You need to remove all the demo code before to start your project. A [pull request is in progress](https://github.com/marmelab/javascript-boilerplate/pull/22) to do so, but this will take some time to finish it. Meanwhile, take a look on these folders to manually clean the code:
- [src/api](src/api)
- [src/frontend](src/frontend)
- [src/admin](src/admin)
- [e2e/api](e2e/api)
- [e2e/frontend](e2e/frontend)

## Develop

This project uses [pm2](https://github.com/Unitech/pm2) to manage its processes. Configuration files for pm2 can be found in the `./config/pm2_servers/` directory.

```sh
# start servers (node and webpack via pm2)
make run-dev
# both servers will run in the background
# the Node server uses nodemon and will restart on code change
# the frontend is served by webpack dev server with hot reload

# you can restart either the api or the frontend by hand
make restart-api
make restart-frontend
```

Browse the app:

* [http://localhost:8080/admin](http://localhost:8080/admin) for the admin app
* [http://localhost:8080/frontend](http://localhost:8080/frontend) for the frontend app
* [http://localhost:3000](http://localhost:3000) for the API

**Tip**: You can change the API port by running `NODE_PORT=3001 make run-dev`. Or, for persistent change, you can add this environment variable into the [PM2 configuration file](config/pm2_servers/dev.json).

```sh
# stop servers (node and webpack)
make stop-dev
```

**Note:** for stability purposes dependencies versions are *exact* and production dependencies are locked down using `npm shrinkwrap --dev`. To keep fixed version update npm configuration with `npm set save-exact 1` command or append your `npm install` command with `--save-exact`.

**Tip:** because versions are *exact* you can run your `npm install` faster by running `npm set cache-min Infinity` (even without internet connection if packages are already cached).

## Test

```sh
# tests run in the "test" environment and don't empty the "development" database
make test

# alternatively, you can run any of the individual test suites:
make test-api-unit
make test-api-functional
make test-frontend-unit
make test-frontend-functional
make test-isomorphic-unit
```

API (and common lib) unit tests using:

* [Mocha](http://mochajs.org/)
* expect from [Chai](http://chaijs.com/guide/styles/)

API functional tests using:

* [Mocha](http://mochajs.org/)
* expect from [Chai](http://chaijs.com/guide/styles/)
* [request](https://github.com/request/request)

Frontend unit tests using:

* [Mocha](http://mochajs.org/)
* [expect](https://github.com/mjackson/expect)
* [Redux Thunk](https://github.com/gaearon/redux-thunk), [redux-mock-store](https://github.com/arnaudbenard/redux-mock-store) and [nock](https://github.com/pgte/nock)
to test redux action creators (as explain in [redux documentation](http://rackt.org/redux/docs/recipes/WritingTests.html))
* [enzyme](https://github.com/airbnb/enzyme) to test react components

Frontend fonctional tests using:

* [Nightwatch.js](http://nightwatchjs.org/)


## Deployment

See [deployment instructions](doc/DEPLOY.md).


## Managing servers with PM2

dev and tests servers are managed with PM2. So, It's possible to :

```sh
# display the 'front dev' server's logs
make log-frontend-dev
# display the 'api dev' server's logs
make log-api-dev

# display the list of all servers
make servers-list
# display the monitoring for all servers
make servers-monitoring
# stop all servers
make servers-stop-all
# stop all servers, delete them, and clear their logs.
make servers-clear-all
```
