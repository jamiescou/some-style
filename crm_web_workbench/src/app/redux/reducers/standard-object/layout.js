/**
 * Created by listen1013 on 17/3/24.
 */

import _ from 'lodash';
import I from 'immutable';
import { createReducer } from 'redux/creator';

import {
    FETCH_LAYOUT,
    FETCH_LAYOUT_SUCCESS,
    FETCH_LAYOUT_FAIL,
    FETCH_HEADER_NAV,
    FETCH_HEADER_NAV_SUCCESS,
    FETCH_HEADER_NAV_FAIL,
    FETCH_OBJ_EXTENDS_CONFIG,
    FETCH_OBJ_EXTENDS_CONFIG_SUCCESS,
    FETCH_OBJ_EXTENDS_CONFIG_FAIL
} from 'redux/action-types';

import { fetchLayoutRequest, fetchOrgNavConfig as fetchHeader, fetchObjGlobalConfig } from 'requests/common/layout';

// layout 数据只存在这三种,每次进入一个需要 layout 的页面都需要一个初始化的过程,初始化的时候就要先来获取这些值,等数据返回后再渲染
let defaultState = I.fromJS({
    home: {},
    list: {},
    detail: {},
    objConfig: {}
});
const isAvailable = param => {
    let isUnavailable =  _.isNull(param) || _.isUndefined(param);
    return !isUnavailable;
};

export default createReducer(I.fromJS(defaultState), {
    [FETCH_LAYOUT_SUCCESS](state, action) {
        let { objName, page, result } = action;

        let finalState = state;

        if (!isAvailable(objName) || !page) {
            return state;
        }

        finalState = state.setIn([page, objName], I.fromJS(result.body));

        return finalState;
    },
    [FETCH_HEADER_NAV_SUCCESS](state, action) {
        let { result } = action;
        let { body } = result;
        return state.set('header', I.fromJS(body));
    },
    [FETCH_OBJ_EXTENDS_CONFIG_SUCCESS](state, action) {
        let { result, objName } = action;
        let { body } = result;
        return state.setIn(['objConfig', objName], I.fromJS(body));
    }
});

export const fetchLayout = (objName, page, force = false) => (dispatch, getState) => {
    let layoutList = getState().getIn(['standardObject', 'layout', page]);
    let hasNeedLayout = false;

    if (layoutList && layoutList.get(objName)) {
        hasNeedLayout = true;
    }
    // 当Meta对象中不存在 或者 强制刷新才发送数据
    if (!hasNeedLayout || force) {
        return dispatch(_fetchLayout(objName, page));
    }
};
export function fetchOrgNavConfig() {
    return {
        types: [FETCH_HEADER_NAV, FETCH_HEADER_NAV_SUCCESS, FETCH_HEADER_NAV_FAIL],
        promise: fetchHeader()
    };
}

export const fetchObjConfig = (objName, force = false) => (dispatch, getState) => {
    let objConfig = getState().getIn(['standardObject', 'objConfig', objName]);
    let hasNeedConfig = false;

    if (objConfig && objConfig.get(objName)) {
        hasNeedConfig = true;
    }
    // 当Meta对象中不存在 或者 强制刷新才发送数据
    if (!hasNeedConfig || force) {
        return dispatch(_fetchObjConfig(objName));
    }
};

function _fetchObjConfig(objName) {
    return {
        objName,
        types: [FETCH_OBJ_EXTENDS_CONFIG, FETCH_OBJ_EXTENDS_CONFIG_SUCCESS, FETCH_OBJ_EXTENDS_CONFIG_FAIL],
        promise: fetchObjGlobalConfig(objName)
    };
}

// 如 leads,detail,page 有 list 和 detail
function _fetchLayout(objName, page) {
    return {
        objName,
        page,
        types: [FETCH_LAYOUT, FETCH_LAYOUT_SUCCESS, FETCH_LAYOUT_FAIL],
        promise: fetchLayoutRequest(objName, page)
    };
}


