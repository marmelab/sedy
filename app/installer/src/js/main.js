import 'babel-core/register';
import 'babel-polyfill';
import 'expose?$!expose?jQuery!jquery';
import 'expose?$!expose?Tether!tether';

import 'bootstrap';
import FastClick from 'fastclick';
import React from 'react';
import { render } from 'react-dom';

import Root from './app/Root';
import rootReducer from './app/reducers';
import configureStore from './app/configureStore';

const store = configureStore(rootReducer);

FastClick.attach(document.body);

render(
    <Root {...{ store }} />,
    document.getElementById('root')
);
