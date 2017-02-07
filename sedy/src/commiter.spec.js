import sinon from 'sinon';
import { assert } from 'chai';
import commiterFactory from './commiter';

describe('Commiter', () => {
    let git;
    let githubApi;
    let parsedContent;
    let fixedContent;
    let logger;

    beforeEach(() => {
        git = {
            add: sinon.spy(content => callback => callback(null, null)),
            checkout: sinon.spy(content => callback => callback(null, null)),
            commit: sinon.spy(content => callback => callback(null, { sha: 'commit sha' })),
            commitAuthor: { name: 'marmelab-bot' },
            push: sinon.spy(content => callback => callback(null, null)),
        };
        githubApi = {
            getRepoCollaborators: sinon.spy(content => callback => callback(null, [{
                login: 'username',
                permissions: { push: true },
            }])),
            replyToPullRequestReviewComment: sinon.spy(content => callback => callback(null, null)),
        };
        parsedContent = {
            comment: {
                id: 42,
                createdDate: new Date(),
                url: 'http://perdu.com',
                path: 'folder/to/blob.txt',
            },
            pullRequest: { number: 1, ref: 'branch-name' },
            repository: { user: 'marmelab', name: 'sedy' },
            sender: 'username',
        };
        fixedContent = [{
            blob: { content: 'old blob content' },
            content: 'new blob content',
            match: { from: 'old', to: 'new' },
        }];
        logger = {
            info: sinon.spy(),
        };
    });

    describe('workflow', () => {
        it('should warn the comment author if no fix found', function* () {
            const commiter = commiterFactory(logger, githubApi, git);
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

        it('should checkout to the related branch', function* () {
            const commiter = commiterFactory(logger, githubApi, git);
            yield commiter.commit(parsedContent, fixedContent);

            assert.deepEqual(git.checkout.getCall(0).args[0], 'branch-name');
        });

        it('should add a new blob head', function* () {
            const commiter = commiterFactory(logger, githubApi, git);
            yield commiter.commit(parsedContent, fixedContent);

            assert(git.add.calledWith({
                content: 'new blob content',
                mode: '100644',
            }, '/folder/to/blob.txt'));
        });

        it('shoud create a commit', function* () {
            const commiter = commiterFactory(logger, githubApi, git);
            yield commiter.commit(parsedContent, fixedContent);

            assert(git.commit.calledWith('branch-name', `Typo fix s/old/new/

As requested by @username at http://perdu.com`,
            ));
        });

        it('should push to the related branch', function* () {
            const commiter = commiterFactory(logger, githubApi, git);
            yield commiter.commit(parsedContent, fixedContent);

            assert(git.push.calledWith('branch-name'));
        });
    });

    describe('security', () => {
        it('should warn the author if an occured while commiting', function* () {
            const commiter = commiterFactory(logger, githubApi, git);
            const result = yield commiter.commit(parsedContent, { missing: 'value' });

            assert.deepEqual(result, false);
            assert.deepEqual(githubApi.replyToPullRequestReviewComment.getCall(0).args, [{
                repoUser: 'marmelab',
                repoName: 'sedy',
                pullRequestNumber: 1,
                commentId: 42,
                message: ':warning: @username, an error occured.\nBe sure to check all my commits!',
            }]);
        });

        it('should not allow a comment from a no-collaborator', function* () {
            githubApi.getRepoCollaborators = sinon.spy(content => callback => callback(null, []));

            const commiter = commiterFactory(logger, githubApi, git);
            const result = yield commiter.commit(parsedContent, fixedContent);

            assert.deepEqual(result, false);
            assert.deepEqual(githubApi.replyToPullRequestReviewComment.getCall(0).args, [{
                repoUser: 'marmelab',
                repoName: 'sedy',
                pullRequestNumber: 1,
                commentId: 42,
                message: ':x: @username, you are not allowed to commit on this repository.',
            }]);
        });

        it('should not allow a comment from a collaborator with read only access', function* () {
            githubApi.getRepoCollaborators = sinon.spy(content => callback => callback(null, [{
                login: 'username',
                permissions: { pull: true },
            }]));

            const commiter = commiterFactory(logger, githubApi, git);
            const result = yield commiter.commit(parsedContent, fixedContent);

            assert.deepEqual(result, false);
            assert.deepEqual(githubApi.replyToPullRequestReviewComment.getCall(0).args, [{
                repoUser: 'marmelab',
                repoName: 'sedy',
                pullRequestNumber: 1,
                commentId: 42,
                message: ':x: @username, you are not allowed to commit on this repository.',
            }]);
        });
    });
});
