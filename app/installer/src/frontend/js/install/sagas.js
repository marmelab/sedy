import { takeLatest } from 'redux-saga';
import { put, call } from 'redux-saga/effects';

import {
    actionTypes,
    getRepositories as getRepositoriesActions,
    installSedy as installSedyActions,
} from './actions';
import { retrieveUserRepositories, installRepositoryHook } from './api';

export const getRepositories = () => function* getRepositoriesSaga({ payload: user }) {
    const { error, repositories } = yield call(retrieveUserRepositories(user));

    if (error) {
        return yield put(getRepositoriesActions.failure(error));
    }

    return yield put(getRepositoriesActions.success({ repositories }));
};

export const installSedy = () => function* installSedySaga({ payload: { user, repository } }) {
    const {
        error,
        repository: updatedRepository,
    } = yield call(installRepositoryHook(user, repository));

    if (error) {
        return yield put(installSedyActions.failure(error));
    }

    return yield put(installSedyActions.success({ updatedRepository }));
};

const sagas = function* sagas() {
    yield [
        takeLatest(actionTypes.getRepositories.REQUEST, getRepositories()),
        takeLatest(actionTypes.installSedy.REQUEST, installSedy()),
    ];
};

export default sagas;
