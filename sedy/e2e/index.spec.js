import config from 'config';
import { expect } from 'chai';
import request from './request';

before(() => {
    global.config = config;
});

describe('Main', () => {
    it('should answer', function* () {
        const { body, statusCode } = yield request({
            body: { foo: 'bar' },
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
