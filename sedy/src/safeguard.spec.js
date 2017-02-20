import sinon from 'sinon';
import { assert } from 'chai';
import safeguardFactory from './safeguard';

describe('SafeGuard', () => {
    let answerer;
    let githubClient;
    let parsedContent;

    beforeEach(() => {
        answerer = {
            replyToComment: sinon.spy(() => callback => callback(null, null)),
        };
        githubClient = {};
        parsedContent = {
            pullRequest: { number: 1, ref: 'branch-name' },
            repository: { user: 'marmelab', name: 'sedy' },
            sender: 'username',
            fixes: [{
                comment: {
                    id: 42,
                    createdDate: new Date(),
                    url: 'http://perdu.com',
                    path: 'folder/to/blob.txt',
                },
            }],
        };
    });

    it('should not allow a comment from a no-collaborator', function* () {
        githubClient.getRepoCollaborators = sinon.spy(() => callback => callback(null, []));

        const safeguard = safeguardFactory(githubClient, answerer, parsedContent);
        const result = yield safeguard.checkCommenterCanCommit();

        assert.deepEqual(result, false);
        assert.deepEqual(answerer.replyToComment.getCall(0).args, [
            42,
            ':x: @username, you are not allowed to commit on this repository.',
        ]);
    });

    it('should not allow a comment from a collaborator with no permission', function* () {
        githubClient.getRepoCollaborators = sinon.spy(() => callback => callback(null, [{
            login: 'username',
            permission: 'none',
        }]));

        const safeguard = safeguardFactory(githubClient, answerer, parsedContent);
        const result = yield safeguard.checkCommenterCanCommit();

        assert.deepEqual(result, false);
        assert.deepEqual(answerer.replyToComment.getCall(0).args, [
            42,
            ':x: @username, you are not allowed to commit on this repository.',
        ]);
    });

    it('should not allow a comment from a collaborator with read only access (backward compatibility)', function* () {
        githubClient.getRepoCollaborators = sinon.spy(() => callback => callback(null, [{
            login: 'username',
            permissions: { pull: true },
        }]));

        const safeguard = safeguardFactory(githubClient, answerer, parsedContent);
        const result = yield safeguard.checkCommenterCanCommit();

        assert.deepEqual(result, false);
        assert.deepEqual(answerer.replyToComment.getCall(0).args, [
            42,
            ':x: @username, you are not allowed to commit on this repository.',
        ]);
    });

    it('should not allow a comment from a collaborator with read only access', function* () {
        githubClient.getRepoCollaborators = sinon.spy(() => callback => callback(null, [{
            login: 'username',
            permission: 'read',
        }]));

        const safeguard = safeguardFactory(githubClient, answerer, parsedContent);
        const result = yield safeguard.checkCommenterCanCommit();

        assert.deepEqual(result, false);
        assert.deepEqual(answerer.replyToComment.getCall(0).args, [
            42,
            ':x: @username, you are not allowed to commit on this repository.',
        ]);
    });

    it('should allow a comment from a collaborator with write access (backward compatibility)', function* () {
        githubClient.getRepoCollaborators = sinon.spy(() => callback => callback(null, [{
            login: 'username',
            permissions: { push: true },
        }]));

        const safeguard = safeguardFactory(githubClient, answerer, parsedContent);
        const result = yield safeguard.checkCommenterCanCommit();

        assert.deepEqual(result, true);
        assert.equal(answerer.replyToComment.callCount, 0);
    });

    it('should allow a comment from a collaborator with write access', function* () {
        githubClient.getRepoCollaborators = sinon.spy(() => callback => callback(null, [{
            login: 'username',
            permission: 'write',
        }]));

        const safeguard = safeguardFactory(githubClient, answerer, parsedContent);
        const result = yield safeguard.checkCommenterCanCommit();

        assert.deepEqual(result, true);
        assert.equal(answerer.replyToComment.callCount, 0);
    });

    it('should allow a comment from a repository administrator (backward compatibility)', function* () {
        githubClient.getRepoCollaborators = sinon.spy(() => callback => callback(null, [{
            login: 'username',
            permissions: { admin: true },
        }]));

        const safeguard = safeguardFactory(githubClient, answerer, parsedContent);
        const result = yield safeguard.checkCommenterCanCommit();

        assert.deepEqual(result, true);
        assert.equal(answerer.replyToComment.callCount, 0);
    });

    it('should allow a comment from a repository administrator', function* () {
        githubClient.getRepoCollaborators = sinon.spy(() => callback => callback(null, [{
            login: 'username',
            permission: 'admin',
        }]));

        const safeguard = safeguardFactory(githubClient, answerer, parsedContent);
        const result = yield safeguard.checkCommenterCanCommit();

        assert.deepEqual(result, true);
        assert.equal(answerer.replyToComment.callCount, 0);
    });
});
