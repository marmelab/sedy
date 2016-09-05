import { actionTypes } from './actions';

const initialState = {
    authenticated: false,
    loading: false,
};

export default (state = initialState, { type, payload }) => {
    switch (type) {
    case actionTypes.signIn.REQUEST:
        return {
            ...state,
            authenticated: false,
            error: false,
            loading: true,
        };

    case actionTypes.signIn.SUCCESS:
        return {
            ...state,
            ...payload,
            authenticated: true,
            error: false,
            loading: false,
        };

    case actionTypes.signIn.FAILURE:
        return {
            authenticated: false,
            error: payload,
            loading: false,
        };

    default:
        return state;
    }
};
