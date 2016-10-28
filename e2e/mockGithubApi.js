import nock from 'nock';

export default function () {
    const api = nock('https://api.github.com');

    api.get(/repos/).reply(200, { sha: '8d10a43368b8b25d5079422496f2df43f5e1dc93', tree: { sha: '8d10a43368b8b25d5079422496f2df43f5e1dc93' } });
}
