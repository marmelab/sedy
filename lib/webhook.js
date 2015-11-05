module.exports = function(parser, fixer, commiter, githubApi) {
    return function *webhook(next) {
        var request = this.request;

        var parsedContent = parser.parse(request);
        var fixedContent = yield fixer.fixTypo(parsedContent, githubApi);

        this.body = {'response': 'OK'};
        yield next;

        if (fixedContent) {
            yield commiter.commit(fixedContent, githubApi);
        }
    };
};
