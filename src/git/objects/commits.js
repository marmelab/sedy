import { ValidationError } from '../errors';
import { validate as validateObject } from '../validation';

export default (client, repo, store) => {
    const validate = commit => {
        validateObject(commit);

        if (commit.type !== 'commit') {
            throw new ValidationError(`Object "${commit.sha}" has no 'commit' type.`);
        }

        return true;
    };

    const standardize = commit => {
        validateObject(commit);

        return Object.assign({}, commit, {
            type: 'commit',
        });
    };

    const get = function* (sha) {
        const storedCommit = store.get(sha);

        if (storedCommit && validate(storedCommit)) {
            return storedCommit;
        }

        const commit = yield client.getCommitFromId({
            repoUser: repo.owner,
            repoName: repo.name,
            commitId: sha,
        });

        const standardizedCommit = standardize(commit);

        store.update(standardizedCommit);
        return standardizedCommit;
    };

    const create = function* (tree, message, author, parents) {
        const commit = yield client.createCommit({
            repoUser: repo.owner,
            repoName: repo.name,
            commitMessage: message,
            commitAuthor: Object.assign({}, author, {
                // @TODO: Set new Date() with the good format
                date: '2016-07-24T00:49:30+02:00',
            }),
            commitTree: tree.sha,
            commitParents: parents,
        });

        const standardizedCommit = standardize(commit);

        store.update(standardizedCommit);
        return standardizedCommit;
    };

    return {
        get,
        create,
        validate,
    };
};
