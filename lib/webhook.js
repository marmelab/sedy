module.exports = function(parser, fixer, commiter, githubapi) {
    return function *webhook(next) {
        var request = this.request;

        var parsedContent = parser(request);
        var fixedContent = yield fixer(parsedContent, githubapi);

        this.body = {'response': 'OK'};
        yield next;

        if (fixedContent) {
            commiter(fixedContent, githubapi);
        }
    };
};
