import { assert } from 'chai';
import parserFactory from './parser';

describe('Parser', () => {
    const config = {};
    let request;

    beforeEach(() => {
        request = {
            headers: { 'X-GitHub-Event': 'pull_request_review_comment' },
            body: {
                action: 'created',
                comment: {
                    id: 'comment id',
                    body: 'comment body',
                    path: 'comment path',
                    created_at: 'comment date',
                    html_url: 'comment url',
                },
                sender: { login: 'Someone' },
                repository: { name: 'Sedy', owner: { login: 'Marmelab'} },
                pull_request: { number: 42, head: { ref: 'master' } },
                diff_hunk: 'diff hunk', // @TODO Use fixture
                position: 'diff position',
            },
        };
    });

    it('should throw exception if no argument', () => {
        assert.throws(parserFactory(config).parse, TypeError);
    });

    describe('headers', () => {
        it('should return null for bad headers or `ping` event', () => {
            const shouldReturnNull = value => {
                assert.deepEqual(parserFactory(config).parse(value), null);
            };

            shouldReturnNull({ headers: null });
            shouldReturnNull({ headers: [] });
            shouldReturnNull({ headers: 'bad header' });
            shouldReturnNull({ headers: { 'bad': 'header' } });
            shouldReturnNull({ headers: { 'X-GitHub-Event': 'bad event' } });
            shouldReturnNull({ headers: { 'X-GitHub-Event': 'ping' } });
        });
    });

    describe('pull request', () => {
        it('should find correct comment', () => {
            const parser = parserFactory(config);

            assert.deepEqual(parser.parsePullRequestReviewComment(request).comment, {
                action: 'created',
                id: 'comment id',
                body: 'comment body',
                sender: 'Someone',
                path: 'comment path',
                diffHunk: 'diff hunk',
                position: 'diff position',
                createdDate: 'comment date',
                url: 'comment url',
            });
        });
    });

    describe('sed parsing', () => {
        it('should not match if not pattern in comment', () => {
            assert.deepEqual(parserFactory(config).parse(request).matches, []);
        });

        it('should match if one pattern in comment', () => {
            request.body.comment.body = 's/That/This/';
            assert.deepEqual(parserFactory(config).parse(request).matches, [
                { from: 'That', to: 'This' },
            ]);
        });

        it('should match if more than one patterns in comment', () => {
            request.body.comment.body = 's/That/This/ \ns/To Remove//';
            assert.deepEqual(parserFactory(config).parse(request).matches, [
                { from: 'That', to: 'This' },
                { from: 'To Remove', to: '' },
            ]);
        });

        it('should match if sed `from` value is not ascii', () => {
            request.body.comment.body = 's/Thαt/This/';
            assert.deepEqual(parserFactory(config).parse(request).matches, []);
        });

        it('should match if sed `to` value is not ascii', () => {
            request.body.comment.body = 's/That/Thιs/';
            assert.deepEqual(parserFactory(config).parse(request).matches, []);
        });

        it("should not match if it isn't a created comment", () => {
            request.body.action = 'deleted';
            assert.deepEqual(parserFactory(config).parse(request), null);

            request.body.action = 'edited';
            assert.deepEqual(parserFactory(config).parse(request), null);
        });
    });
});
