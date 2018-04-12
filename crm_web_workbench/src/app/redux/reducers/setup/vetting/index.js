/**
 * Created by listen1013 on 17/5/1.
 */

import I from 'immutable';
import { createReducer } from 'redux/creator';
import {
    fetchTempDataRequest
} from 'requests/common/vetting';
import {
    FETCH_TEMPLATE_DATA,
    FETCH_TEMPLATE_DATA_SUCCESS,
    FETCH_TEMPLATE_DATA_FAIL
} from 'redux/action-types';
export let defaultState = I.fromJS({
    data: {}
});

export default createReducer(I.fromJS(defaultState), {
    [FETCH_TEMPLATE_DATA_SUCCESS](state, action) {
        let { Id } = action.result.body;
        return state.setIn(['data', Id], I.fromJS(action.result.body));
    }
});

// 获取指定审批模板
export function fetchtempData(id) {
    return {
        types: [FETCH_TEMPLATE_DATA, FETCH_TEMPLATE_DATA_SUCCESS, FETCH_TEMPLATE_DATA_FAIL],
        promise: fetchTempDataRequest(id)
    };
}
