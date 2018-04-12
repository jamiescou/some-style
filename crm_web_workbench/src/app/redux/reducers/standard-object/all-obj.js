/**
 * 存放所有带display_name的对象字段
 */

import I from 'immutable';
import { createReducer } from 'redux/creator';

import {
    FETCH_ALLOBJECT_NAME,
    FETCH_ALLOBJECT_NAME_SUCCESS,
    FETCH_ALLOBJECT_NAME_FAIL
} from 'redux/action-types';

import { fetchAllObjRequest } from 'requests/common/meta';


let defaultState = I.fromJS({});

export default createReducer(I.fromJS(defaultState), {

    [FETCH_ALLOBJECT_NAME_SUCCESS](state, action) {
        let { body = []} = action.result;
        let allObjects = body;
        let allObjectList = {};
        for (let key in allObjects) {
            allObjectList[key] = {
                display: allObjects[key].display_name,
                name: key
            };
        }
        return state.merge(I.fromJS(allObjectList));
    }
});

export const fetchAllObj = () => (dispatch) => {
    return dispatch(_fetchAllObj());
};

function _fetchAllObj() {
    return {
        types: [FETCH_ALLOBJECT_NAME, FETCH_ALLOBJECT_NAME_SUCCESS, FETCH_ALLOBJECT_NAME_FAIL],
        promise: fetchAllObjRequest()
    };
}
