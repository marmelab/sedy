import { assert } from 'chai';
import { validate } from './validation';

describe('Git validation', () => {
    it('should check if an object is not an object', () => {
        assert.throws(() => validate(null), /is invalid/);
        assert.throws(() => validate(undefined), /is invalid/);
        assert.throws(() => validate(1), /is invalid/);
        assert.throws(() => validate('string'), /is invalid/);
        assert.throws(() => validate(), /is invalid/);
    });

    it('should check if an object has a sha', () => {
        assert.throws(() => validate({}), /has no SHA/);
    });

    it('should check if an object has a valid sha length', () => {
        assert.throws(() => validate({ sha: 'short sha' }), /invalid SHA length/);

        const sha = 'very very very very very very loooong sha';
        assert.throws(() => validate({ sha }), /invalid SHA length/);
    });

    it('should return true if the object is valid', () => {
        const validObject = {
            sha: 'd670460b4b4aece5915caf5c68d12f560a9fe3e4',
        };

        assert.equal(validate(validObject), true);
    });
});
