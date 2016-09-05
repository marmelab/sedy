var config = require('config');
require('babel-register')({ ignore: config.babel_ignore });
require("babel-polyfill");
