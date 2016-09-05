import { createAction } from 'redux-actions';
import createRequestActionTypes from '../app/entities/createRequestActionTypes';

export const actionTypes = {
    getRepositories: createRequestActionTypes('GET_REPOSITORIES'),
    installSedy: createRequestActionTypes('INSTALL_SEDY'),
};

export const getRepositories = {
    request: createAction(actionTypes.getRepositories.REQUEST),
    success: createAction(actionTypes.getRepositories.SUCCESS),
    failure: createAction(actionTypes.getRepositories.FAILURE),
};

export const installSedy = {
    request: createAction(actionTypes.installSedy.REQUEST),
    success: createAction(actionTypes.installSedy.SUCCESS),
    failure: createAction(actionTypes.installSedy.FAILURE),
};
