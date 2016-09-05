import { hashHistory } from 'react-router';
import { routerMiddleware } from 'react-router-redux';
import { applyMiddleware, compose, createStore } from 'redux';
import createSagaMiddleware from 'redux-saga';
import thunkMiddleware from 'redux-thunk';
import sagas from './sagas';

const sagaMiddleware = createSagaMiddleware();

export default function configureStore(rootReducer, initialState) {
    const enhancers = [
        applyMiddleware(
            sagaMiddleware,
            routerMiddleware(hashHistory),
            thunkMiddleware,
        ),
    ];

    const store = createStore(rootReducer, initialState, compose(...enhancers));
    sagaMiddleware.run(sagas);
    return store;
}
