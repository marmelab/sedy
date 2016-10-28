import { assert } from 'chai';
import fixerFactory from './fixer';
import { diffHunkWithAccents, simpleDiffHunk, simpleFile } from './test/fixtures';

describe('Fixer', () => {
    const logger = console;
    logger.debug = console.log;

    describe('getLineIndexFromDiff', () => {
        it('should return the correct line', () => {
            const fixer = fixerFactory(null, logger);
            const index = fixer.getLineIndexFromDiff(simpleDiffHunk, 5);

            assert.equal(index, 2);

            assert.equal(simpleFile.split('\n')[index], simpleDiffHunk.split('\n')[5].slice(1));
        });
        it('should return the correct line even if several line are identical', () => {
            const fixer = fixerFactory();
            let index = fixer.getLineIndexFromDiff(simpleDiffHunk, 7);
            assert.equal(index, 4);
            assert.equal(simpleFile.split('\n')[index], simpleDiffHunk.split('\n')[7].slice(1));

            index = fixer.getLineIndexFromDiff(simpleDiffHunk, 6);
            assert.equal(index, 3);
            assert.equal(simpleFile.split('\n')[index], simpleDiffHunk.split('\n')[6].slice(1));
        });
        it('should return null if position point on a deleted line', () => {
            const fixer = fixerFactory();
            const index = fixer.getLineIndexFromDiff(simpleDiffHunk, 3);

            assert.isNull(index);
        });
    });
    describe('fix', () => {
        it('should handle accented characters', () => {
            const fixer = fixerFactory(null, logger);
            const parsedContent = {
                comment: { diffHunk: diffHunkWithAccents, position: 1 },
            };

            const blob = {
                content: '### Conventions & consistence',
                encoding: 'utf8',
            };

            const match = {
                from: 'consistence',
                to: 'cohérence',
            };

            const { content } = fixer.fixBlob(parsedContent, blob, match);

            assert.deepEqual(content, '### Conventions & cohérence');
        });
    });
});
