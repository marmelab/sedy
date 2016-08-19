import { ValidationError } from '../errors';
import { validate as validateObject } from '../validation';

const SEP = '/';
const LOCATIONS = ['heads', 'remotes', 'tags'];

export default (client, repo) => {
    const refs = {
        head: null,
        [repo.defaultReference]: null,
    };

    const validate = reference => {
        if (reference === 'head' || reference === null) {
            return true;
        }

        if (typeof reference !== 'string') {
            throw new ValidationError(`Reference "${reference}" is invalid`);
        }

        const [ prefix, location ] = reference.split(SEP, 2);
        const branch = reference.replace(`${prefix}${SEP}${location}`, '');

        if (prefix !== 'refs') {
            throw new ValidationError(`Reference "${reference}" should starts with 'refs'`);
        }

        if (LOCATIONS.indexOf(location) === -1) {
            throw new ValidationError(`Reference "${reference}" should starts with: ${LOCATIONS.map(l => 'refs/' + l).join(', ')}`);
        }

        if (!branch || branch === SEP) {
            throw new ValidationError(`Reference "${reference}" is incomplete`);
        }

        return true;
    };

    const standardize = reference => ({
        ref: reference.ref,
        sha: reference.object.sha,
    });

    const get = function* (ref) {
        validate(ref);

        const storedReference = refs[ref];

        if (storedReference || storedReference === null) {
            return storedReference;
        }

        const reference = yield client.getReferenceFromId({
            repoUser: repo.owner,
            repoName: repo.name,
            reference: ref,
        });

        const standardizedReference = standardize(reference);

        refs[standardizedReference.ref] = standardizedReference.sha;
        return standardizedReference.sha;
    };

    const update = function* (ref, obj) {
        validate(ref);
        validateObject(obj);

        refs[ref] = obj.sha;
    };

    const push = function* (ref, force = false) {
        const commitSha = yield get('head');

        const reference = yield client.updateReference({
            repoUser: repo.owner,
            repoName: repo.name,
            sha: commitSha,
            reference: ref,
            force,
        });

        const standardizedReference = standardize(reference);

        refs[standardizedReference.ref] = standardizedReference.sha;
        return standardizedReference.sha;
    };

    return {
        get,
        update,
        validate,
        push,
    };
};
