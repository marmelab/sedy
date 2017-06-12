import { assert } from 'chai';
import { stub } from 'sinon';

import parsePullRequestReviewFactory from './parsePullRequestReview';

describe('review parsing', () => {
    const request = {
        body: {
            action: 'submitted',
            diff_hunk: 'diff hunk', // @TODO Use fixture
            position: 'diff position',
            pull_request: {
                number: 42,
                head: { ref: 'master' },
                html_url: 'http://pullrequest.url',
            },
            repository: { name: 'Sedy', owner: { login: 'Marmelab' } },
            review: {
                id: 'review id',
                user: { login: 'Someone who reviewed' },
            },
        },
        headers: { 'X-GitHub-Event': 'submitted' },
    };

    it('should retrieve the review comments', function* () {
        const client = {
            getCommentsFromReviewId: stub().returns(Promise.resolve([])),
        };

        yield parsePullRequestReviewFactory(client)(request);

        assert(client.getCommentsFromReviewId.calledWith({
            pullRequestNumber: request.body.pull_request.number,
            repoName: request.body.repository.name,
            repoUser: request.body.repository.owner.login,
            reviewId: request.body.review.id,
        }));
    });

    it('should find correct data', function* () {
        const client = {
            getCommentsFromReviewId: () => Promise.resolve([]),
        };

        const { pullRequest, repository, sender } = yield parsePullRequestReviewFactory(client)(request);

        assert.deepEqual(pullRequest, {
            number: request.body.pull_request.number,
            ref: `refs/heads/${request.body.pull_request.head.ref}`,
            url: request.body.pull_request.html_url,
        });

        assert.deepEqual(repository, {
            name: request.body.repository.name,
            user: request.body.repository.owner.login,
        });

        assert.deepEqual(sender, request.body.review.user.login);
    });

    it('should find correct comments', function* () {
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

        const { fixes: [{ comment: comment1 }, { comment: comment2 }] } = yield parsePullRequestReviewFactory(client)(request);

        assert.deepEqual(comment1, {
            body: 'comment body',
            createdDate: 'comment date',
            diffHunk: 'diff hunk',
            id: 'comment id',
            path: 'comment path',
            position: 'diff position',
            url: 'comment url',
        });

        assert.deepEqual(comment2, {
            body: 'comment body',
            createdDate: 'comment date',
            diffHunk: 'diff hunk',
            id: 'comment id 2',
            path: 'comment path',
            position: 'diff position',
            url: 'comment url',
        });
    });
});
