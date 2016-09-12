import { takeEvery } from 'redux-saga';
import { call, fork, put, select } from 'redux-saga/effects';

export const loadListFactory = (actions, fetchList, jwtSelector = () => null) =>
    function* loadList() {
        const jwt = yield select(jwtSelector);
        const { error, list } = yield call(fetchList, jwt);

        if (error) {
            console.error({ error }); // eslint-disable-line no-console
            yield put(actions.failure(error));
        } else {
            yield put(actions.success(list));
        }
    };

export const loadItemFactory = (actions, fetchItem, jwtSelector = () => null) =>
    function* loadItem({ payload }) {
        const jwt = yield select(jwtSelector);
        const { error, item } = yield call(fetchItem, payload, jwt);

        if (error) {
            console.error({ error }); // eslint-disable-line no-console
            yield put(actions.failure(error));
        } else {
            yield put(actions.success(item));
        }
    };

export const entityListFactory = (actionTypes, actions, fetchList, jwtSelector) =>
    function* sagas() {
        yield* takeEvery(
            actionTypes.REQUEST,
            loadListFactory(actions, fetchList, jwtSelector)
        );
    };

export const entityItemFactory = (actionTypes, actions, fetchItem, jwtSelector) =>
    function* sagas() {
        yield* takeEvery(
            actionTypes.REQUEST,
            loadItemFactory(actions, fetchItem, jwtSelector)
        );
    };

export const entityFactory = (actionTypes, actions, fetchList, fetchItem, jwtSelector) =>
    function* sagas() {
        yield fork(entityListFactory(actionTypes.list, actions.list, fetchList, jwtSelector));
        yield fork(entityItemFactory(actionTypes.item, actions.item, fetchItem, jwtSelector));
    };
