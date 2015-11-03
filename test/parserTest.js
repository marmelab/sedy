var assert = require('assert');
var parser = require('../lib/parser');

describe('Parser', function() {
    it('should throw exception if no argument', function() {
        assert.throws(parser, TypeError);
    });

    describe('headers', function() {
        it('should throw exception if no headers', function() {
            assert.throws(function() {
                parser({headers: null});
            }, TypeError);
        });

        it('should return null for bad headers or `ping` event', function() {
            function test(value) {
                assert.deepEqual(parser(value), null);
            }

            test({headers: []});
            test({headers: 'bad header'});
            test({headers: {'bad': 'header'}});
            test({headers: {'x-github-event': 'bad header'}});
            test({headers: {'x-github-event': 'ping'}});
        });
    });

    describe('Pull Request', function() {
        var request;

        before(function() {
            request = {
                headers: {'x-github-event': 'pull_request_review_comment'},
                body: {
                    comment: {id: 42, body: 'This is a comment'},
                },
            };
        });

        it('should not match if not pattern in comment', function() {
            assert.deepEqual(parser(request), {
                type: 'pull_request_review_comment',
                matches: [],
            });
        });

        it('should match if one pattern in comment', function() {
            request.body.comment.body = 's/That/This/';
            assert.deepEqual(parser(request), {
                type: 'pull_request_review_comment',
                matches: [{from: 'That', to: 'This'}],
            });
        });

        it('should match if more than one patterns in comment', function() {
            request.body.comment.body = 's/That/This/ \ns/To Remove//';
            assert.deepEqual(parser(request), {
                type: 'pull_request_review_comment',
                matches: [
                    {from: 'That', to: 'This'},
                    {from: 'To Remove', to: ''},
                ],
            });
        });
    });
});
