var assert = require('assert');
var sinon = require('sinon');
var fixer = require('../lib/fixer');

describe('fixer', function() {
    var githubApi;
    var content;

    beforeEach(function() {
        githubApi = {
            replyToPullRequestReviewComment: sinon.spy(function() {
                return function(callback) {
                    callback(null, null);
                };
            }),
        };
        content = {
            type: 'pull_request_review_comment',
            comment: {
                id: 42,
                body: 's/From/to/',
                sender: 'Someone',
                path: 'README.md',
                position: 1,
                createdDate: new Date().toISOString(),
                url: 'http://perdu.com/',
            },
            commit: {
                id: 24,
            },
            repository: {
                user: 'Marmelab',
                name: 'SedBot',
            },
            pullRequest: {
                number: 1337,
                ref: 'master',
            },
        };
    });

    describe('reply', function() {
        it('should call github api with good args', function* () {
            yield fixer().reply(githubApi, content, 'Some cool message');
            assert.deepEqual(
                githubApi.replyToPullRequestReviewComment.getCall(0).args,
                [{
                    repoUser: 'Marmelab',
                    repoName: 'SedBot',
                    pullRequestNumber: 1337,
                    commentId: 42,
                    message: 'Some cool message',
                }]
            );
        });

        it('should not call github api if bad type', function* () {
            content.type = 'bad type';
            yield fixer().reply(githubApi, content, 'Some cool message');
            assert.deepEqual(
                githubApi.replyToPullRequestReviewComment.callCount,
                0
            );
        });
    });
});
