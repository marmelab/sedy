import { assert } from 'chai';
import parseFactory from './';

describe('Parser', () => {
    const config = {};
    const logger = console;
    logger.debug = console.log;

    it('should throw exception if no argument', () => {
        assert.throws(parseFactory(config, logger), TypeError);
    });

    it('should return an empty array for bad headers or `ping` event', () => {
        const shouldReturnEmptyArray = value => {
            assert.deepEqual(parseFactory(config, logger)(value), []);
        };

        shouldReturnEmptyArray({ headers: null });
        shouldReturnEmptyArray({ headers: [] });
        shouldReturnEmptyArray({ headers: 'bad header' });
        shouldReturnEmptyArray({ headers: { 'bad': 'header' } });
        shouldReturnEmptyArray({ headers: { 'X-GitHub-Event': 'bad event' } });
        shouldReturnEmptyArray({ headers: { 'X-GitHub-Event': 'ping' } });
    });
});
