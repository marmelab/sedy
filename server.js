var koa = require('koa');
var json = require('koa-json');
var bodyParser = require('koa-body-parser');
var config = require('config');
var webhook = require('./lib/webhook');
var parser = require('./lib/parser');
var fixer = require('./lib/fixer');
var commiter = require('./lib/commiter');

var app = koa();

// Request parser
app.use(bodyParser());

// Json Response renderer
app.use(json({pretty: config.pretty, param: 'pretty'}));

// Sedbot webhook
app.use(webhook(parser, fixer, commiter));

app.listen(config.port);
