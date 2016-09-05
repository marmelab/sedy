export const initialStateForList = {
    error: null,
    list: [],
    loading: false,
};

export const createListReducer = actionTypes =>
    (state = initialStateForList, { type, payload }) => {
        switch (type) {
        case actionTypes.REQUEST:
            return {
                ...state,
                loading: true,
            };

        case actionTypes.SUCCESS:
            return {
                ...state,
                list: payload,
                error: null,
                loading: false,
            };

        case actionTypes.FAILURE:
            return {
                ...state,
                list: [],
                error: payload,
                loading: false,
            };

        default:
            return state;
        }
    };

export const initialStateForItem = {
    error: null,
    item: null,
    loading: false,
};

export const createItemReducer = actionTypes =>
    (state = initialStateForItem, { type, payload }) => {
        switch (type) {
        case actionTypes.REQUEST:
            return {
                ...state,
                loading: true,
            };

        case actionTypes.SUCCESS:
            return {
                ...state,
                item: payload,
                error: null,
                loading: false,
            };

        case actionTypes.FAILURE:
            return {
                ...state,
                item: null,
                error: payload,
                loading: false,
            };

        default:
            return state;
        }
    };

export const initialStateForEntity = { ...initialStateForList, ...initialStateForItem };

export const createEntityReducer = actionTypes => {
    const listReducer = createListReducer(actionTypes.list);
    const itemReducer = createItemReducer(actionTypes.item);

    return (state = initialStateForEntity, action) => {
        let result = listReducer(state, action);
        result = itemReducer(result, action);

        return result;
    };
};
