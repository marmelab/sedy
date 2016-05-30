import sinon from 'sinon';
import commiterFactory from './commiter';
import { assert } from 'chai';

describe('Commiter', () => {
    let config;
    let githubApi;
    let parsedContent;
    let fixedContent;

    beforeEach(() => {
        config = {
            committer: { name: 'user', email: 'user@fake.mail' },
        };
        githubApi = {
            replyToPullRequestReviewComment: sinon.spy(content => callback => callback(null, null)),
            createTree: sinon.spy(content => callback => callback(null, { sha: 'tree sha' })),
            createCommit: sinon.spy(content => callback => callback(null, { sha: 'commit sha' })),
            updateReference: sinon.spy(content => callback => callback(null, null)),
        };
        parsedContent = {
            repository: { user: 'marmelab', name: 'sedy' },
            comment: {
                id: 42,
                sender: 'username',
                createdDate: new Date(),
                url: 'http://perdu.com',
            },
            pullRequest: { number: 1, ref: 'master' },
        };
        fixedContent = [{
            sha: 'sha',
            baseTree: 'baseTree',
            tree: 'tree',
            parents: ['parent'],
        }];
    });

    describe('workflow', () => {
        it('should warn the comment author if no fix found', function* () {
            const commiter = commiterFactory(config, githubApi);
            const result = yield commiter.commit(parsedContent, null);

            assert.deepEqual(result, false);
            assert.deepEqual(githubApi.replyToPullRequestReviewComment.getCall(0).args, [{
                repoUser: 'marmelab',
                repoName: 'sedy',
                pullRequestNumber: 1,
                commentId: 42,
                message: ':confused: @username, I did not understand the request.',
            }]);
        });

        it('should create a tree', function* () {
            const commiter = commiterFactory(config, githubApi);
            yield commiter.commit(parsedContent, fixedContent);

            assert.deepEqual(githubApi.createTree.getCall(0).args, [{
                baseTree: 'baseTree',
                repoName: 'sedy',
                repoUser: 'marmelab',
                tree: ['tree'],
            }]);
        });

        it('shoud create a commit', function* () {
            const commiter = commiterFactory(config, githubApi);
            yield commiter.commit(parsedContent, fixedContent);

            assert.deepEqual(githubApi.createCommit.getCall(0).args, [{
                repoName: 'sedy',
                repoUser: 'marmelab',
                commitAuthor: {
                    name: 'user',
                    email: 'user@fake.mail',
                    date: parsedContent.comment.createdDate,
                },
                commitParents: ['parent'],
                commitTree: 'tree sha',
                commitMessage: `Typo fix authored by username

user is configured to automatically commit change authored by specific syntax in a comment.
See the trigger at http://perdu.com`,
            }]);
        });

        it('should force update branch reference', function* () {
            const commiter = commiterFactory(config, githubApi);
            yield commiter.commit(parsedContent, fixedContent);

            assert.deepEqual(githubApi.updateReference.getCall(0).args, [{
                repoName: 'sedy',
                repoUser: 'marmelab',
                sha: 'commit sha',
                reference: 'heads/master',
                force: true,
            }]);
        });

        it('should warn the author that the commit is pushed', function* () {
            const commiter = commiterFactory(config, githubApi);
            const result = yield commiter.commit(parsedContent, fixedContent);

            assert.deepEqual(result, true);
            assert.deepEqual(githubApi.replyToPullRequestReviewComment.getCall(0).args, [{
                repoUser: 'marmelab',
                repoName: 'sedy',
                pullRequestNumber: 1,
                commentId: 42,
                message: ':white_check_mark: @username, check out my commits!\nI have fixed your typo(s) at commit sha',
            }]);
        });
    });

    describe('security', () => {
        it('should warn the author if an occured while commiting', function* () {
            delete config.committer;
            const commiter = commiterFactory(config, githubApi);

            const result = yield commiter.commit(parsedContent, fixedContent);

            assert.deepEqual(result, false);
            assert.deepEqual(githubApi.replyToPullRequestReviewComment.getCall(0).args, [{
                repoUser: 'marmelab',
                repoName: 'sedy',
                pullRequestNumber: 1,
                commentId: 42,
                message: ':warning: @username, an error occured.\nBe sure to check all my commits!',
            }]);
        });
    });
});
