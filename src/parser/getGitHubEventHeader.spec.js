import { assert } from 'chai';
import getGitHubEventHeader from './getGitHubEventHeader';

describe('getGitHubEventHeader', () => {
    it('should return value of header X-GitHub-Event', () => {
        const result = getGitHubEventHeader({
            'X-GitHub-Event': 'foo',
        });
        assert.deepEqual(result, 'foo');
    });
    it('should return value of header x-github-event', () => {
        const result = getGitHubEventHeader({
            'x-github-event': 'foo',
        });
        assert.deepEqual(result, 'foo');
    });
    it('should return value of header X-GITHUB-EVENT', () => {
        const result = getGitHubEventHeader({
            'X-GITHUB-EVENT': 'foo',
        });
        assert.deepEqual(result, 'foo');
    });
});
