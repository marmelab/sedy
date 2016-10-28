import { expect } from 'chai';
import request from './request';
import config from 'config';

before(() => {
    global.config = config;
});

describe('Main', () => {
    it('should answer', function* () {
        const { body, statusCode } = yield request({
            body: JSON.stringify({ foo: 'bar' }),
            method: 'POST',
            uri: '/',
        });

        expect(body).to.deep.equal({
            success: false,
            reason: 'No fix found',
        });
        expect(statusCode).to.equal(200);
    });
});
