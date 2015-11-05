module.exports = function(parse, fixTypo, commit, githubApi) {
    return function *webhook(next) {
        var request = this.request;

        var parsedContent = parse(request);
        var fixedContent = yield fixTypo(parsedContent, githubApi);

        this.body = {'response': 'OK'};
        yield next;

        if (fixedContent) {
            commit(fixedContent, githubApi);
        }
    };
};
