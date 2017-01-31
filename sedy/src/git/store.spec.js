import { assert } from 'chai';
import storeFactory from './store';

describe('Git store', () => {
    const storedObject = { sha: 'objectSha' };

    it('should have a working `get` accessor', () => {
        const store = storeFactory({ objectSha: storedObject });

        assert.deepEqual(store.get(storedObject.sha), storedObject);
    });

    it('should have a working `update` accessor', () => {
        const store = storeFactory();
        store.update(storedObject);

        assert.deepEqual(store.get(storedObject.sha), storedObject);
    });

    it('should be able to return a copy of itself', () => {
        const store = storeFactory({ objectSha: storedObject });

        assert.deepEqual(store.copy(), { objectSha: storedObject });
    });
});
