import { assert } from 'chai';
import getSedyCommandsFromComment from './getSedyCommandsFromComment';

describe('getSedyCommandsFromComment', () => {
    it('should not match if not pattern in comment', () => {
        const result = getSedyCommandsFromComment('comment body');
        assert.deepEqual(result, []);
    });

    it('should match if one pattern in comment', () => {
        const result = getSedyCommandsFromComment('s/That/This/');

        assert.deepEqual(result, [
            { from: 'That', to: 'This' },
        ]);
    });

    it('should match the deletion pattern', () => {
        const result = getSedyCommandsFromComment('s/To Remove//');

        assert.deepEqual(result, [
            { from: 'To Remove', to: '' },
        ]);
    });

    it('should match if more than one patterns in comment', () => {
        const result = getSedyCommandsFromComment('s/That/This/ \ns/To Remove//');

        assert.deepEqual(result, [
            { from: 'That', to: 'This' },
            { from: 'To Remove', to: '' },
        ]);
    });

    it('should match if sed `from` value is not ascii', () => {
        const result = getSedyCommandsFromComment('s/Thαt/This/');

        assert.deepEqual(result, []);
    });

    it('should match if sed `to` value is not ascii', () => {
        const result = getSedyCommandsFromComment('s/That/Thιs/');
        assert.deepEqual(result, []);
    });

    it("should not match if it isn't a created comment", () => {
        assert.deepEqual(getSedyCommandsFromComment('deleted'), []);

        assert.deepEqual(getSedyCommandsFromComment('edited'), []);
    });

    it('should not match if the pattern is an image url', () => {
        const result = getSedyCommandsFromComment('https://perdu.com/os/images/lost/image.jpg');
        assert.deepEqual(result, []);
    });

    it('should match sed together with image url', () => {
        const result = getSedyCommandsFromComment(' s/remove// https://perdu.com/os/images/lost/image.jpg s/replace/me/');

        assert.deepEqual(result, [
            { from: 'remove', to: '' },
            { from: 'replace', to: 'me' },
        ]);
    });

    it('shoud match the question mark and not broke', () => {
        const result = getSedyCommandsFromComment('s/ ?/?/');

        assert.deepEqual(result, [
            { from: ' ?', to: '?' },
        ]);
    });
});
