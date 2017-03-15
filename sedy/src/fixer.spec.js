import sinon from 'sinon';
import { assert } from 'chai';

import fixerFactory from './fixer';
import {
    diffHunkWithAccents,
    diffHunk,
    diffBlob,
    diffHunkWithQuestionMark,
} from './test/fixtures';

describe('Fixer', () => {
    let commiter;
    const logger = {
        debug: () => {},
        info: () => {},
    };

    beforeEach(() => {
        commiter = {
            prepareFix: sinon.spy(() => callback => callback(null, '32a104bb009ecd4cf790de24bf5562ec7cab37e7')),
        };
    });

    describe('getLineIndexFromDiff', () => {
        it('should return the correct line', () => {
            const fixer = fixerFactory(null, commiter, logger);
            const index = fixer.getLineIndexFromDiff(diffHunk, 5);

            assert.equal(index, 2);

            assert.equal(diffBlob.split('\n')[index], diffHunk.split('\n')[5].slice(1));
        });
        it('should return the correct line even if several line are identical', () => {
            const fixer = fixerFactory();
            let index = fixer.getLineIndexFromDiff(diffHunk, 7);
            assert.equal(index, 4);
            assert.equal(diffBlob.split('\n')[index], diffHunk.split('\n')[7].slice(1));

            index = fixer.getLineIndexFromDiff(diffHunk, 6);
            assert.equal(index, 3);
            assert.equal(diffBlob.split('\n')[index], diffHunk.split('\n')[6].slice(1));
        });
        it('should return null if position point on a deleted line', () => {
            const fixer = fixerFactory();
            const index = fixer.getLineIndexFromDiff(diffHunk, 3);

            assert.isNull(index);
        });
    });

    describe('fix', () => {
        it('should handle accented characters', () => {
            const fixer = fixerFactory(null, commiter, logger);
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

        it('should handle question mark', () => {
            const fixer = fixerFactory(null, commiter, logger);
            const parsedContent = {
                comment: { diffHunk: diffHunkWithQuestionMark, position: 1 },
            };

            const blob = {
                content: '### Is this real life ?',
                encoding: 'utf8',
            };

            const match = {
                from: ' ?',
                to: '?',
            };

            const { content } = fixer.fixBlob(parsedContent, blob, match);

            assert.deepEqual(content, '### Is this real life?');
        });

        it('should handle several development characters', () => {
            const specificChars = ['^', '.', '{', '}', '\\'];

            for (const char of specificChars) {
                const fixer = fixerFactory(null, commiter, logger);
                const parsedContent = {
                    comment: { diffHunk: diffHunkWithQuestionMark, position: 1 },
                };

                const blob = {
                    content: `### Is this ${char} real life?`,
                    encoding: 'utf8',
                };

                const match = {
                    from: ` ${char}`,
                    to: '',
                };

                const { content } = fixer.fixBlob(parsedContent, blob, match);

                assert.deepEqual(
                    content,
                    '### Is this real life?',
                    `The fix of the character "${char}" doesn't match`,
                );
            }
        });
    });
});
