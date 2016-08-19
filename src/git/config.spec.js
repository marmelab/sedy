import { assert } from 'chai';
import config from './config';

describe('Git Config', () => {
    let options;

    beforeEach(() => {
        options = {
            repository: {
                owner: 'marmelab',
                name: 'sedy',
            },
            commitAuthor: {
                name: 'commit author',
                email: 'author@mail.com',
            },
        };
    });

    it('should throw an error if repository is not specified', () => {
        delete options.repository;
        assert.throws(() => config(options));
    });

    it('should throw an error if commit author is not specified', () => {
        delete options.commitAuthor;
        assert.throws(() => config(options));
    });

    describe('repository', () => {
        it('should return repository informations', () => {
            options.repository.defaultReference = 'develop';
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

    describe('commit author', () => {
        it('should return commit author informations', () => {
            const { commitAuthor } = config(options);

            assert.deepEqual(commitAuthor, {
                name: 'commit author',
                email: 'author@mail.com',
            });
        });
    });
});
