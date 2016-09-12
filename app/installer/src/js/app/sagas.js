import { fork } from 'redux-saga/effects';
import userSagas from '../user/sagas';
import installSagas from '../install/sagas';

export default function* (getState) {
    yield fork(userSagas, getState);
    yield fork(installSagas, getState);
}
