// 设置页 通过个人id 获取和修改个人信息
import I from 'immutable';
import { createReducer } from 'redux/creator';
import Cookies from 'cookies-js';
// import _ from 'lodash';

import {
    FETCH_SETTING_USER_DATA,
    FETCH_SETTING_USER_DATA_SUCCESS,
    FETCH_SETTING_USER_DATA_FAIL,
    UPDATE_SETTING_USER_DATA,
    UPDATE_SETTING_USER_DATA_SUCCESS,
    UPDATE_SETTING_USER_DATA_FAIL
} from 'redux/action-types';

import { fetchOneRequest, updateDataRequest } from 'requests/common/standard-object';

// 如何把 cookie 中的东西放入 redux
// 1.在 redux 中创建一个 reducer
// reducer 初始化的时候第一个参数就是默认的 默认的 state

let defaultState = I.fromJS({
    // 从cookie去取当前user和tenant的id
    userId: Cookies.get('_userId'),
    tenantId: Cookies.get('_tenant_id'),
    user: {}
});

export default createReducer(defaultState, {
    [FETCH_SETTING_USER_DATA_SUCCESS](state, action) {
        let { body } = action.result;
        return state.set('user', I.fromJS(body));
    },
    [UPDATE_SETTING_USER_DATA_SUCCESS](state, action) {
        let { body } = action.result;
        return state.update('user', data => data.mergeDeep(I.fromJS(body)));
    }
});

// 获取
export function fetchUserData(id) {
    return {
        id,
        types: [FETCH_SETTING_USER_DATA, FETCH_SETTING_USER_DATA_SUCCESS, FETCH_SETTING_USER_DATA_FAIL],
        promise: fetchOneRequest('User', id)
    };
}

// 修改
export function updateUserData(id, param) {
    return {
        id,
        param,
        types: [UPDATE_SETTING_USER_DATA, UPDATE_SETTING_USER_DATA_SUCCESS, UPDATE_SETTING_USER_DATA_FAIL],
        promise: updateDataRequest('User', id, param)
    };
}
