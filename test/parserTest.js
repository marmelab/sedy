var assert = require('assert');
var parser = require('../lib/parser');

describe('parser', function() {
    var config;
    var request;

    beforeEach(function() {
        config = {
            allowed: {
                repositories: ['Marmelab/SedBot'],
                authors: ['Someone'],
            },
        };

        request = {
            headers: {'x-github-event': 'pull_request_review_comment'},
            body: {
                comment: {id: 42, body: 'This is a comment'},
                sender: {login: 'Someone'},
                repository: {name: 'SedBot', owner: {login: 'Marmelab'}},
                pull_request: {number: 42, head: {ref: 'master'}},
            },
        };
    });

    it('should throw exception if no argument', function() {
        assert.throws(parser(config).parse, TypeError);
    });

    describe('headers', function() {
        it('should throw exception if no headers', function() {
            assert.throws(function() {
                parser(config).parse({headers: null});
            }, TypeError);
        });

        it('should return null for bad headers or `ping` event', function() {
            function test(value) {
                assert.deepEqual(parser(config).parse(value), null);
            }

            test({headers: []});
            test({headers: 'bad header'});
            test({headers: {'bad': 'header'}});
            test({headers: {'x-github-event': 'bad header'}});
            test({headers: {'x-github-event': 'ping'}});
        });
    });

    describe('security', function() {
        it('should not match if user is not authorized', function() {
            request.body.sender.login = 'Somebody else';
            assert.deepEqual(parser(config).parse(request), null);
        });

        it('should not match if repository name is not authorized', function() {
            request.body.repository.name = 'Other Repo';
            assert.deepEqual(parser(config).parse(request), null);
        });

        it('should not match if repository owner is not authorized', function() {
            request.body.repository.owner.login = 'Somebody else';
            assert.deepEqual(parser(config).parse(request), null);
        });
    });

    describe('pull request', function() {
        it('should not match if not pattern in comment', function() {
            assert.deepEqual(parser(config).parse(request).matches, []);
        });

        it('should match if one pattern in comment', function() {
            request.body.comment.body = 's/That/This/';
            assert.deepEqual(parser(config).parse(request).matches, [
                {from: 'That', to: 'This'},
            ]);
        });

        it('should match if more than one patterns in comment', function() {
            request.body.comment.body = 's/That/This/ \ns/To Remove//';
            assert.deepEqual(parser(config).parse(request).matches, [
                {from: 'That', to: 'This'},
                {from: 'To Remove', to: ''},
            ]);
        });

        it('should match if sed `from` value is not ascii', function() {
            request.body.comment.body = 's/Thαt/This/';
            assert.deepEqual(parser(config).parse(request).matches, []);
        });

        it('should match if sed `to` value is not ascii', function() {
            request.body.comment.body = 's/That/Thιs/';
            assert.deepEqual(parser(config).parse(request).matches, []);
        });
    });
});
