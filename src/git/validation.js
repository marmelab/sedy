import { ValidationError } from './errors';

const SHA_LENGTH = 40;
const SEP = '/';

const validate = obj => {
    if (!obj || typeof obj !== 'object') {
        throw new ValidationError(`Object "${obj}" is invalid`);
    }

    if (!obj.sha) {
        throw new ValidationError(`Object "${obj}" has no SHA`);
    }

    if (obj.sha.length !== SHA_LENGTH) {
        throw new ValidationError(`Object "${obj.sha}" has an invalid SHA length`);
    }

    return true;
};

const validatePath = path => {
    if (!path || typeof path !== 'string') {
        throw new ValidationError(`Path "${path}" is invalid`);
    }

    if (!path.startsWith(SEP)) {
        throw new ValidationError(`Path "${path}" should starts with a ${SEP}`);
    }

    if (path.endsWith(SEP)) {
        throw new ValidationError(`Path "${path}" can not ends with a ${SEP}`);
    }

    return true;
};

export {
    validate,
    validatePath,
};
