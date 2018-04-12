import I from 'immutable';
import { createReducer } from 'redux/creator';
import { fetchObjActions } from 'requests/common/actions';

import {
    FETCH_ACTIONS_REQUEST,
    FETCH_ACTIONS_REQUEST_SUCCESS,
    FETCH_ACTIONS_REQUEST_FAIL

    // FETCH_CUSTOMER_ACTION_REQUEST,
    // FETCH_CUSTOMER_ACTION_REQUEST_SUCCESS,
    // FETCH_CUSTOMER_ACTION_REQUEST_FAIL

} from 'redux/action-types';

export let defaultState = I.fromJS({});

export default createReducer(I.fromJS(defaultState), {
    [FETCH_ACTIONS_REQUEST_SUCCESS](state, action) {
        let { objName, result } = action;
        let finalState = state;
        if (state.get(objName)) {
            finalState = state.mergeIn([objName], I.fromJS(result.body));
        } else {
            finalState = state.set(objName, I.fromJS(result.body));
        }
        return finalState;
    }
});

export function fetchItemActions(objName) {
    return {
        objName,
        types: [FETCH_ACTIONS_REQUEST, FETCH_ACTIONS_REQUEST_SUCCESS, FETCH_ACTIONS_REQUEST_FAIL],
        promise: fetchObjActions(objName)
    };
}

// export function fetchCustomerAction(actionId, params) {
//     return {
//         objName,
//         types: [FETCH_ACTIONS_REQUEST, FETCH_ACTIONS_REQUEST_SUCCESS, FETCH_ACTIONS_REQUEST_FAIL],
//         promise: fetchObjActions(objName)
//     };
// }
