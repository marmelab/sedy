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

    return {
        get,
        validate,
    };
};
