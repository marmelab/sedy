import blobs from './objects/blobs';
import commits from './objects/commits';
import trees from './objects/trees';
import storeFactory from './store';

const mandatoryOptions = ['owner', 'repository'];

const checkOptions = options => {
    const missingOptions = mandatoryOptions.reduce((missings, option) => {
        if (Object.keys(options).indexOf(option) === -1) {
            missings.push(option);
        }

        return missings;
    }, []);

    if (missingOptions.length > 0) {
        throw Error(`These options are required: ${missingOptions.join(', ')}`);
    }
};

export default (client, options) => {
    checkOptions(options);

    const store = storeFactory();

    const repository = {
        id: `${options.owner}/${options.repository}`,
        owner: options.owner,
        name: options.repository,
    };

    return {
        blobs: blobs(client, repository, store),
        commits: commits(client, repository, store),
        trees: trees(client, repository, store),
        repository,
        store,
    };
};
