/**
 * 获取对象的依赖关系dependency-by
 */

import I from 'immutable';
import { createReducer } from 'redux/creator';
// import _ from 'lodash';

import {
    FETCH_DENPENDENCY,
    FETCH_DENPENDENCY_SUCCESS,
    FETCH_DENPENDENCY_FAIL
} from 'redux/action-types';

import { fetchDependencyRequest } from 'requests/common/dependency';

let defaultState = I.fromJS({});

export default createReducer(I.fromJS(defaultState), {
    [FETCH_DENPENDENCY_SUCCESS](state, action) {
        let { objName, result } = action;

        return state.set(objName, I.fromJS(result.body));
    }
});


export const fetchDependency = (objName, force = false) => (dispatch, getState) => {
    let dependency = getState().getIn(['standardObject', 'dependency', objName]);

    // 当Meta对象中不存在 或者 强制刷新才发送数据
    if (!dependency || force) {
        return dispatch(_fetchDependency(objName));
    }
};

function _fetchDependency(objName) {
    return {
        objName,
        types: [FETCH_DENPENDENCY, FETCH_DENPENDENCY_SUCCESS, FETCH_DENPENDENCY_FAIL],
        promise: fetchDependencyRequest(objName)
    };
}

