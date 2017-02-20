import sinon from 'sinon';
import { assert } from 'chai';
import commiterFactory from './commiter';

describe('Commiter', () => {
    const logger = {
        debug: () => {},
        info: () => {},
    };

    let githubClient;
    let git;
    let parsedContent;

    beforeEach(() => {
        githubClient = {};
        git = {
            checkout: sinon.spy(() => callback => callback(null, null)),
            add: sinon.spy(() => callback => callback(null, null)),
            commit: sinon.spy(() => callback => callback(null, 'commit sha')),
            push: sinon.spy(() => callback => callback(null, null)),
        };
        parsedContent = {
            sender: 'username',
            pullRequest: { ref: 'branch' },
        };
    });

    describe('init', () => {
        it('should checkout to the pull request branch', function* () {
            const commiter = commiterFactory(githubClient, git, logger, parsedContent);

            yield commiter.init();

            assert.equal(git.checkout.callCount, 1);
            assert.deepEqual(git.checkout.getCall(0).args, ['branch']);
        });
    });

    describe('prepareCommit', () => {
        it('should git add the updated blob', function* () {
            const commiter = commiterFactory(githubClient, git, logger, parsedContent);

            const fix = {
                blob: { content: 'blob content' },
                content: 'fix content',
                match: { from: 'from', to: 'to' },
            };

            const fixRequest = {
                fixes: [fix],
                comment: {
                    path: 'README.md',
                    url: 'https://perdu.com',
                },
            };

            yield commiter.prepareCommit(fixRequest, fix, 'parent');

            assert.equal(git.add.callCount, 1);
            assert.deepEqual(git.add.getCall(0).args, [{
                content: 'fix content',
                mode: '100644',
            }, '/README.md']);
        });

        it('should create a commit with it', function* () {
            const commiter = commiterFactory(githubClient, git, logger, parsedContent);

            const fix = {
                blob: { content: 'blob content' },
                content: 'fix content',
                match: { from: 'from', to: 'to' },
            };

            const fixRequest = {
                fixes: [fix],
                comment: {
                    path: 'README.md',
                    url: 'https://perdu.com',
                },
            };

            yield commiter.prepareCommit(fixRequest, fix, 'parent');

            const expectedMessage = `Typo fix s/from/to/

As requested by username at https://perdu.com`;

            assert.equal(git.commit.callCount, 1);
            assert.deepEqual(git.commit.getCall(0).args, [
                'branch',
                expectedMessage,
                'parent',
            ]);
        });
    });

    describe('push', () => {
        it('should push to the branch if there is a commit to push', function* () {
            const commiter = commiterFactory(githubClient, git, logger, parsedContent);

            const result = yield commiter.push('commit sha');

            assert.equal(result, true);
            assert.equal(git.push.callCount, 1);
            assert.deepEqual(git.push.getCall(0).args, ['branch']);
        });

        it('should not git push to the branch if there is no commit to push', function* () {
            const commiter = commiterFactory(githubClient, git, logger, parsedContent);

            const result = yield commiter.push();

            assert.equal(result, false);
            assert.equal(git.push.callCount, 0);
        });
    });
});
