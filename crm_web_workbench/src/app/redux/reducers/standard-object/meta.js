/**
 * 存放所有对象 meta 结构为 hashmap
 */

import I from 'immutable';
import { createReducer } from 'redux/creator';
// import _ from 'lodash';

import {
    FETCH_META,
    FETCH_META_SUCCESS,
    FETCH_META_FAIL
} from 'redux/action-types';

import { fetchMetaRequest } from 'requests/common/meta';


let defaultState = I.fromJS({});

export default createReducer(I.fromJS(defaultState), {
    [FETCH_META_SUCCESS](state, action) {
        return state.set(action.objName, I.fromJS(action.result.body));
    }
});

export const fetchMeta = (objName, force = false) => (dispatch, getState) => {
    let hasMeta = getState().getIn(['standardObject', 'meta', objName]);
    // 当Meta对象中不存在 或者 强制刷新才发送数据
    if (!hasMeta || force) {
        return dispatch(_fetchMeta(objName));
    }
};

function _fetchMeta(objName) {
    return {
        objName,
        types: [FETCH_META, FETCH_META_SUCCESS, FETCH_META_FAIL],
        promise: fetchMetaRequest(objName)
    };
}
