import config from './config';
import storeFactory from './store';

import blobs from './objects/blobs';
import commits from './objects/commits';
import references from './objects/references';
import trees from './objects/trees';

export default (client, options) => {
    const { repository } = config(options);
    const store = storeFactory();

    return {
        blobs: blobs(client, repository, store),
        commits: commits(client, repository, store),
        references: references(client, repository),
        trees: trees(client, repository, store),
        repository,
        store,
    };
};
