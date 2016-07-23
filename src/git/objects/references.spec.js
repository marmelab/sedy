import { assert } from 'chai';

import factory from './references';

describe('Git References', () => {
    let references;
    const repo = {
        id: 'marmelab/sedy',
        owner: 'marmelab',
        name: 'sedy',
        defaultReference: 'master',
    };

    beforeEach(() => {
        references = factory(null, repo);
    });

    describe('validate', () => {
        it('should throw an error if reference is not a string or empty string', () => {
            assert.throws(() => references.validate(null), /is invalid/);
            assert.throws(() => references.validate(undefined), /is invalid/);
            assert.throws(() => references.validate(123), /is invalid/);
            assert.throws(() => references.validate({}), /is invalid/);
            assert.throws(() => references.validate(''), /is invalid/);
        });

        it('should throw an error if ref does not start with refs/', () => {
            assert.throws(() => references.validate('something invalid'), /should starts with 'refs'/);
            assert.throws(() => references.validate('heads/refs/master'), /should starts with 'refs'/);
        });

        it('should throw an error if ref does not have a good location', () => {
            assert.throws(
                () => references.validate('refs/invalid/master'),
                /should starts with: refs\/heads, refs\/remotes, refs\/tags/
            );
        });

        it('should throw an error if ref is incomplete', () => {
            assert.throws(() => references.validate('refs/heads'), /is incomplete/);
            assert.throws(() => references.validate('refs/heads/'), /is incomplete/);
        });

        it('should return true if reference is valid', () => {
            assert.equal(references.validate('refs/heads/master'), true);
        });
    });

    describe('get', () => {
        it('should retrieve reference from its store', function* () {
            const reference = yield references.get('master');

            assert.deepEqual(reference, null);
        });
    });
});
