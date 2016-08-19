import { assert } from 'chai';
import sinon from 'sinon';

import factory from './commits';
import storeFactory from '../store';

describe('Git Commits', () => {
    let commits;
    let store;
    const repo = {
        id: 'marmelab/sedy',
        owner: 'marmelab',
        name: 'sedy',
    };

    beforeEach(() => {
        store = storeFactory();
        commits = factory(null, repo, store);
    });

    describe('validate', () => {
        it('should throw an error if object is not a commit', () => {
            const invalidCommit = {
                sha: 'd670460b4b4aece5915caf5c68d12f560a9fe3e4',
            };

            assert.throws(() => commits.validate(invalidCommit), /has no 'commit'/);

            invalidCommit.type = 'invalid type';
            assert.throws(() => commits.validate(invalidCommit), /has no 'commit'/);
        });

        it('should return true if object is a valid commit', () => {
            const validCommit = {
                sha: 'd670460b4b4aece5915caf5c68d12f560a9fe3e4',
                type: 'commit',
            };

            assert.equal(commits.validate(validCommit), true);
        });
    });

    describe('get', () => {
        let client;

        beforeEach(() => {
            client = {
                getCommitFromId: sinon.spy(({ commitId }) => cb => cb(null, { sha: commitId })),
            };
        });

        it('should retrieve commit from the store', function* () {
            const storedCommit = {
                sha: 'd670460b4b4aece5915caf5c68d12f560a9fe3e4',
                type: 'commit',
            };

            store.update(storedCommit);
            const commit = yield commits.get(storedCommit.sha);

            assert.deepEqual(commit, storedCommit);
        });

        it('should retrieve commit from client if store commit is missing', function* () {
            commits = factory(client, repo, store);

            const commit = yield commits.get('d670460b4b4aece5915caf5c68d12f560a9fe3e4');

            assert(client.getCommitFromId.called);
            assert.deepEqual(commit, {
                sha: 'd670460b4b4aece5915caf5c68d12f560a9fe3e4',
                type: 'commit',
            });
        });
    });
});
