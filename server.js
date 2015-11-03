var koa = require('koa');
var bodyParser = require('koa-body-parser');
var config = require('config');
var webhook = require('./lib/webhook');
var parser = require('./lib/parser');
var fixer = require('./lib/fixer');
var commiter = require('./lib/commiter');

var app = koa();

// Request parser
app.use(bodyParser());

app.use(webhook(parser, fixer, commiter));

app.listen(config.port);
