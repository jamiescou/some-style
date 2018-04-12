/**
 * Created by listen1013 on 17/3/24.
 */

import I from 'immutable';
import { createReducer, createAction } from 'redux/creator';

import { fetchFilterRequest, createDataRequest, updateDataRequest, deleteDataRequest } from 'requests/common/filter';
import {
    FETCH_FILTER_DATA,
    FETCH_FILTER_DATA_SUCCESS,
    FETCH_FILTER_DATA_FAIL,

    // 创建filter data
    CREAT_FILTER_DATA,
    CREAT_FILTER_DATA_SUCCESS,
    CREAT_FILTER_DATA_FAIL,

    // 修改filter
    UPDATE_FILTER_DATA,
    UPDATE_FILTER_DATA_SUCCESS,
    UPDATE_FILTER_DATA_FAIL,

    // 删除fiilter
    DELETE_FILTER_DATA,
    DELETE_FILTER_DATA_SUCCESS,
    DELETE_FILTER_DATA_FAIL

} from 'redux/action-types';

export let defaultState = I.fromJS({
    objName: null,
    data: null
});

export default createReducer(I.fromJS(defaultState), {
    [FETCH_FILTER_DATA_SUCCESS](state, action) {
        return state.set('data', I.fromJS(action.result.body));
    },
    [CREAT_FILTER_DATA_SUCCESS](state, action) {
        let obj = {};
        let {id, view_filter} = action.result.body;
        obj[id] = view_filter;
        return state.mergeIn(['data', 'view_filters'], I.fromJS(obj));
    },

    [UPDATE_FILTER_DATA_SUCCESS](state, action) {
        let { view_filter, id} = action.result.body;
        return state.mergeIn(['data', 'view_filters', id], I.fromJS(view_filter));
    },

    [DELETE_FILTER_DATA_SUCCESS](state, action) {
        let {id} = action.result.body;
        return state.deleteIn(['data', 'view_filters', id]);
    }
});
// 静态方法.使用于Modal.delete-filter
export const deleteFilter = createAction(DELETE_FILTER_DATA_SUCCESS, 'result');

// 获取 ViewFilter
export function fetchFilter(objName, param) {
    return {
        types: [FETCH_FILTER_DATA, FETCH_FILTER_DATA_SUCCESS, FETCH_FILTER_DATA_FAIL],
        promise: fetchFilterRequest(objName, param)
    };
}

// 创建 ViewFilter
export function createFilterData(objName, param) {
    return {
        types: [CREAT_FILTER_DATA, CREAT_FILTER_DATA_SUCCESS, CREAT_FILTER_DATA_FAIL],
        promise: createDataRequest(objName, param)
    };
}
// 修改 ViewFilter
export function updateFilterData(objName, param, vid) {
    return {
        types: [UPDATE_FILTER_DATA, UPDATE_FILTER_DATA_SUCCESS, UPDATE_FILTER_DATA_FAIL],
        promise: updateDataRequest(objName, param, vid)
    };
}
// 删除 ViewFilter
export function deleteFilterData(objName, vid) {
    return {
        types: [DELETE_FILTER_DATA, DELETE_FILTER_DATA_SUCCESS, DELETE_FILTER_DATA_FAIL],
        promise: deleteDataRequest(objName, vid)
    };
}
