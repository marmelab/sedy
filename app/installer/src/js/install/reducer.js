import { actionTypes } from './actions';

const initialState = {
    loading: false,
};

export default (state = initialState, { type, payload }) => {
    switch (type) {
    case actionTypes.getRepositories.REQUEST:
        return {
            ...state,
            error: false,
            loading: true,
        };

    case actionTypes.getRepositories.SUCCESS:
        return {
            ...state,
            ...payload,
            error: false,
            loading: false,
        };

    case actionTypes.getRepositories.FAILURE:
        return {
            error: payload,
            loading: false,
        };

    case actionTypes.installSedy.REQUEST:
        return {
            ...state,
            error: false,
            loading: true,
        };

    case actionTypes.installSedy.SUCCESS:
        return {
            ...state,
            repositories: state.repositories.map(repository => {
                if (repository.id === payload.updatedRepository.id) {
                    return payload.updatedRepository;
                }

                return repository;
            }),
            error: false,
            loading: false,
        };

    case actionTypes.installSedy.FAILURE:
        return {
            error: payload,
            loading: false,
        };

    default:
        return state;
    }
};
