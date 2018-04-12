import I from 'immutable';
import { createReducer } from 'redux/creator';

import {
    FETCH_ONE_GROUP_REQUEST,
    FETCH_ONE_GROUP_REQUEST_SUCCESS,
    FETCH_ONE_GROUP_REQUEST_FAIL
} from 'redux/action-types';


import { getOneGroup } from 'requests/acl/group';

let defaultState = I.fromJS({
    fetching: false, // 加载状态
    groupList: [] // objId所属记录
});


export default createReducer(I.fromJS(defaultState), {
    // 获取members
    [FETCH_ONE_GROUP_REQUEST](state) {
        return state.set('fetching', true);
    },

    [FETCH_ONE_GROUP_REQUEST_SUCCESS](state, action) {
        console.log(state, action);
    }
});


export function fetchOneGroup(groupId) {
    return {
        groupId,
        types: [FETCH_ONE_GROUP_REQUEST, FETCH_ONE_GROUP_REQUEST_SUCCESS, FETCH_ONE_GROUP_REQUEST_FAIL],
        promise: getOneGroup(groupId)
    };
}
