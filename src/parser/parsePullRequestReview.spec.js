import { assert } from 'chai';
import { stub } from 'sinon';

import parsePullRequestReviewFactory from './parsePullRequestReview';

describe('review parsing', () => {
    const request = {
        body: {
            action: 'submitted',
            diff_hunk: 'diff hunk', // @TODO Use fixture
            position: 'diff position',
            pull_request: { number: 42, head: { ref: 'master' } },
            repository: { name: 'Sedy', owner: { login: 'Marmelab'} },
            review: {
                id: 'review id',
            },
            sender: { login: 'Someone' },
        },
        headers: { 'X-GitHub-Event': 'submitted' },
    };

    it('should retrieve the review comments', async () => {
        const client = {
            getCommentsFromReviewId: stub().returns(Promise.resolve([])),
        };

        await parsePullRequestReviewFactory(client)(request);

        assert(client.getCommentsFromReviewId.calledWith({
            pullRequestNumber: request.body.pull_request.number,
            repoName: request.body.repository.name,
            repoUser: request.body.repository.owner.login,
            reviewId: request.body.review.id,
        }));
    });

    it('should find correct comments', async () => {
        const client = {
            getCommentsFromReviewId: () => Promise.resolve([{
                body: 'comment body',
                commit_id: 'commit_id',
                created_at: 'comment date',
                diff_hunk: 'diff hunk',
                html_url: 'comment url',
                id: 'comment id',
                path: 'comment path',
                position: 'diff position',
                user: {
                    login: 'Someone',
                },
            }, {
                body: 'comment body',
                commit_id: 'commit_id',
                created_at: 'comment date',
                diff_hunk: 'diff hunk',
                html_url: 'comment url',
                id: 'comment id 2',
                path: 'comment path',
                position: 'diff position',
                user: {
                    login: 'Someone',
                },
            }]),
        };

        const [{ comment: comment1 }, { comment: comment2 }] = await parsePullRequestReviewFactory(client)(request);

        assert.deepEqual(comment1, {
            body: 'comment body',
            createdDate: 'comment date',
            diffHunk: 'diff hunk',
            id: 'comment id',
            path: 'comment path',
            position: 'diff position',
            sender: 'Someone',
            url: 'comment url',
        });

        assert.deepEqual(comment2, {
            body: 'comment body',
            createdDate: 'comment date',
            diffHunk: 'diff hunk',
            id: 'comment id 2',
            path: 'comment path',
            position: 'diff position',
            sender: 'Someone',
            url: 'comment url',
        });
    });
});
