var koa = require('koa');
var bodyParser = require('koa-body-parser');
var config = require('config');
var webhook = require('./lib/webhook');
var parser = require('./lib/parser');
var fixer = require('./lib/fixer');
var commiter = require('./lib/commiter');
var GithubClass = require('github');
var githubapi = require('./lib/githubapi');

var app = koa();

// GitHub API auth
var github = new GithubClass({
    version: '3.0.0',
    debug: config.debug,
    headers: {'user-agent': 'SedBot-Is-A-Bot'},
});
github.authenticate({type: 'oauth', token: config.bot.oauthToken});

// Request parser
app.use(bodyParser());

app.use(webhook(parser, fixer, commiter, githubapi(github)));

app.listen(config.port);
