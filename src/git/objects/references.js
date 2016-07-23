import { ValidationError } from '../errors';

const SEP = '/';
const LOCATIONS = ['heads', 'remotes', 'tags'];

export default (client, repo) => {
    const refs = {
        head: 'HEAD',
        [repo.defaultReference]: null,
    };

    const validate = reference => {
        if (!reference || typeof reference !== 'string') {
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

    const get = function* (reference) {
        const storedReference = refs[reference];

        if (storedReference && validate(storedReference)) {
            return storedReference;
        }

        // @TODO: Retrieve reference from client
        return null;
    };

    return {
        get,
        validate,
    };
};
