/**
 * Created by listen1013 on 17/5/1.
 */

import I from 'immutable';
import { createReducer } from 'redux/creator';

import {
    fetchDataRequest,
    updateFieldRequest,
    fetchCommentRequest,
    createCommentRequest,
    fetchRevokeRequest,
    fetchAuditRequest,
    fetchForwardRequest
} from 'requests/common/vetting';
import {
    FETCH_VETTING_DATA,
    FETCH_VETTING_DATA_SUCCESS,
    FETCH_VETTING_DATA_FAIL,

    UPDATA_VETTING_DATA,
    UPDATA_VETTING_DATA_SUCCESS,
    UPDATA_VETTING_DATA_FAIL,

    COMMENT_VETTING_DATA,
    COMMENT_VETTING_DATA_SUCCESS,
    COMMENT_VETTING_DATA_FAIL,

    CREATE_COMMENT_DATA,
    CREATE_COMMENT_DATA_SUCCESS,
    CREATE_COMMENT_DATA_FAIL,

    AUDIT_VETTING_DATA,
    AUDIT_VETTING_DATA_SUCCESS,
    AUDIT_VETTING_DATA_FAIL,

    RELAY_VETTING_DATA,
    RELAY_VETTING_DATA_SUCCESS,
    RELAY_VETTING_DATA_FAIL,

    REVOKE_VETTING_DATA,
    REVOKE_VETTING_DATA_SUCCESS,
    REVOKE_VETTING_DATA_FAIL
} from 'redux/action-types';

export let defaultState = I.fromJS({
    data: {}
});

export default createReducer(I.fromJS(defaultState), {
    [FETCH_VETTING_DATA_SUCCESS](state, action) {
        let {body} = action.result;
        return state.set('data', I.fromJS(body));
    },

    [UPDATA_VETTING_DATA_SUCCESS](state) {
        return state;
    },
    // 同意/拒绝审批
    [AUDIT_VETTING_DATA_SUCCESS](state, action){
        let { body } = action.result;
        // return state.set('data', data => data.mergeDeep(I.fromJS(body)));
        return state.set('data', I.fromJS(body));
    },
    // 转发审批
    [RELAY_VETTING_DATA_SUCCESS](state, action){
        let { body } = action.result;
        return state.update('data', data => data.mergeDeep(I.fromJS(body)));
    },
    // 撤回审批
    [REVOKE_VETTING_DATA_SUCCESS](state){
        return state;
    },

    [COMMENT_VETTING_DATA_SUCCESS](state, action) {
        let {body} = action.result;
        return state.set('comment', I.fromJS(body));
    },

    [CREATE_COMMENT_DATA_SUCCESS](state, action) {
        let { body } = action.result;
        return state.updateIn(['comment', 'Comments'], data => data.unshift(I.fromJS(body)));
    }
});

export function fetchData(id) {
    return {
        types: [FETCH_VETTING_DATA, FETCH_VETTING_DATA_SUCCESS, FETCH_VETTING_DATA_FAIL],
        promise: fetchDataRequest(id)
    };
}

// 在指定审批节点填写可编辑字段数据
export function updataField(id, pointId, params) {
    return {
        types: [UPDATA_VETTING_DATA, UPDATA_VETTING_DATA_SUCCESS, UPDATA_VETTING_DATA_FAIL],
        promise: updateFieldRequest(id, pointId, params)
    };
}

// 获取指定审批的评论列表
export function fetchComment(id) {
    return {
        types: [COMMENT_VETTING_DATA, COMMENT_VETTING_DATA_SUCCESS, COMMENT_VETTING_DATA_FAIL],
        promise: fetchCommentRequest(id)
    };
}

// 在指定审批发表评论
export function createComment(id, params) {
    return {
        params,
        types: [CREATE_COMMENT_DATA, CREATE_COMMENT_DATA_SUCCESS, CREATE_COMMENT_DATA_FAIL],
        promise: createCommentRequest(id, params)
    };
}

// 同意/拒绝
export function fetchAudit(id, params){
    return {
        params,
        types: [AUDIT_VETTING_DATA, AUDIT_VETTING_DATA_SUCCESS, AUDIT_VETTING_DATA_FAIL],
        promise: fetchAuditRequest(id, params)
    };
}

// 转发
export function fetchForwar(id, params){
    return {
        params,
        types: [RELAY_VETTING_DATA, RELAY_VETTING_DATA_SUCCESS, RELAY_VETTING_DATA_FAIL],
        promise: fetchForwardRequest(id, params)
    };
}

// 撤回
export function fetchRevoke(id){
    return {
        types: [REVOKE_VETTING_DATA, REVOKE_VETTING_DATA_SUCCESS, REVOKE_VETTING_DATA_FAIL],
        promise: fetchRevokeRequest(id)
    };
}
