var assert = require('assert');
var sinon = require('sinon');
var fixer = require('../lib/fixer');

describe('fixer', function() {
    var githubApi;
    var content;

    beforeEach(function() {
        githubApi = {
            replyToPullRequestReviewComment: sinon.spy(function() {
                return function(callback) {
                    callback(null, null);
                };
            }),
            getCommitFromId: sinon.spy(function() {
                return function(callback) {
                    callback(null, {tree: {sha: 'miaou'}});
                };
            }),
            getTreeFromId: sinon.spy(function() {
                return function(callback) {
                    callback(null, {tree: [{
                        path: 'README.md',
                        sha: 'blob id',
                    }]});
                };
            }),
            getBlobFromId: sinon.spy(function() {
                return function(callback) {
                    callback(null, null);
                };
            }),
        };

        content = {
            type: 'pull_request_review_comment',
            comment: {
                id: 42,
                body: 's/From/to/',
                sender: 'Someone',
                path: 'README.md',
                position: 1,
                createdDate: new Date().toISOString(),
                url: 'http://perdu.com/',
            },
            commit: {
                id: 24,
            },
            repository: {
                user: 'Marmelab',
                name: 'SedBot',
            },
            pullRequest: {
                number: 1337,
                ref: 'master',
            },
        };
    });

    describe('reply', function() {
        it('should call github api with good args', function* () {
            yield fixer().reply(githubApi, content, 'Some cool message');
            assert.deepEqual(
                githubApi.replyToPullRequestReviewComment.getCall(0).args[0], {
                    repoUser: 'Marmelab',
                    repoName: 'SedBot',
                    pullRequestNumber: 1337,
                    commentId: 42,
                    message: 'Some cool message',
                }
            );
        });

        it('should not call github api if bad type', function* () {
            content.type = 'bad type';
            yield fixer().reply(githubApi, content, 'Some cool message');
            assert.deepEqual(
                githubApi.replyToPullRequestReviewComment.callCount,
                0
            );
        });
    });

    describe('blob fix', function() {
        var lastCommit;
        var treeBlob;
        var blob;
        var match;
        var result;

        beforeEach(function() {
            lastCommit = {sha: 'miaou', tree: {sha: 'arbre à chat'}};
            treeBlob = {
                path: 'README.md',
                mode: '100640',
                type: 'blob',
            };
            blob = {
                encoding: 'base64',
                content: new Buffer('From nintendo').toString('base64'),
            };
            match = {from: 'From', to: 'To'};
        });

        it('should replace good line and return new one', function() {
            result = fixer().fixBlob(content, lastCommit, blob, treeBlob, match);
            assert.deepEqual(result, {
                parents: ['miaou'],
                baseTree: 'arbre à chat',
                tree: {
                    path: 'README.md',
                    content: 'To nintendo',
                    mode: '100640',
                    type: 'blob',
                },
            });
        });

        it('should multiple replace in a line and return correct new one', function() {
            blob.content = new Buffer('From nintendo from').toString('base64');
            result = fixer().fixBlob(content, lastCommit, blob, treeBlob, match);
            assert.deepEqual(result, {
                parents: ['miaou'],
                baseTree: 'arbre à chat',
                tree: {
                    path: 'README.md',
                    content: 'To nintendo To',
                    mode: '100640',
                    type: 'blob',
                },
            });
        });
    });

    describe('match fix', function() {
        var match;

        beforeEach(function() {
            match = {from: 'From', to: 'To'};
        });

        it('should retrieve correct last commit', function* () {
            yield fixer().fixMatch(githubApi, content, match);
            assert.deepEqual(githubApi.getCommitFromId.getCall(0).args[0], {
                repoUser: 'Marmelab',
                repoName: 'SedBot',
                commitId: 24,
            });
        });

        it('should retrieve correct last commit tree', function* () {
            yield fixer().fixMatch(githubApi, content, match);
            assert.deepEqual(githubApi.getTreeFromId.getCall(0).args[0], {
                repoUser: 'Marmelab',
                repoName: 'SedBot',
                id: 'miaou',
            });
        });

        it('should retrieve correct blob', function* () {
            yield fixer().fixMatch(githubApi, content, match);
            assert.deepEqual(githubApi.getBlobFromId.getCall(0).args[0], {
                repoUser: 'Marmelab',
                repoName: 'SedBot',
                id: 'blob id',
            });
        });
    });

    describe('typo fix', function() {
        var result;

        it('should return nothing if no content', function* () {
            result = yield fixer().fixTypo(null, githubApi);
            assert.deepEqual(result, null);
        });

        it('should return nothing if no matches', function* () {
            result = yield fixer().fixTypo({matches: []}, githubApi);
            assert.deepEqual(result, null);
        });
    });
});
