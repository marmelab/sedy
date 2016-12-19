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

    it('should find correct comment', () => {
        const [{ comment }] = parsePullRequestReviewComment(request);

        assert.deepEqual(comment, {
            body: 'comment body',
            createdDate: 'comment date',
            diffHunk: 'diff hunk',
            id: 'comment id',
            path: 'comment path',
            position: 'diff position',
            sender: 'Someone',
            url: 'comment url',
        });
    });
});
