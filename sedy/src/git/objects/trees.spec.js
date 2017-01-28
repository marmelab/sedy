import { assert } from 'chai';
import sinon from 'sinon';

import factory from './trees';
import storeFactory from '../store';

describe('Git Trees', () => {
    let trees;
    let store;
    const repo = {
        id: 'marmelab/sedy',
        owner: 'marmelab',
        name: 'sedy',
    };

    beforeEach(() => {
        store = storeFactory();
        trees = factory(null, repo, store);
    });

    describe('validate', () => {
        it('should throw an error if object is not a tree', () => {
            const invalidTree = {
                sha: 'd670460b4b4aece5915caf5c68d12f560a9fe3e4',
            };

            assert.throws(() => trees.validate(invalidTree), /has no 'tree'/);

            invalidTree.type = 'invalid type';
            assert.throws(() => trees.validate(invalidTree), /has no 'tree'/);
        });

        it('should return true if object is a valid tree', () => {
            const validTree = {
                sha: 'd670460b4b4aece5915caf5c68d12f560a9fe3e4',
                type: 'tree',
            };

            assert.equal(trees.validate(validTree), true);
        });
    });

    describe('get', () => {
        let client;

        beforeEach(() => {
            client = {
                getTreeFromId: sinon.spy(({ id }) => cb => cb(null, { sha: id })),
            };
        });

        it('should retrieve tree from the store', function* () {
            const storedTree = {
                sha: 'd670460b4b4aece5915caf5c68d12f560a9fe3e4',
                type: 'tree',
                mode: '040000',
            };

            store.update(storedTree);
            const tree = yield trees.get(storedTree.sha);

            assert.deepEqual(tree, storedTree);
        });

        it('should retrieve tree from client if store tree is missing', function* () {
            trees = factory(client, repo, store);

            const tree = yield trees.get('d670460b4b4aece5915caf5c68d12f560a9fe3e4');

            assert(client.getTreeFromId.called);
            assert.deepEqual(tree, {
                sha: 'd670460b4b4aece5915caf5c68d12f560a9fe3e4',
                type: 'tree',
                mode: '040000',
            });
        });
    });

    describe('createTreeFromBase', () => {
        let client;

        beforeEach(() => {
            client = {
                createTreeFromBase: sinon.spy(content => cb => cb(null, {
                    sha: 'd670460b4b4aece5915caf5c68d12f560a9fe3e5',
                    type: 'tree',
                    mode: '040000',
                    content,
                })),
            };
        });

        it('should create a tree from its predecesor', function* () {
            const base = {
                sha: 'd670460b4b4aece5915caf5c68d12f560a9fe3e4',
                type: 'tree',
                mode: '040000',
            };

            store.update(base);
            trees = factory(client, repo, store);

            const tree = yield trees.createTreeFromBase(base, { tree: ['some tree infos'] });

            assert.deepEqual(tree, {
                mode: '040000',
                type: 'tree',
                sha: 'd670460b4b4aece5915caf5c68d12f560a9fe3e5',
                content: {
                    repoUser: 'marmelab',
                    repoName: 'sedy',
                    baseTree: 'd670460b4b4aece5915caf5c68d12f560a9fe3e4',
                    tree: ['some tree infos'],
                },
            });
        });
    });
});
