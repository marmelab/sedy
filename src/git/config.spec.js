import { assert } from 'chai';
import config from './config';

describe('Git Config', () => {
    let options;

    beforeEach(() => {
        options = {
            owner: 'marmelab',
            repository: 'sedy',
        };
    });

    it('should throw an error if repository owner is not specified', () => {
        delete options.owner;
        assert.throws(() => config(options));
    });

    it('should throw an error if repository name is not specified', () => {
        delete options.repository;
        assert.throws(() => config(options));
    });

    describe('repository', () => {
        it('should return repository informations', () => {
            options.defaultReference = 'develop';
            const { repository } = config(options);

            assert.deepEqual(repository, {
                id: 'marmelab/sedy',
                owner: 'marmelab',
                name: 'sedy',
                defaultReference: 'develop',
            });
        });

        it('should set default reference to `refs/heads/master`', () => {
            const { repository } = config(options);

            assert.equal(repository.defaultReference, 'refs/heads/master');
        });
    });
});
