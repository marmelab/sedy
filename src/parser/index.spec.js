import { assert } from 'chai';
import parseFactory from './';

describe('Parser', () => {
    const config = {};
    const logger = console;
    logger.debug = console.log;

    it('should throw exception if no argument', function* () {
        try {
            yield parseFactory(config, logger)();
        } catch (err) {
            assert.instanceOf(err, TypeError);
        }
    });

    it('should return an empty array for bad headers or `ping` event', function* () {
        const shouldReturnEmptyArray = function* (value) {
            const result = yield parseFactory(config, logger)(value);
            assert.deepEqual(result, []);
        };

        shouldReturnEmptyArray({ headers: null });
        shouldReturnEmptyArray({ headers: [] });
        shouldReturnEmptyArray({ headers: 'bad header' });
        shouldReturnEmptyArray({ headers: { 'bad': 'header' } });
        shouldReturnEmptyArray({ headers: { 'X-GitHub-Event': 'bad event' } });
        shouldReturnEmptyArray({ headers: { 'X-GitHub-Event': 'ping' } });
    });
});
