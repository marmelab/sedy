import { ValidationError } from '../errors';
import { validate as validateObject } from '../validation';

export default (client, repo, store) => {
    const validate = blob => {
        validateObject(blob);

        if (blob.type !== 'blob') {
            throw new ValidationError(`Object "${blob.sha}" has no 'blob' type.`);
        }

        return true;
    };

    const standardize = blob => {
        validateObject(blob);

        return Object.assign({}, blob, {
            type: 'blob',
        });
    };

    const get = function* (sha) {
        const storedBlob = store.get(sha);

        if (storedBlob && validate(storedBlob)) {
            return storedBlob;
        }

        const blob = yield client.getBlobFromId({
            repoUser: repo.owner,
            repoName: repo.name,
            id: sha,
        });

        const standardizedBlob = standardize(blob);

        store.update(standardizedBlob);
        return standardizedBlob;
    };

    return {
        get,
        validate,
    };
};
