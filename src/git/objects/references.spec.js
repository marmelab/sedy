import { assert } from 'chai';

import factory from './references';
import sinon from 'sinon';

describe('Git References', () => {
    let client;
    let references;
    const repo = {
        id: 'marmelab/sedy',
        owner: 'marmelab',
        name: 'sedy',
        defaultReference: 'master',
    };

    beforeEach(() => {
        client = {
            getReferenceFromId: sinon.spy(content => cb => cb(null, {
                ref: 'ref',
                object: 'object',
                content,
            })),
        };
        references = factory(client, repo);
    });

    describe('validate', () => {
        it('should throw an error if reference is not a string or empty string', () => {
            assert.throws(() => references.validate(undefined), /is invalid/);
            assert.throws(() => references.validate(123), /is invalid/);
            assert.throws(() => references.validate({}), /is invalid/);
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
            assert.deepEqual(yield references.get('head'), null);
            // assert.deepEqual(yield references.get('refs/heads/master'), null);
        });
    });

    describe('update', () => {
        it('should update reference from given objet', function* () {
            yield references.update('refs/heads/branch', {
                sha: 'd670460b4b4aece5915caf5c68d12f560a9fe3e4',
            });

            assert.deepEqual(yield references.get('refs/heads/branch'), 'd670460b4b4aece5915caf5c68d12f560a9fe3e4');
        });

        it('should throw an error if object sha is not valid', function* () {
            let error = null;

            try {
                yield references.update('refs/heads/branch', { sha: 'bad sha' });
            } catch (err) {
                error = err;
            } finally {
                if (!error) assert(false, 'Update reference should throw an error');
            }
        });
    });
});
