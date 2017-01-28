import config from './config';
import storeFactory from './store';

import blobsFactory from './objects/blobs';
import commitsFactory from './objects/commits';
import referencesFactory from './objects/references';
import treesFactory from './objects/trees';

import add from './commands/add';
import checkout from './commands/checkout';
import commit from './commands/commit';
import push from './commands/push';

export default (client, options) => {
    const { repository, commitAuthor } = config(options);
    const store = storeFactory();

    const blobs = blobsFactory(client, repository, store);
    const commits = commitsFactory(client, repository, store);
    const references = referencesFactory(client, repository);
    const trees = treesFactory(client, repository, store);

    return {
        add: add(references, commits, trees),
        blobs,
        checkout: checkout(references, commits),
        commit: commit(commitAuthor, references, trees, commits),
        commitAuthor,
        commits,
        push: push(references),
        references,
        repository,
        trees,
        store,
    };
};
