import sinon from 'sinon';
import commiterFactory from './commiter';
import { assert } from 'chai';

describe('Commiter', () => {
    let config;
    let githubApi;
    let parsedContent;

    beforeEach(() => {
        config = {};
        githubApi = {
            replyToPullRequestReviewComment: sinon.spy(content => callback => callback(null, content)),
        };
        parsedContent = {
            repository: { user: 'marmelab', name: 'sedy' },
            comment: { id: 42, sender: 'username' },
            pullRequest: { number: 1 },
        };
    });

    describe('workflow', () => {
        it('should warn the comment author if no fix found', function* () {
            const commiter = commiterFactory(config, githubApi);
            const result = yield commiter.commit(parsedContent, null);

            assert.deepEqual(result, false);
            assert.deepEqual(githubApi.replyToPullRequestReviewComment.getCall(0).args[0], {
                repoUser: 'marmelab',
                repoName: 'sedy',
                pullRequestNumber: 1,
                commentId: 42,
                message: ':confused: @username, I did not understand the request.',
            });
        });

        it('should create a tree');

        it('shoud create a commit');

        it('should force update branch reference');

        it('should warn the author that the commit is pushed');
    });

    describe('security', () => {
        it('should warn the author if an occured while commiting');
    });
});
