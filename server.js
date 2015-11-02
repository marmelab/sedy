var koa = require('koa');
var bodyParser = require('koa-body-parser');

var app = koa();
app.use(bodyParser());

app.use(function* () {
	var request = this.request;

	console.log(request.method + ' ' + request.href);
	console.log(request.headers);
	console.log(request.body);

	this.body = 'Hello world !';
});

app.listen(3000);
