import I from 'immutable';
import { createReducer } from 'redux/creator';
import {
    FETCH_ONE_ROLE_REQUEST,
    FETCH_ONE_ROLE_REQUEST_SUCCESS,
    FETCH_ONE_ROLE_REQUEST_FAIL
} from 'redux/action-types';


import { getOneRole } from 'requests/acl/role';

let defaultState = I.fromJS({
    fetching: false, // 加载状态
    roleList: [] // objId所属记录
});


export default createReducer(I.fromJS(defaultState), {
    // 获取members
    [FETCH_ONE_ROLE_REQUEST_SUCCESS](state, action) {
        console.log(state, action);
        return state;
    }
});


export function fetchOneRole(roleId) {
    return {
        roleId,
        types: [FETCH_ONE_ROLE_REQUEST, FETCH_ONE_ROLE_REQUEST_SUCCESS, FETCH_ONE_ROLE_REQUEST_FAIL],
        promise: getOneRole(roleId)
    };
}
