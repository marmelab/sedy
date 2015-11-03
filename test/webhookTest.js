var co = require('co');
var assert = require('assert');
var sinon = require('sinon');
var webhook = require('../lib/webhook');

describe('WebHook', function() {
    var parser;
    var fixer;
    var commiter;
    var next;

    beforeEach(function() {
        parser = sinon.spy();
        fixer = sinon.spy();
        commiter = sinon.spy();
        next = {};
    });

    it('should render correct response', function *() {
        var ctx = {};
        yield co.wrap(webhook(parser, fixer, commiter)).call(ctx, next);
        assert.deepEqual(ctx.body, {'response': 'OK'});
    });

    describe('parser', function() {
        it('should be called every time with good args', function *() {
            var ctx = {
                request: {
                    headers: {'x-github-event': 'ping'},
                    body: {},
                },
            };
            yield co.wrap(webhook(parser, fixer, commiter)).call(ctx, next);
            assert.deepEqual(parser.getCall(0).args, [
                {
                    headers: {'x-github-event': 'ping'},
                    body: {},
                },
            ]);
        });
    });

    describe('fixer', function() {
        it('should be called every time with good args', function *() {
            parser = sinon.stub().returns({
                type: 'pull_request_review_comment',
                matches: [
                    {from: 'bad', to: 'good'},
                ],
            });
            yield webhook(parser, fixer, commiter)(next);
            assert.deepEqual(fixer.getCall(0).args, [
                {
                    type: 'pull_request_review_comment',
                    matches: [
                        {from: 'bad', to: 'good'},
                    ],
                },
            ]);
        });
    });

    describe('commiter', function() {
        it('should be called if fixer\'s content is not null', function *() {
            fixer = sinon.stub().returns('commit instructions');
            yield webhook(parser, fixer, commiter)(next);
            assert.deepEqual(commiter.getCall(0).args, ['commit instructions']);
        });

        it('should not be called if fixer\'s content is null', function *() {
            fixer = sinon.stub().returns(null);
            yield webhook(parser, fixer, commiter)(next);
            assert.equal(commiter.callCount, 0);
        });
    });
});
