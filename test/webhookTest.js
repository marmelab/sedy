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

    describe('parser', function() {
        it('should be called every time', function *() {
            yield webhook(parser, fixer, commiter)(next);
            assert(parser.called);
        });
    });

    describe('fixer', function() {
        it('should be called every time', function *() {
            yield webhook(parser, fixer, commiter)(next);
            assert(fixer.called);
        });
    });

    describe('commiter', function() {
        it('should be called if fixer\'s content is not null', function *() {
            fixer = sinon.stub().returns(42);
            yield webhook(parser, fixer, commiter)(next);
            assert(commiter.called);
        });

        it('should not be called if fixer\'s content is null', function *() {
            fixer = sinon.stub().returns(null);
            yield webhook(parser, fixer, commiter)(next);
            assert.equal(commiter.callCount, 0);
        });
    });
});
