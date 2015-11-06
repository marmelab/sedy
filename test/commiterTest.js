var assert = require('assert');
var sinon = require('sinon');
var commiter = require('../lib/commiter');

describe('commiter', function() {
    var config;
    var content;
    var githubApi;
    var typoFix;

    beforeEach(function() {
        config = {
            committer: {
                name: 'SedBot',
                email: 'a@valid.email',
            },
        };

        content = {
            comment: {
                sender: 'Someone',
                createdDate: '2015-11-06T13:29:00.038Z',
                url: 'http://perdu.com/',
            },
            repository: {
                user: 'Marmelab',
                name: 'SedBot',
            },
            pullRequest: {
                ref: 'master',
            },
        };

        githubApi = {
            createTree: sinon.spy(function() {
                return function(callback) {
                    callback(null, {sha: 'tree sha'});
                };
            }),
            createCommit: sinon.spy(function() {
                return function(callback) {
                    callback(null, {sha: 'commit sha'});
                };
            }),
            updateReference: sinon.spy(function() {
                return function(callback) {
                    callback(null, null);
                };
            }),
            replyToPullRequestReviewComment: sinon.spy(function() {
                return function(callback) {
                    callback(null, null);
                };
            }),
        };

        typoFix = {
            baseTree: 'SHA of commit base tree',
            tree: 'SHA of commit tree',
            parents: ['parents'],
        };
    });

    describe('commit digestion', function() {
        it('should create the good commit tree', function* () {
            yield commiter().digestCommit(config, githubApi, content, typoFix);
            assert.deepEqual(githubApi.createTree.getCall(0).args[0], {
                repoUser: 'Marmelab',
                repoName: 'SedBot',
                baseTree: 'SHA of commit base tree',
                tree: ['SHA of commit tree'],
            });
        });

        it('should create the good commit', function* () {
            yield commiter().digestCommit(config, githubApi, content, typoFix);
            assert.deepEqual(githubApi.createCommit.getCall(0).args[0], {
                repoUser: 'Marmelab',
                repoName: 'SedBot',
                commitAuthor: {
                    name: 'SedBot',
                    email: 'a@valid.email',
                    date: '2015-11-06T13:29:00.038Z',
                },
                commitTree: 'tree sha',
                commitParents: ['parents'],
                commitMessage: 'Typo fix authored by Someone\n' +
                               '\n' +
                               'SedBot is configured to automatically ' +
                               'commit change authored by specific syntax in comment. \n' +
                               'See the trigger at http://perdu.com/',
            });
        });

        it('should correctly update branch reference', function* () {
            yield commiter().digestCommit(config, githubApi, content, typoFix);
            assert.deepEqual(githubApi.updateReference.getCall(0).args[0], {
                repoUser: 'Marmelab',
                repoName: 'SedBot',
                reference: 'heads/master',
                sha: 'commit sha',
                force: true,
            });
        });
    });

    describe('commit', function() {
        var fixedContent;

        beforeEach(function() {
            fixedContent = {
                content: {
                    comment: {
                        id: 42,
                        sender: 'Someone',
                        createdDate: '2015-11-06T13:29:00.038Z',
                        url: 'http://perdu.com/',
                    },
                    repository: {
                        user: 'Marmelab',
                        name: 'SedBot',
                    },
                    pullRequest: {
                        number: 1337,
                    },
                },
                fixes: ['expected commit datas'],
            };
        });

        it('should notice comment author when commit is pushed', function* () {
            yield commiter(config).commit(fixedContent, githubApi);
            assert.deepEqual(
                githubApi.replyToPullRequestReviewComment.getCall(0).args[0],
                {
                    repoUser: 'Marmelab',
                    repoName: 'SedBot',
                    pullRequestNumber: 1337,
                    commentId: 42,
                    message: ':white_check_mark: @Someone, check out my commits !' +
                             ' I have fixed your typo(s) at : commit sha',
                }
            );
        });

        it('should warn comment author if commit failed', function* () {
            config.committer = null; // Raise an exception
            yield commiter(config).commit(fixedContent, githubApi);
            assert.deepEqual(
                githubApi.replyToPullRequestReviewComment.getCall(0).args[0],
                {
                    repoUser: 'Marmelab',
                    repoName: 'SedBot',
                    pullRequestNumber: 1337,
                    commentId: 42,
                    message: ':warning: @Someone, an error occured. ' +
                             'Be sure to check all my commits !',
                }
            );
        });
    });
});
