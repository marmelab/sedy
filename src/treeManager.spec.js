import { assert } from 'chai';
import sinon from 'sinon';
import treeManagerFactory from './treeManager';

describe('Tree Manager', () => {
    let githubApi;
    const basicTree = { content: 'tree content', tree: [] };
    const parsedContent = {
        repository: { user: 'marmelab', name: 'sedy' },
    };

    beforeEach(() => {
        githubApi = {
            getTreeFromId: sinon.spy(content => callback => callback(null, basicTree)),
        };
    });

    describe('getFromSha', () => {
        it('should retrieve a tree from its sha and rafine it', function* () {
            const treeManager = treeManagerFactory(githubApi, parsedContent);
            const result = yield treeManager.getFromSha('sha');

            assert.deepEqual(githubApi.getTreeFromId.getCall(0).args[0], {
                repoUser: 'marmelab',
                repoName: 'sedy',
                id: 'sha',
            });

            const expectedTree = { ...basicTree, absolutePath: '/' };
            assert.deepEqual(result, {
                '/': expectedTree,
                root: expectedTree,
            });
        });
    });

    describe('rafine', () => {
        it('should return a object with path as its keys', function* () {
            const tree = { tree: [], other: 'data' };
            const treeManager = treeManagerFactory(githubApi, parsedContent);
            const rafinedTree = yield treeManager.rafine(tree);

            assert.deepEqual(rafinedTree['/'], {
                absolutePath: '/',
                other: 'data',
                tree: [],
            });
        });

        it('should have a shortcut `root` for the path `/`', function* () {
            const tree = { tree: [], other: 'data' };
            const treeManager = treeManagerFactory(githubApi, parsedContent);
            const rafinedTree = yield treeManager.rafine(tree);

            assert.deepEqual(rafinedTree.root, {
                absolutePath: '/',
                other: 'data',
                tree: [],
            });
            assert.deepEqual(rafinedTree['/'], rafinedTree.root);
        });

        it('should rafine blobs', function* () {
            const blob = {
                path: 'file.rb',
                mode: 100644,
                type: 'blob',
                size: 30,
                sha: '44b4fc6d56897b048c772eb4087f854f46256132',
                url: 'https://api.github.com/repos/octocat/Hello-World/git/blobs/44b4fc6d56897b048c772eb4087f854f46256132',
            };

            githubApi.getBlobFromId = sinon.spy(content => callback => callback(null, blob));

            const tree = { sha: 'sha', url: 'url', tree: [blob] };

            const treeManager = treeManagerFactory(githubApi, parsedContent);
            const rafinedTree = yield treeManager.rafine(tree);

            assert.deepEqual(rafinedTree['/file.rb'], {
                ...blob,
                raw: { ...blob },
                parentTreeSha: 'sha',
                absolutePath: '/file.rb',
            });
        });

        it('should rafine sub-trees', function* () {
            const subTree = {
                path: 'subdir',
                mode: '040000',
                type: 'tree',
                sha: 'f484d249c660418515fb01c2b9662073663c242e',
                url: 'https://api.github.com/repos/octocat/Hello-World/git/blobs/f484d249c660418515fb01c2b9662073663c242e',
            };
            const tree = { sha: 'sha', url: 'url', tree: [subTree] };

            githubApi.getFromUrl = sinon.spy(content => callback => callback(null, { ...subTree, tree: [] }));

            const treeManager = treeManagerFactory(githubApi, parsedContent);
            const rafinedTree = yield treeManager.rafine(tree);

            assert.deepEqual(githubApi.getFromUrl.getCall(0).args[0], subTree.url);
            assert.deepEqual(rafinedTree['/subdir/'], {
                ...subTree,
                tree: [],
                absolutePath: '/subdir/',
            });
        });

        it('should rafine a blob in a sub-tree', function* () {
            const blob = {
                path: 'file.rb',
                mode: 100644,
                type: 'blob',
                size: 30,
                sha: '44b4fc6d56897b048c772eb4087f854f46256132',
                url: 'https://api.github.com/repos/octocat/Hello-World/git/blobs/44b4fc6d56897b048c772eb4087f854f46256132',
            };

            const subTree = {
                path: 'subdir',
                mode: '040000',
                type: 'tree',
                sha: 'f484d249c660418515fb01c2b9662073663c242e',
                url: 'https://api.github.com/repos/octocat/Hello-World/git/blobs/f484d249c660418515fb01c2b9662073663c242e',
            };

            const tree = { sha: 'sha', url: 'url', tree: [subTree] };

            githubApi.getFromUrl = sinon.spy(content => callback => callback(null, { ...subTree, tree: [blob] }));
            githubApi.getBlobFromId = sinon.spy(content => callback => callback(null, blob));

            const treeManager = treeManagerFactory(githubApi, parsedContent);
            const rafinedTree = yield treeManager.rafine(tree);

            assert.deepEqual(githubApi.getFromUrl.getCall(0).args[0], subTree.url);
            assert.deepEqual(rafinedTree['/subdir/file.rb'], {
                ...blob,
                raw: { ...blob },
                parentTreeSha: 'f484d249c660418515fb01c2b9662073663c242e',
                absolutePath: '/subdir/file.rb',
            });
        });
    });
});
