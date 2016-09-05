import { takeLatest } from 'redux-saga';
import { put, call } from 'redux-saga/effects';
import { routerActions } from 'react-router-redux';

import { actionTypes, signIn as signInActions } from './actions';
import { signInWithGithub, retrieveUserGithubInfos } from './api';

export const signIn = () => function* signInSaga({ payload }) {
    const { error: tokenError, accessToken } = yield call(signInWithGithub);

    if (tokenError) {
        return yield put(signInActions.failure(tokenError));
    }

    const { error, user } = yield call(retrieveUserGithubInfos(accessToken));

    if (error) {
        return yield put(signInActions.failure(error));
    }

    yield put(signInActions.success({ ...user, token: accessToken }));
    return yield put(routerActions.push(payload));
};

const sagas = function* sagas() {
    yield takeLatest(actionTypes.signIn.REQUEST, signIn());
};

export default sagas;
