import { assert } from 'chai';
import parsePullRequestReviewComment from './parsePullRequestReviewComment';

describe('pull request parsing', () => {
    const request = {
        headers: { 'X-GitHub-Event': 'pull_request_review_comment' },
        body: {
            action: 'created',
            comment: {
                id: 'comment id',
                body: 'comment body',
                path: 'comment path',
                created_at: 'comment date',
                html_url: 'comment url',
            },
            sender: { login: 'Someone' },
            repository: { name: 'Sedy', owner: { login: 'Marmelab'} },
            pull_request: { number: 42, head: { ref: 'master' } },
            diff_hunk: 'diff hunk', // @TODO Use fixture
            position: 'diff position',
        },
    };

    it('should find correct data', function* () {
        const client = {
            getCommentsFromReviewId: () => Promise.resolve([]),
        };

        const { pullRequest, repository, sender } = yield parsePullRequestReviewComment(client)(request);

        assert.deepEqual(pullRequest, {
            number: request.body.pull_request.number,
            ref: `refs/heads/${request.body.pull_request.head.ref}`,
        });

        assert.deepEqual(repository, {
            name: request.body.repository.name,
            user: request.body.repository.owner.login,
        });

        assert.deepEqual(sender, request.body.sender.login);
    });

    it('should find correct comment', function* () {
        const { fixes: [{ comment }] } = yield parsePullRequestReviewComment()(request);

        assert.deepEqual(comment, {
            body: 'comment body',
            createdDate: 'comment date',
            diffHunk: 'diff hunk',
            id: 'comment id',
            path: 'comment path',
            position: 'diff position',
            url: 'comment url',
        });
    });
});
