
import I from 'immutable';
import reducers from './reducers';
import { browserHistory } from 'react-router';
import { routerMiddleware } from 'react-router-redux';
import { createStore, compose, applyMiddleware } from 'redux';

import asyncAction from './middleware/async-action';

export default function create(initState = I.Map()) {
    const middlware = [asyncAction, routerMiddleware(browserHistory)];

    if (process.env.NODE_ENV === 'development') {

        let { persistState } = require('redux-devtools');

        const enhancer = compose(
            applyMiddleware(...middlware),
            window.devToolsExtension ? window.devToolsExtension() : f => f,
            persistState(
                window.location.href.match(
                    /[?&]debug_session=([^&#]+)\b/
                )
            )
        );

        let store = createStore(reducers, initState, enhancer);
        if (module.hot) {
            module.hot.accept('./reducers', () =>
                store.replaceReducer(require('./reducers'))
            );
        }

        return store;
    }

    return createStore(reducers, initState, applyMiddleware(...middlware));
}
