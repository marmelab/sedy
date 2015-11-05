var co = require('co');
var assert = require('assert');
var sinon = require('sinon');
var webhook = require('../lib/webhook');

describe('WebHook', function() {
    var parser;
    var fixer;
    var commiter;
    var githubApi;
    var next;

    beforeEach(function() {
        parser = sinon.spy();
        fixer = sinon.spy(function() {
            return function(callback) {
                callback(null, 'commit instructions');
            };
        });
        commiter = sinon.spy(function() {
            return function(callback) {
                callback(null, null);
            };
        });
        githubApi = sinon.spy();
        next = {};
    });

    it('should render correct response', function *() {
        var ctx = {};
        yield co.wrap(webhook(parser, fixer, commiter, githubApi)).call(ctx, next);
        assert.deepEqual(ctx.body, {'response': 'OK'});
    });

    describe('parser', function() {
        it('should be called with good args', function *() {
            var ctx = {
                request: {
                    headers: {'x-github-event': 'ping'},
                    body: {},
                },
            };
            yield co.wrap(webhook(parser, fixer, commiter, githubApi)).call(ctx, next);
            assert.deepEqual(parser.getCall(0).args, [
                {
                    headers: {'x-github-event': 'ping'},
                    body: {},
                },
            ]);
        });
    });

    describe('fixer', function() {
        it('should be called with good args', function *() {
            parser = sinon.stub().returns({
                type: 'pull_request_review_comment',
                matches: [
                    {from: 'bad', to: 'good'},
                ],
            });
            yield webhook(parser, fixer, commiter)(next);
            assert.deepEqual(fixer.getCall(0).args[0].matches, [
                {from: 'bad', to: 'good'},
            ]);
        });
    });

    describe('commiter', function() {
        it('should be called if fixer\'s content is not null', function *() {
            yield webhook(parser, fixer, commiter, githubApi)(next);
            assert.deepEqual(commiter.getCall(0).args[0], 'commit instructions');
        });

        it('should not be called if fixer\'s content is null', function *() {
            fixer = sinon.spy(function() {
                return function(callback) {
                    callback();
                };
            });
            yield webhook(parser, fixer, commiter, githubApi)(next);
            assert.equal(commiter.callCount, 0);
        });
    });
});
