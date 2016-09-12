import { assert } from 'chai';
import sinon from 'sinon';
import githubApi from './github';

describe('Github API', () => {
    const logger = {
        debug: sinon.spy(),
        info: sinon.spy(),
        error: sinon.spy(),
    };
    let github;

    beforeEach(() => {
        github = {
            get: sinon.spy((endpoint, callback) => callback(null, 200, endpoint)),
            post: sinon.spy((endpoint, content, callback) => callback(null, 200, [endpoint, content])),
            patch: sinon.spy((endpoint, content, callback) => callback(null, 200, [endpoint, content])),
        };
    });

    describe('pull request', () => {
        it('should reply to a pull request review comment', function* () {
            const result = yield githubApi(logger, github).replyToPullRequestReviewComment({
                repoUser: 'User',
                repoName: 'Repo',
                message: 'message',
                commentId: 42,
                pullRequestNumber: 24,
            });

            assert.deepEqual(result, ['/repos/User/Repo/pulls/24/comments', {
                user: 'User',
                repo: 'Repo',
                body: 'message',
                in_reply_to: 42,
                number: 24,
            }]);
        });
    });

    describe('commit', () => {
        it('should retrieve a commit from its sha', function* () {
            const result = yield githubApi(logger, github).getCommitFromId({
                repoUser: 'User',
                repoName: 'Repo',
                commitId: 42,
            });

            assert.deepEqual(result, '/repos/User/Repo/git/commits/42');
        });

        it('should create a commit', function* () {
            const result = yield githubApi(logger, github).createCommit({
                repoUser: 'User',
                repoName: 'Repo',
                commitMessage: 'message',
                commitAuthor: 'author',
                commitTree: 'tree',
                commitParents: ['father', 'mother'],
            });

            assert.deepEqual(result, ['/repos/User/Repo/git/commits', {
                user: 'User',
                repo: 'Repo',
                message: 'message',
                author: 'author',
                tree: 'tree',
                parents: ['father', 'mother'],
            }]);
        });
    });

    describe('tree', () => {
        it('should retrieve a tree recursively from its id', function* () {
            const result = yield githubApi(logger, github).getTreeFromId({
                repoUser: 'User',
                repoName: 'Repo',
                id: 42,
            });

            assert.deepEqual(result, '/repos/User/Repo/git/trees/42?recursive=1');
        });

        it('should create a tree', function* () {
            const result = yield githubApi(logger, github).createTreeFromBase({
                repoUser: 'User',
                repoName: 'Repo',
                tree: 'tree',
                baseTree: 'base tree',
            });

            assert.deepEqual(result, ['/repos/User/Repo/git/trees', {
                user: 'User',
                repo: 'Repo',
                tree: 'tree',
                base_tree: 'base tree',
            }]);
        });
    });

    describe('blob', () => {
        it('should retrieve a blob from its id', function* () {
            const result = yield githubApi(logger, github).getBlobFromId({
                repoUser: 'User',
                repoName: 'Repo',
                id: 42,
            });

            assert.deepEqual(result, '/repos/User/Repo/git/blobs/42');
        });
    });

    describe('reference', () => {
        it('should force update a branch reference', function* () {
            const result = yield githubApi(logger, github).updateReference({
                repoUser: 'User',
                repoName: 'Repo',
                reference: 'reference',
                sha: 'sha',
                force: true,
            });

            assert.deepEqual(result, ['/repos/User/Repo/git/refs/reference', {
                user: 'User',
                repo: 'Repo',
                ref: 'reference',
                sha: 'sha',
                force: true,
            }]);
        });

        it('should update a branch reference without force', function* () {
            const result = yield githubApi(logger, github).updateReference({
                repoUser: 'User',
                repoName: 'Repo',
                reference: 'reference',
                sha: 'sha',
                force: false,
            });

            assert.deepEqual(result, ['/repos/User/Repo/git/refs/reference', {
                user: 'User',
                repo: 'Repo',
                ref: 'reference',
                sha: 'sha',
                force: false,
            }]);
        });
    });
});
