import { assert } from 'chai';
import fixerFactory from './fixer';
import { diffHunk } from './test/fixtures';

describe('Fixer', () => {
    describe('Diff interpreter', () => {
        it('should return the correct line', () => {
            const fixer = fixerFactory();
            const diff = fixer.interpretDiff(diffHunk, 85);

            assert.deepEqual(diff.line, "Note that if we don't use any module bundler, we need to replace the 'require' call");
        });
    });
});
