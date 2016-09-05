import React, { PropTypes } from 'react';
import { Provider } from 'react-redux';
import { Router, hashHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';

import routesFactory from './routes';

const Root = ({ store }) => {
    const history = syncHistoryWithStore(hashHistory, store);
    const routes = routesFactory(store);

    return (
        <Provider {...{ store }}>
            <Router {...{ history, routes }} />
        </Provider>
    );
};

Root.propTypes = {
    store: PropTypes.object.isRequired,
};

export default Root;
