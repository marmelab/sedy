import { assert } from 'chai';
import fixerFactory from './fixer';
import { diffHunk, diffHunkWithAccents } from './test/fixtures';

describe('Fixer', () => {
    describe('interpretDiff', () => {
        it('should return the correct line', () => {
            const fixer = fixerFactory();
            const diff = fixer.interpretDiff(diffHunk, 85);

            assert.deepEqual(diff.line, "Note that if we don't use any module bundler, we need to replace the 'require' call");
        });
    });
    describe('fix', () => {
        it('should handle accented characters', () => {
            const fixer = fixerFactory();
            const parsedContent = {
                comment: { diffHunk: diffHunkWithAccents, position: 5 },
            };

            const blob = {
                content: ' +### Conventions & consistence',
                encoding: 'utf8',
            };

            const match = {
                from: 'consistence',
                to: 'cohérence',
            };

            const { content } = fixer.fixBlob(parsedContent, blob, match);

            assert.deepEqual(content, ' +### Conventions & cohérence');
        });
    });
});
