import { assert } from 'chai';
import parseFactory from './';

describe.only('Parser', () => {
    const config = {};
    const logger = console;
    logger.debug = console.log;

    const request = {
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

    const getRequestWithComment = comment => ({
        ...request,
        body: {
            ...request.body,
            comment: {
                ...request.body.comment,
                body: comment,
            },
        },
    });

    const getRequestWithAction = action => ({
        ...request,
        body: {
            ...request.body,
            action,
        },
    });

    it('should throw exception if no argument', () => {
        assert.throws(parseFactory(config, logger), TypeError);
    });

    it('should return an empty array for bad headers or `ping` event', () => {
        const shouldReturnNull = value => {
            assert.deepEqual(parseFactory(config, logger)(value), []);
        };

        shouldReturnNull({ headers: null });
        shouldReturnNull({ headers: [] });
        shouldReturnNull({ headers: 'bad header' });
        shouldReturnNull({ headers: { 'bad': 'header' } });
        shouldReturnNull({ headers: { 'X-GitHub-Event': 'bad event' } });
        shouldReturnNull({ headers: { 'X-GitHub-Event': 'ping' } });
    });

    describe('sed parsing', () => {
        it('should not match if not pattern in comment', () => {
            const [result] = parseFactory(config, logger)(request);
            assert.deepEqual(result.matches, []);
        });

        it('should match if one pattern in comment', () => {
            const [result] = parseFactory(config, logger)(getRequestWithComment('s/That/This/'));

            assert.deepEqual(result.matches, [
                { from: 'That', to: 'This' },
            ]);
        });

        it('should match the deletion pattern', () => {
            const [result] = parseFactory(config, logger)(getRequestWithComment('s/To Remove//'));

            assert.deepEqual(result.matches, [
                { from: 'To Remove', to: '' },
            ]);
        });

        it('should match if more than one patterns in comment', () => {
            const [result] = parseFactory(config, logger)(getRequestWithComment('s/That/This/ \ns/To Remove//'));

            assert.deepEqual(result.matches, [
                { from: 'That', to: 'This' },
                { from: 'To Remove', to: '' },
            ]);
        });

        it('should match if sed `from` value is not ascii', () => {
            const [result] = parseFactory(config, logger)(getRequestWithComment('s/Thαt/This/'));

            assert.deepEqual(result.matches, []);
        });

        it('should match if sed `to` value is not ascii', () => {
            const [result] = parseFactory(config, logger)(getRequestWithComment('s/That/Thιs/'));
            assert.deepEqual(result.matches, []);
        });

        it("should not match if it isn't a created comment", () => {
            assert.deepEqual(parseFactory(config, logger)(getRequestWithAction('deleted')), []);

            assert.deepEqual(parseFactory(config, logger)(getRequestWithAction('edited')), []);
        });

        it('should not match if the pattern is an image url', () => {
            const [result] = parseFactory(config, logger)(getRequestWithComment('https://perdu.com/os/images/lost/image.jpg'));
            assert.deepEqual(result.matches, []);
        });

        it('should match sed together with image url', () => {
            const [result] = parseFactory(config, logger)(getRequestWithComment(' s/remove// https://perdu.com/os/images/lost/image.jpg s/replace/me/'));

            assert.deepEqual(result.matches, [
                { from: 'remove', to: '' },
                { from: 'replace', to: 'me' },
            ]);
        });
    });
});
