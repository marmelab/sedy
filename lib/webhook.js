module.exports = function(parser, fixer, commiter) {
    return function *webhook(next) {
        var request = this.request;

        var parsedContent = parser(request);
        var fixedContent = fixer(parsedContent);

        this.body = {'response': 'OK'};
        yield next;

        if (fixedContent) {
            commiter(fixedContent);
        }
    };
};
