import I from 'immutable';
import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {syncHistoryWithStore} from 'react-router-redux';
import globalContainer from 'utils/redux-container';
import {Router, browserHistory} from 'react-router';
import Cookies from 'cookies-js';

import moment from 'moment';
moment.locale('zh-cn');

import initStore from './redux/init';

import { fetchOrgNavConfig } from './redux/reducers/standard-object/layout';
import { fetchAllObj } from 'redux/reducers/standard-object/all-obj';

(async () => {
    const routes = require('./route');

    let createElement = (Component, props) => {
        return <Component {...props} />;
    };

    const store = initStore(I.fromJS({}));
    window.store = store;
    window.globalContainer = globalContainer;
    globalContainer.setRedux(store);
    await Promise.all([
        store.dispatch(fetchOrgNavConfig()),
        store.dispatch(fetchAllObj())
    ]).then(() => {}, (err) => {
        let { error } = err;
        // 这里是为了兼容后端的code,报错
        // bugs: https://ph.meiqia.com/T5262
        // 这里可以与request层的东西,整理一下.放在一起
        if (error.code === 119101 || error.code === 102) {
            let expires = new Date();
            expires.setTime(expires.getTime() - 1); // 过期
            Cookies.set('_accountToken', '', {expires: expires});
            Cookies.set('_accessToken', '', {expires: expires});
            Cookies.set('_refreshToken', '', {expires: expires});
            console.log('请求失败,即将退出到登陆页', err);
            window.location.href = '/signin';
        }
    });
    let lastRoute = null;
    let lastRouteJS = null;

    // http://stackoverflow.com/questions/33376414/adding-a-base-url-to-an-app-using-redux-router-react-router
    // https://hashnode.com/post/how-to-use-react-router-redux-with-immutablejs-ciserp17q0wm1zz53g5ytdohh

    const history = syncHistoryWithStore(browserHistory, store, {
        selectLocationState: (state) => {
            // cache router
            if (state.get('router') !== lastRoute) {
                lastRoute = state.get('router');
                lastRouteJS = lastRoute.toJS();
                return lastRouteJS;
            }

            return lastRouteJS;
        }
    });

    ReactDOM.render(
        <Provider store={store}>
            <Router
                createElement={createElement}
                history={history}
                routes={routes}
                onUpdate={() => {
                }} />
        </Provider>,
        document.getElementById('App'));
})();
