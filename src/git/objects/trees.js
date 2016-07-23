import { ValidationError } from '../errors';
import { validate as validateObject } from '../validation';

export default (client, repo, store) => {
    const validate = tree => {
        validateObject(tree);

        if (tree.type !== 'tree') {
            throw new ValidationError(`Object "${tree.sha}" has no 'tree' type.`);
        }

        return true;
    };

    const standardize = tree => {
        validateObject(tree);

        return Object.assign({}, tree, {
            type: 'tree',
        });
    };

    const get = function* (sha) {
        const storedTree = store.get(sha);

        if (storedTree && validate(storedTree)) {
            return storedTree;
        }

        const tree = yield client.getTreeFromId({
            repoUser: repo.owner,
            repoName: repo.name,
            id: sha,
        });

        const standardizedTree = standardize(tree);

        store.update(standardizedTree);
        return standardizedTree;
    };

    return {
        get,
        validate,
    };
};
