import { ValidationError } from './errors';

const SHA_LENGTH = 40;

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

export { validate };
