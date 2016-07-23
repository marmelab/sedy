import { assert } from 'chai';
import gitFactory from './index';

describe('Git library', () => {
    const client = {};
    let options;

    beforeEach(() => {
        options = {
            owner: 'marmelab',
            repository: 'sedy',
        };
    });

    it('should throw an error if repository owner is not specified', () => {
        delete options.owner;
        assert.throws(() => gitFactory(client, options));
    });

    it('should throw an error if repository name is not specified', () => {
        delete options.repository;
        assert.throws(() => gitFactory(client, options));
    });

    it('should return blobs api', () => {
        const git = gitFactory(client, options);
        assert.include(Object.keys(git), 'blobs');
    });

    it('should return trees api', () => {
        const git = gitFactory(client, options);
        assert.include(Object.keys(git), 'trees');
    });

    it('should return commits api', () => {
        const git = gitFactory(client, options);
        assert.include(Object.keys(git), 'commits');
    });

    it('should return repository informations', () => {
        const git = gitFactory(client, options);

        assert.deepEqual(git.repository, {
            id: 'marmelab/sedy',
            owner: 'marmelab',
            name: 'sedy',
        });
    });

    it('should return its store', () => {
        const git = gitFactory(client, options);
        assert.include(Object.keys(git), 'store');
    });
});
