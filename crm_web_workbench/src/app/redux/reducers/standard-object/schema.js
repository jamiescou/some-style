/**
 * 存放所有对象 schema 是个 hashmap
 * 请求 schema 的时候带上 objName,请求返回后在存入相应的数据
 */

import I from 'immutable';
import { createReducer } from 'redux/creator';
// import _ from 'lodash';

import {
    FETCH_SCHEMA,
    FETCH_SCHEMA_SUCCESS,
    FETCH_SCHEMA_FAIL
} from 'redux/action-types';

import { fetchSchemaRequest } from 'requests/common/meta';

let defaultState = I.fromJS({});

export default createReducer(I.fromJS(defaultState), {
    [FETCH_SCHEMA_SUCCESS](state, action) {
        return state.set(action.objName, I.fromJS(action.result.body));
    }
});

export const fetchSchema = (objName, force = false) => (dispatch, getState) => {
    let hasSchema = getState().getIn(['standardObject', 'schema', objName]);
    // 当schema对象中不存在 或者 强制刷新才发送数据
    if (!hasSchema || force) {
        return dispatch(_fetchSchema(objName));
    }
};


export function _fetchSchema(objName) {
    return {
        objName,
        types: [FETCH_SCHEMA, FETCH_SCHEMA_SUCCESS, FETCH_SCHEMA_FAIL],
        promise: fetchSchemaRequest(objName)
    };
}
