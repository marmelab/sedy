import { assert } from 'chai';
import parser from './parser';

describe('Parser', () => {
    let config;
    let request;

    beforeEach(() => {
        config = {
            allowed: {
                repositories: ['Marmelab/Sedy'],
                authors: ['Someone'],
            },
        };

        request = {
            headers: { 'X-GitHub-Event': 'pull_request_review_comment' },
            body: {
                comment: { id: 42, body: 'This is a comment' },
                sender: { login: 'Someone' },
                repository: { name: 'Sedy', owner: { login: 'Marmelab'} },
                pull_request: { number: 42, head: { ref: 'master' } },
            },
        };
    });

    it('should throw exception if no argument', () => {
        assert.throws(parser(config).parse, TypeError);
    });

    describe('headers', () => {
        it('should return null for bad headers or `ping` event', () => {
            const shouldReturnNull = value => {
                assert.deepEqual(parser(config).parse(value), null);
            };

            shouldReturnNull({ headers: null });
            shouldReturnNull({ headers: [] });
            shouldReturnNull({ headers: 'bad header' });
            shouldReturnNull({ headers: { 'bad': 'header' } });
            shouldReturnNull({ headers: { 'X-GitHub-Event': 'bad event' } });
            shouldReturnNull({ headers: { 'X-GitHub-Event': 'ping' } });
        });
    });

    describe('authorization', () => {
        it('should not match if user is not authorized', () => {
            request.body.sender.login = 'Somebody else';
            assert.deepEqual(parser(config).parse(request), null);
        });
    });

    describe('pull request', () => {
        it('should not match if not pattern in comment', () => {
            assert.deepEqual(parser(config).parse(request).matches, []);
        });

        it('should match if one pattern in comment', () => {
            request.body.comment.body = 's/That/This/';
            assert.deepEqual(parser(config).parse(request).matches, [
                { from: 'That', to: 'This' },
            ]);
        });

        it('should match if more than one patterns in comment', () => {
            request.body.comment.body = 's/That/This/ \ns/To Remove//';
            assert.deepEqual(parser(config).parse(request).matches, [
                { from: 'That', to: 'This' },
                { from: 'To Remove', to: '' },
            ]);
        });

        it('should match if sed `from` value is not ascii', () => {
            request.body.comment.body = 's/Thαt/This/';
            assert.deepEqual(parser(config).parse(request).matches, []);
        });

        it('should match if sed `to` value is not ascii', () => {
            request.body.comment.body = 's/That/Thιs/';
            assert.deepEqual(parser(config).parse(request).matches, []);
        });
    });
});
