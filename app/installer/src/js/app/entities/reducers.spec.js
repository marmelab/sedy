import { expect } from 'chai';
import {
    createListReducer,
    initialStateForList,
    createItemReducer,
    initialStateForItem,
    createEntityReducer,
    initialStateForEntity,
} from './reducers';

const actionTypes = {
    item: {
        REQUEST: 'item/REQUEST',
        SUCCESS: 'item/SUCCESS',
        FAILURE: 'item/FAILURE',
    },
    list: {
        REQUEST: 'list/REQUEST',
        SUCCESS: 'list/SUCCESS',
        FAILURE: 'list/FAILURE',
    },
};

function testListReducer(reducer, initialState) {
    it('should return a list initial state', () => {
        const state = reducer(undefined, { type: 'foo' });

        expect(state).to.deep.equal(initialState);
    });

    it('should handle REQUEST actions', () => {
        const state = reducer(undefined, { type: actionTypes.list.REQUEST });

        expect(state).to.deep.equal(Object.assign({}, initialState, {
            loading: true,
        }));
    });

    it('should handle SUCCESS actions', () => {
        const state = reducer(undefined, {
            type: actionTypes.list.SUCCESS,
            payload: [{ foo: 'bar' }],
        });

        expect(state).to.deep.equal(Object.assign({}, initialState, {
            list: [{ foo: 'bar' }],
        }));
    });

    it('should handle FAILURE actions', () => {
        const state = reducer(undefined, {
            type: actionTypes.list.FAILURE,
            payload: 'foo',
        });

        expect(state).to.deep.equal(Object.assign({}, initialState, {
            error: 'foo',
        }));
    });
}

function testItemReducer(reducer, initialState) {
    it('should return an item initial state', () => {
        const state = reducer(undefined, { type: 'foo' });

        expect(state).to.deep.equal(initialState);
    });

    it('should handle REQUEST actions', () => {
        const state = reducer(undefined, { type: actionTypes.item.REQUEST });

        expect(state).to.deep.equal(Object.assign({}, initialState, {
            loading: true,
        }));
    });

    it('should handle SUCCESS actions', () => {
        const state = reducer(undefined, {
            type: actionTypes.item.SUCCESS,
            payload: { foo: 'bar' },
        });

        expect(state).to.deep.equal(Object.assign({}, initialState, {
            item: { foo: 'bar' },
        }));
    });

    it('should handle FAILURE actions', () => {
        const state = reducer(undefined, {
            type: actionTypes.item.FAILURE,
            payload: 'foo',
        });

        expect(state).to.deep.equal(Object.assign({}, initialState, {
            error: 'foo',
        }));
    });
}

describe('createListReducer', () => {
    const reducer = createListReducer(actionTypes.list);

    it('should return a reducer', () => {
        expect(reducer).to.be.a('function');
    });

    testListReducer(reducer, initialStateForList);
});

describe('createItemReducer', () => {
    const reducer = createItemReducer(actionTypes.item);

    it('should return a reducer', () => {
        expect(reducer).to.be.a('function');
    });

    testItemReducer(reducer, initialStateForItem);
});

describe('createEntityReducer', () => {
    const reducer = createEntityReducer(actionTypes);

    it('should return a reducer', () => {
        expect(reducer).to.be.a('function');
    });

    testListReducer(reducer, initialStateForEntity);
    testItemReducer(reducer, initialStateForEntity);
});
