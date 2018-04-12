/**
 * 关于对象下数据team
 * {
 *     standard: {
 *         'id112312323123123':[
                {
                  "ent_id": "713f17ca614361fb257dc6741332caf2",
                  "object_name": "standard",
                  "record_id": "2b5b39f89997e4f8531bcefc6fab2f81",
                  "owner_id": "00001111222233334444555566667777",
                  "user_id": "617d7edc3589a11e797e5369a4bc725b",
                  "access_level": 1
                }
            ]
 *     }
 * }
 */

/**
 * data中,存放每一个相关对象的 对象名字
 * {
 *     data: {
 *     }
 * }
 */


import I from 'immutable';
import { createReducer } from 'redux/creator';
import {
    FETCH_TEAM_MEMBER_REQUEST,
    FETCH_TEAM_MEMBER_REQUEST_SUCCESS,
    FETCH_TEAM_MEMBER_REQUEST_FAIL,

    ADD_TEAM_MEMBER_REQUEST,
    ADD_TEAM_MEMBER_REQUEST_SUCCESS,
    ADD_TEAM_MEMBER_REQUEST_FAIL,

    REMOVE_TEAM_MEMBER_REQUEST,
    REMOVE_TEAM_MEMBER_REQUEST_SUCCESS,
    REMOVE_TEAM_MEMBER_REQUEST_FAIL
} from 'redux/action-types';


import { getTeamMember, addTeamMember, deleteTeamMember } from 'requests/acl/team';

let defaultState = I.fromJS({
    fetching: false, // 加载状态
    objName: '', // team所属对象
    objId: '', // objId所属记录
    ownerId: '', // 拥有者
    members: {} // 成员list
});


export default createReducer(I.fromJS(defaultState), {
    // 获取members
    [FETCH_TEAM_MEMBER_REQUEST](state) {
        return state.set('fetching', true);
    },

    [FETCH_TEAM_MEMBER_REQUEST_SUCCESS](state, action) {
        let { objName, objId, ownerId, result } = action;
        let data = {
            fetching: false,
            objName,
            objId,
            ownerId,
            members: {}
        };
        let { team_members=[] } = result;
        team_members.forEach(v => {
            data.members[v.user_id] = v;
        });
        return I.fromJS(data);
    },

    // 新增members
    [ADD_TEAM_MEMBER_REQUEST](state) {
        let result = state;
        result = state.set('fetching', true);
        return result;
    },
    [ADD_TEAM_MEMBER_REQUEST_SUCCESS](state, action) {
        let { objName, objId, ownerId, params } = action;
        let userId = params.user_id;
        let newState = state.setIn(['members', userId], I.fromJS({
            user_id: userId,
            object_name: objName,
            record_id: objId,
            owner_id: ownerId,
            access_level: params.access_level,
            team_member_role: params.team_member_role
        }));
        newState = newState.set('fetching', false);
        return newState;
    },
    [ADD_TEAM_MEMBER_REQUEST_FAIL](state) {
        return state;
    },

    [REMOVE_TEAM_MEMBER_REQUEST](state) {
        return state.set('fetching', true);
    },
    [REMOVE_TEAM_MEMBER_REQUEST_SUCCESS](state, action) {
        let { userId } = action;
        let newState = state.set('fetching', false);
        newState = newState.deleteIn(['members', userId + '']);
        return newState;
    }
});


export function fetchTeamMember(objName, objId, ownerId) {
    return {
        objName,
        objId,
        ownerId,
        types: [FETCH_TEAM_MEMBER_REQUEST, FETCH_TEAM_MEMBER_REQUEST_SUCCESS, FETCH_TEAM_MEMBER_REQUEST_FAIL],
        promise: getTeamMember(objName, objId, ownerId)
    };
}

export function createTeamMember(objName, objId, ownerId, params) {
    return {
        objName,
        objId,
        ownerId,
        params,
        types: [ADD_TEAM_MEMBER_REQUEST, ADD_TEAM_MEMBER_REQUEST_SUCCESS, ADD_TEAM_MEMBER_REQUEST_FAIL],
        promise: addTeamMember(objName, objId, ownerId, params)
    };
}

export function removeTeamMember(objName, objId, ownerId, userId) {
    return {
        userId,
        types: [REMOVE_TEAM_MEMBER_REQUEST, REMOVE_TEAM_MEMBER_REQUEST_SUCCESS, REMOVE_TEAM_MEMBER_REQUEST_FAIL],
        promise: deleteTeamMember(objName, objId, ownerId, userId)
    };
}
