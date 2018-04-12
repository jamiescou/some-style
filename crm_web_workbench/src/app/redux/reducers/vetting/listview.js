/**
 * Created by listen1013 on 17/5/1.
 */

import I from 'immutable';
import { createReducer, createAction } from 'redux/creator';

import {
    fetchListRequest,
    fetchFieldsRequest,
    fetchCreateTempRequest,
    fetchUpdataTempRequest,
    createApprovalRequest,
    fetchCountRequest,
    fetchApprovalRequest
} from 'requests/common/vetting';
import {
    FETCH_VETTING_LIST,
    FETCH_VETTING_LIST_SUCCESS,
    FETCH_VETTING_LIST_FAIL,

    RECORD_FIELDS_DATA,
    RECORD_FIELDS_DATA_SUCCESS,
    RECORD_FIELDS_DATA_FAIL,

    CREATE_TEMP_DATA,
    CREATE_TEMP_DATA_SUCCESS,
    CREATE_TEMP_DATA_FAIL,

    UPDATA_TEMP_DATA,
    UPDATA_TEMP_DATA_SUCCESS,
    UPDATA_TEMP_DATA_FAIL,

    CREATE_APPROVAL_DATA,
    CREATE_APPROVAL_DATA_SUCCESS,
    CREATE_APPROVAL_DATA_FAIL,

    RESIT_UPDATA_TEMP_DATA_SUCCESS,

    RESIT_CREATE_APPROVAL_DATA_SUCCESS,

    RESIT_APPROVAL_FIELDS_SUCCESS,

    FETCH_VETTING_COUNT,
    FETCH_VETTING_COUNT_SUCCESS,
    FETCH_VETTING_COUNT_FAIL,

    FETCH_APPROVAL_OBJNAME,
    FETCH_APPROVAL_OBJNAME_SUCCESS,
    FETCH_APPROVAL_OBJNAME_FAIL

} from 'redux/action-types';
export let defaultState = I.fromJS({
    list: {},
    data: [],
    param: null,
    info: null,
    fields: null
});

export default createReducer(I.fromJS(defaultState), {
    [FETCH_VETTING_LIST_SUCCESS](state, action) {
        let { body } = action.result;
        return state.set('list', I.fromJS(body));
    },

    // 获取指定Record有那些字段在审批
    [RECORD_FIELDS_DATA_SUCCESS](state, action){
        let { body } = action.result;
        return state.set('fields', I.fromJS(body));
    },
    // 获取创建可用的审批模板success
    [CREATE_TEMP_DATA_SUCCESS](state, action){
        let {params, info, result} = action;
        return state.set('data', I.fromJS(result.body.Defines))
            .set('param', params)
            .set('info', info);
    },
    // 获取修改可用的审批模板success
    [UPDATA_TEMP_DATA_SUCCESS](state, action){
        let {params, info, result} = action;
        return state.set('data', I.fromJS(result.body.Defines))
            .set('param', params)
            .set('info', info);
    },

    [RESIT_UPDATA_TEMP_DATA_SUCCESS](state) {
        return state.set('data', [])
            .set('param', null)
            .set('info', null);
    },

    [RESIT_CREATE_APPROVAL_DATA_SUCCESS](state) {
        return state.set('data', [])
            .set('param', null)
            .set('info', null);
    },

    [RESIT_APPROVAL_FIELDS_SUCCESS](state) {
        return state.set('fields', null);
    },

    [FETCH_VETTING_COUNT_SUCCESS](state, action) {
        let { body } = action.result;
        return state.set('listTypeCount', I.fromJS(body.Counts));
    },

    [FETCH_APPROVAL_OBJNAME_SUCCESS](state, action) {
        let { body } = action.result;
        return state.set('approvalObjName', I.fromJS(body));
    }
});

// 列表页请求 （这里标注一下，是审批列表页，和模版列表页区分开）
export function fetchList(params) {
    return {
        params,
        types: [FETCH_VETTING_LIST, FETCH_VETTING_LIST_SUCCESS, FETCH_VETTING_LIST_FAIL],
        promise: fetchListRequest(params)
    };
}

// 获取审批列表每个类型的审批总条目
export function fetchCount(params) {
    return {
        params,
        types: [FETCH_VETTING_COUNT, FETCH_VETTING_COUNT_SUCCESS, FETCH_VETTING_COUNT_FAIL],
        promise: fetchCountRequest(params)
    };
}

// 获取有审批模板的标准对象
export function fetchApprovalObj() {
    return {
        types: [FETCH_APPROVAL_OBJNAME, FETCH_APPROVAL_OBJNAME_SUCCESS, FETCH_APPROVAL_OBJNAME_FAIL],
        promise: fetchApprovalRequest()
    };
}

// 获取指定Record有那些字段在审批
export function fetchFields(objName, id){
    return {
        types: [RECORD_FIELDS_DATA, RECORD_FIELDS_DATA_SUCCESS, RECORD_FIELDS_DATA_FAIL],
        promise: fetchFieldsRequest(objName, id)
    };
}

// 获取创建可用的审批模板
export function fetchCreateTemp(objName, params, info){
    return {
        params,
        info,
        types: [CREATE_TEMP_DATA, CREATE_TEMP_DATA_SUCCESS, CREATE_TEMP_DATA_FAIL],
        promise: fetchCreateTempRequest(objName, params)
    };
}

// 获取修改可用的审批模板
export function fetchUpdataTemp(objName, objId, params, info){
    return {
        params,
        info,
        types: [UPDATA_TEMP_DATA, UPDATA_TEMP_DATA_SUCCESS, UPDATA_TEMP_DATA_FAIL],
        promise: fetchUpdataTempRequest(objName, objId, params)
    };
}

// 创建审批
export function createApproval(id, params){
    return {
        params,
        types: [CREATE_APPROVAL_DATA, CREATE_APPROVAL_DATA_SUCCESS, CREATE_APPROVAL_DATA_FAIL],
        promise: createApprovalRequest(id, params)
    };
}

// 情况state上审批相关数据
export const resetUpdataTemp = createAction(RESIT_UPDATA_TEMP_DATA_SUCCESS, 'payload');
export const resetCreateTemp = createAction(RESIT_CREATE_APPROVAL_DATA_SUCCESS, 'payload');
export const resetFields = createAction(RESIT_APPROVAL_FIELDS_SUCCESS, 'payload');
