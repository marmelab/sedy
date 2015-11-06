var assert = require('assert');
var sinon = require('sinon');
var githubApi = require('../lib/githubApi');

describe('github api proxy', function() {
    describe('pull request', function() {
        var github;

        beforeEach(function() {
            github = {
                pullRequests: {
                    createCommentReply: sinon.spy(function(content, callback) {
                        return callback(null, content);
                    }),
                },
            };
        });

        it('should correctly create comment reply', function* () {
            yield githubApi(github).replyToPullRequestReviewComment({
                repoUser: 'Marmelab',
                repoName: 'SedBot',
                message: 'message',
                commentId: 42,
                pullRequestNumber: 1337,
            });
            assert.deepEqual(
                github.pullRequests.createCommentReply.getCall(0).args[0],
                {
                    user: 'Marmelab',
                    repo: 'SedBot',
                    body: 'message',
                    in_reply_to: 42,
                    number: 1337,
                }
            );
        });
    });

    describe('git data', function() {
        var github;

        beforeEach(function() {
            github = {
                gitdata: {
                    getCommit: sinon.spy(function(content, callback) {
                        return callback(null, content);
                    }),
                    getTree: sinon.spy(function(content, callback) {
                        return callback(null, content);
                    }),
                    getBlob: sinon.spy(function(content, callback) {
                        return callback(null, content);
                    }),
                    createTree: sinon.spy(function(content, callback) {
                        return callback(null, content);
                    }),
                    createCommit: sinon.spy(function(content, callback) {
                        return callback(null, content);
                    }),
                    updateReference: sinon.spy(function(content, callback) {
                        return callback(null, content);
                    }),
                },
            };
        });

        it('should correctly retrieve a commit', function* () {
            yield githubApi(github).getCommitFromId({
                repoUser: 'Marmelab',
                repoName: 'SedBot',
                commitId: 'commit sha',
            });
            assert.deepEqual(
                github.gitdata.getCommit.getCall(0).args[0],
                {
                    user: 'Marmelab',
                    repo: 'SedBot',
                    sha: 'commit sha',
                }
            );
        });

        it('should correctly retrieve a tree', function* () {
            yield githubApi(github).getTreeFromId({
                repoUser: 'Marmelab',
                repoName: 'SedBot',
                id: 'tree sha',
            });
            assert.deepEqual(
                github.gitdata.getTree.getCall(0).args[0],
                {
                    user: 'Marmelab',
                    repo: 'SedBot',
                    sha: 'tree sha',
                    recursive: true,
                }
            );
        });

        it('should correctly retrieve a blob', function* () {
            yield githubApi(github).getBlobFromId({
                repoUser: 'Marmelab',
                repoName: 'SedBot',
                id: 'blob sha',
            });
            assert.deepEqual(
                github.gitdata.getBlob.getCall(0).args[0],
                {
                    user: 'Marmelab',
                    repo: 'SedBot',
                    sha: 'blob sha',
                }
            );
        });

        it('should correctly create a tree', function* () {
            yield githubApi(github).createTree({
                repoUser: 'Marmelab',
                repoName: 'SedBot',
                tree: {some: 'tree'},
                baseTree: 'base tree sha',
            });
            assert.deepEqual(
                github.gitdata.createTree.getCall(0).args[0],
                {
                    user: 'Marmelab',
                    repo: 'SedBot',
                    tree: {some: 'tree'},
                    base_tree: 'base tree sha',
                }
            );
        });

        it('should correctly create a commit', function* () {
            yield githubApi(github).createCommit({
                repoUser: 'Marmelab',
                repoName: 'SedBot',
                commitMessage: 'commit message',
                commitAuthor: {name: 'name', email: 'email'},
                commitTree: 'tree sha',
                commitParents: ['parent'],
            });
            assert.deepEqual(
                github.gitdata.createCommit.getCall(0).args[0],
                {
                    user: 'Marmelab',
                    repo: 'SedBot',
                    message: 'commit message',
                    author: {name: 'name', email: 'email'},
                    tree: 'tree sha',
                    parents: ['parent'],
                }
            );
        });

        it('should correctly update a reference', function* () {
            yield githubApi(github).updateReference({
                repoUser: 'Marmelab',
                repoName: 'SedBot',
                reference: 'branch reference',
                sha: 'commit sha',
                force: true,
            });
            assert.deepEqual(
                github.gitdata.updateReference.getCall(0).args[0],
                {
                    user: 'Marmelab',
                    repo: 'SedBot',
                    ref: 'branch reference',
                    sha: 'commit sha',
                    force: true,
                }
            );
        });
    });
});
