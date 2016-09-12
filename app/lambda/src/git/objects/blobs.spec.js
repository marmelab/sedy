import { assert } from 'chai';
import sinon from 'sinon';

import factory from './blobs';
import storeFactory from '../store';

describe('Git Blobs', () => {
    let blobs;
    let store;
    const repo = {
        id: 'marmelab/sedy',
        owner: 'marmelab',
        name: 'sedy',
    };

    beforeEach(() => {
        store = storeFactory();
        blobs = factory(null, repo, store);
    });

    describe('validate', () => {
        it('should throw an error if object is not a blob', () => {
            const invalidBlob = {
                sha: 'd670460b4b4aece5915caf5c68d12f560a9fe3e4',
            };

            assert.throws(() => blobs.validate(invalidBlob), /has no 'blob'/);

            invalidBlob.type = 'invalid type';
            assert.throws(() => blobs.validate(invalidBlob), /has no 'blob'/);
        });

        it('should return true if object is a valid blob', () => {
            const validBlob = {
                sha: 'd670460b4b4aece5915caf5c68d12f560a9fe3e4',
                type: 'blob',
            };

            assert.equal(blobs.validate(validBlob), true);
        });
    });

    describe('get', () => {
        let client;

        beforeEach(() => {
            client = {
                getBlobFromId: sinon.spy(({ id }) => cb => cb(null, { sha: id })),
            };
        });

        it('should retrieve blob from the store', function* () {
            const storedBlob = {
                sha: 'd670460b4b4aece5915caf5c68d12f560a9fe3e4',
                type: 'blob',
            };

            store.update(storedBlob);
            const blob = yield blobs.get(storedBlob.sha);

            assert.deepEqual(blob, storedBlob);
        });

        it('should retrieve blob from client if store blob is missing', function* () {
            blobs = factory(client, repo, store);

            const blob = yield blobs.get('d670460b4b4aece5915caf5c68d12f560a9fe3e4');

            assert(client.getBlobFromId.called);
            assert.deepEqual(blob, {
                sha: 'd670460b4b4aece5915caf5c68d12f560a9fe3e4',
                type: 'blob',
            });
        });
    });
});
