import { expect } from 'chai';
import { takeEvery } from 'redux-saga';
import { call, put, select } from 'redux-saga/effects';
import sinon from 'sinon';
import {
    entityListFactory,
    entityItemFactory,
    loadListFactory,
    loadItemFactory,
} from './sagas';


describe('entities sagas', () => {
    const jwtSelector = () => 'token';

    const actions = {
        list: {
            failure: sinon.stub().returnsArg(0),
            success: sinon.stub().returnsArg(0),
        },
        item: {
            failure: sinon.stub().returnsArg(0),
            success: sinon.stub().returnsArg(0),
        },
    };

    describe('loadListFactory', () => {
        it('should select using the specified selector', () => {
            const fetchList = sinon.stub().returns(Promise.resolve({ list: [{ id: 42 }] }));
            const saga = loadListFactory(actions.list, fetchList, jwtSelector)();

            expect(saga.next().value).to.deep.equal(select(jwtSelector));
        });

        it('should call the fetchList function', () => {
            const fetchList = sinon.stub().returns(Promise.resolve({ list: [{ id: 42 }] }));
            const saga = loadListFactory(actions.list, fetchList, jwtSelector)();
            saga.next();

            expect(saga.next().value).to.deep.equal(call(fetchList, undefined));
        });

        it('should put the actions.list.success action with orders on successfull fetch', () => { // eslint-disable-line max-len
            const fetchList = sinon.stub().returns(Promise.resolve({ list: [{ id: 42 }] }));
            const saga = loadListFactory(actions.list, fetchList, jwtSelector)();

            saga.next();
            saga.next();

            expect(saga.next({
                list: [{ id: 42 }],
            }).value).to.deep.equal(put(actions.list.success([{ id: 42 }])));
        });

        it('should put the actions.list.failure action with error on failed fetch', () => {
            const error = new Error('Run you fools');
            const fetchList = sinon.stub().returns(Promise.resolve({ error }));
            const saga = loadListFactory(actions.list, fetchList, jwtSelector)();

            saga.next();
            saga.next();

            expect(saga.next({
                error,
            }).value).to.deep.equal(put(actions.list.failure(error)));
        });
    });

    describe('entityListFactory', () => {
        it('should take every REQUEST action types', () => {
            const saga = entityListFactory({
                REQUEST: 'test/REQUEST',
            })();
            const fetchList = sinon.stub().returns(Promise.resolve({ list: [{ id: 42 }] }));
            const loadListFactorySaga = loadListFactory(actions.list, fetchList, jwtSelector);

            expect(saga.next()).to.deep.equal(takeEvery('test/REQUEST', loadListFactorySaga).next()); // eslint-disable-line max-len
        });
    });

    describe('loadItemFactory', () => {
        it('should select using the specified selector', () => {
            const fetchItem = sinon.stub().returns(Promise.resolve({ item: { id: 42 } }));
            const saga = loadListFactory(actions.list, fetchItem, jwtSelector)();

            expect(saga.next().value).to.deep.equal(select(jwtSelector));
        });

        it('should call the fetchItem function', () => {
            const fetchItem = sinon.stub().returns(Promise.resolve({ item: { id: 42 } }));
            const saga = loadItemFactory(actions.item, fetchItem, jwtSelector)({ payload: 42 });

            saga.next();

            expect(saga.next().value).to.deep.equal(call(fetchItem, 42, undefined));
        });

        it('should put the actions.item.success action with orders on successfull fetch', () => { // eslint-disable-line max-len
            const fetchItem = sinon.stub().returns(Promise.resolve({ item: { id: 42 } }));
            const saga = loadItemFactory(actions.item, fetchItem, jwtSelector)({ payload: 42 });

            saga.next();
            saga.next();

            expect(saga.next({
                item: { id: 42 },
            }).value).to.deep.equal(put(actions.item.success({ id: 42 })));
        });

        it('should put the actions.item.failure action with error on failed fetch', () => {
            const error = new Error('Run you fools');
            const fetchItem = sinon.stub().returns(Promise.resolve({ error }));
            const saga = loadItemFactory(actions.item, fetchItem, jwtSelector)({ payload: 42 });

            saga.next();
            saga.next();

            expect(saga.next({
                error,
            }).value).to.deep.equal(put(actions.item.failure(error)));
        });
    });

    describe('entityItemFactory', () => {
        it('should take every REQUEST action types', () => {
            const saga = entityItemFactory({
                REQUEST: 'test/REQUEST',
            })();
            const fetchItem = sinon.stub().returns(Promise.resolve({ item: { id: 42 } }));
            const loadItemFactorySaga = loadItemFactory(actions.item, fetchItem, jwtSelector);

            expect(saga.next()).to.deep.equal(takeEvery('test/REQUEST', loadItemFactorySaga).next()); // eslint-disable-line max-len
        });
    });
});
