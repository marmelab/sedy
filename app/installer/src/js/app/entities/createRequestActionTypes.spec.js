import { expect } from 'chai';
import createRequestActionTypes from './createRequestActionTypes';

describe('createRequestActionTypes', () => {
    it('should return an object with REQUEST, SUCCESS and FAILURE properties', () => {
        const actionTypes = createRequestActionTypes('foo');

        expect(actionTypes).to.deep.equal({
            REQUEST: 'foo_REQUEST',
            SUCCESS: 'foo_SUCCESS',
            FAILURE: 'foo_FAILURE',
        });
    });
});
