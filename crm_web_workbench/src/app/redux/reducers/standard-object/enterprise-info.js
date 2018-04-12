/**
 * 首页公司基本信息
 */

import I from 'immutable';
import { createReducer } from 'redux/creator';

import {
    FETCH_ENTERPRISE_INFO,
    FETCH_ENTERPRISE_INFO_SUCCESS,
    FETCH_ENTERPRISE_INFO_FAIL
} from 'redux/action-types';

import { fetchEnterpriseInfo } from 'requests/common/enterprise-info';

let defaultState = I.fromJS({});

export default createReducer(I.fromJS(defaultState), {
    [FETCH_ENTERPRISE_INFO_SUCCESS](state, action) {
        return state.set('enterprise', I.fromJS(action.result.body));
    }
});

export function fetchEnterpriseData(id) {
    return {
        id,
        types: [FETCH_ENTERPRISE_INFO, FETCH_ENTERPRISE_INFO_SUCCESS, FETCH_ENTERPRISE_INFO_FAIL],
        promise: fetchEnterpriseInfo(id)
    };
}
