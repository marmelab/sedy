import blobs from './blobs';
import commits from './commits';
import trees from './trees';

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

    const repository = {
        id: `${options.owner}/${options.repository}`,
        owner: options.owner,
        name: options.repository,
    };

    return {
        blobs: blobs(client, repository),
        commits: commits(client, repository),
        trees: trees(client, repository),
        repository,
    };
};
