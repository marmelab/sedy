import sinon from 'sinon';
import { assert } from 'chai';
import answererFactory from './answerer';

describe('Answerer', () => {
    let answerer;
    let githubClient;

    beforeEach(() => {
        githubClient = {
            replyToPullRequestReviewComment: sinon.spy(() => callback => callback(null, null)),
        };

        const parsedContent = {
            repository: { user: 'marmelab', name: 'sedy' },
            pullRequest: { number: 42 },
        };

        answerer = answererFactory(githubClient, parsedContent);
    });

    describe('replyToComment', () => {
        it('should reply to a given comment', function* () {
            const commentId = 50;

            yield answerer.replyToComment(commentId, 'Here is the message');

            assert.deepEqual(githubClient.replyToPullRequestReviewComment.getCall(0).args[0], {
                repoUser: 'marmelab',
                repoName: 'sedy',
                pullRequestNumber: 42,
                commentId,
                message: 'Here is the message',
            });
        });
    });
});
