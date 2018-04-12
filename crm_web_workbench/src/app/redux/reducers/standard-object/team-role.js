/**
 * 获取对象的team属性
 */

import I from 'immutable';
import { createReducer } from 'redux/creator';
// import _ from 'lodash';

import {
    FETCH_OBJECT_TEAM_ROLE,
    FETCH_OBJECT_TEAM_ROLE_SUCCESS,
    FETCH_OBJECT_TEAM_ROLE_FAIL
} from 'redux/action-types';

import { fetchObjectTeamRole } from 'requests/common/standard-object';

let defaultState = I.fromJS({});

export default createReducer(I.fromJS(defaultState), {
    [FETCH_OBJECT_TEAM_ROLE_SUCCESS](state, action) {
        let res = action.result.body;
        let { team_member_roles = [] } = res;
        return state.set(action.objName, I.fromJS(team_member_roles));
    }
});

export function fetchObjectTeamRoles(objName) {
    return {
        objName,
        types: [FETCH_OBJECT_TEAM_ROLE, FETCH_OBJECT_TEAM_ROLE_SUCCESS, FETCH_OBJECT_TEAM_ROLE_FAIL],
        promise: fetchObjectTeamRole(objName)
    };
}
