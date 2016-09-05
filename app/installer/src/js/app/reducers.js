import { routerReducer } from 'react-router-redux';
import { combineReducers } from 'redux';
import { reducer as form } from 'redux-form';

import userReducer from '../user/reducer';
import installReducer from '../install/reducer';

const rootReducer = combineReducers({
    form,
    routing: routerReducer,
    user: userReducer,
    install: installReducer,
});

export default rootReducer;
