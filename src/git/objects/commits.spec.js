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

    describe('create', () => {
        let currentDate;
        let clock;
        let client;

        beforeEach(() => {
            currentDate = new Date();
            clock = sinon.useFakeTimers(currentDate.getTime(), 'Date');
            client = {
                createCommit: sinon.spy(() => cb => cb(null, { sha: 'd670460b4b4aece5915caf5c68d12f560a9fe3e4' })),
            };
        });

        it('should create a commit with the client', function* () {
            const commits = factory(client, repo, store);
            yield commits.create({ sha: 'tree sha' }, 'message', { author: 'name' }, 'parents');

            assert.deepEqual(client.createCommit.getCall(0).args[0], {
                repoUser: 'marmelab',
                repoName: 'sedy',
                commitMessage: 'message',
                commitAuthor: {
                    author: 'name',
                    date: currentDate.toISOString(),
                },
                commitTree: 'tree sha',
                commitParents: 'parents',
            });
        });

        it('should store the new commit in the store', function* () {
            const commits = factory(client, repo, store);
            const commit = yield commits.create({ sha: 'tree sha' }, 'message', { author: 'name' }, 'parents');
            const storedCommit = store.get(commit.sha);

            assert.deepEqual(commit, storedCommit);
        });

        it('should standardize the new commit', function* () {
            const commits = factory(client, repo, store);
            const commit = yield commits.create({ sha: 'tree sha' }, 'message', { author: 'name' }, 'parents');

            assert.deepEqual(commit, {
                sha: 'd670460b4b4aece5915caf5c68d12f560a9fe3e4',
                type: 'commit',
            });
        });

        afterEach(() => {
            if (clock) clock.restore();
        });
    });
});
