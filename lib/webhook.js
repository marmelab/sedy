var config = require('config');

module.exports = function(parser, fixer, commiter) {
    return function *webhook(next) {
        var request = this.request;

        // console.log(request.method + ' ' + request.href);
        // console.log(request.headers);
        // console.log(request.body);

        var parsedContent = parser(request);
        var fixedContent = fixer(parsedContent);

        this.body = config.defaultResponse;
        yield next;

        if (fixedContent) {
            commiter(fixedContent);
        }
    };
};
