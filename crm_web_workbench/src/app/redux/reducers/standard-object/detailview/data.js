/**
 * Created by listen1013 on 17/3/24.
 */

import I from 'immutable';
import { createReducer, createAction } from 'redux/creator';

import { fetchOneRequest, updateDataRequest } from 'requests/common/standard-object';
import {
    claimTerritoryRecordRequest,
    allocateTerritoryRequest
} from 'requests/common/territory';
import {
    FETCH_DETAILVIEW_OBJECT,
    FETCH_DETAILVIEW_OBJECT_SUCCESS,
    FETCH_DETAILVIEW_OBJECT_FAIL,

    UPDATE_DETAILVIEW_OBJECT,
    UPDATE_DETAILVIEW_OBJECT_SUCCESS,
    UPDATE_DETAILVIEW_OBJECT_FAIL,

    CLAIM_DETAILVIEW_TERRITORY,
    CLAIM_DETAILVIEW_TERRITORY_SUCCESS,
    CLAIM_DETAILVIEW_TERRITORY_FAIL,

    ALLOCATE_DETAILVIEW_TERRITORY,
    ALLOCATE_DETAILVIEW_TERRITORY_SUCCESS,
    ALLOCATE_DETAILVIEW_TERRITORY_FAIL
} from 'redux/action-types';

export let defaultState = I.fromJS({});

export default createReducer(I.fromJS(defaultState), {
    [FETCH_DETAILVIEW_OBJECT_SUCCESS](state, action) {
        let { code, body } = action.result;
        if (code !== 0) {
            return state;
        }
        return I.fromJS(body);
    },

    [UPDATE_DETAILVIEW_OBJECT_SUCCESS](state, action) {
        return state.merge(I.fromJS(action.result.body));
    }

    /* [CLAIM_DETAILVIEW_TERRITORY_SUCCESS](state){
        return state;
    },

    [ALLOCATE_DETAILVIEW_TERRITORY_SUCCESS](state){
        return state;
    } */
});

export const updateDetailviewData = createAction(UPDATE_DETAILVIEW_OBJECT_SUCCESS, 'objName', 'id', 'result');

export function fetchObj(objName, id) {
    return {
        types: [FETCH_DETAILVIEW_OBJECT, FETCH_DETAILVIEW_OBJECT_SUCCESS, FETCH_DETAILVIEW_OBJECT_FAIL],
        promise: fetchOneRequest(objName, id)
    };
}

export function updateObject(objName, id, updateData) {
    return {
        updateData,
        types: [UPDATE_DETAILVIEW_OBJECT, UPDATE_DETAILVIEW_OBJECT_SUCCESS, UPDATE_DETAILVIEW_OBJECT_FAIL],
        promise: updateDataRequest(objName, id, updateData)
    };
}

// 详情页海的领取操作
export function claimDetailviewTerritory(record_id) {
    return {
        types: [CLAIM_DETAILVIEW_TERRITORY, CLAIM_DETAILVIEW_TERRITORY_SUCCESS, CLAIM_DETAILVIEW_TERRITORY_FAIL],
        promise: claimTerritoryRecordRequest(record_id)
    };
}

// 详情页海的退回操作
export function allocateTerritory(params) {
    return {
        types: [ALLOCATE_DETAILVIEW_TERRITORY, ALLOCATE_DETAILVIEW_TERRITORY_SUCCESS, ALLOCATE_DETAILVIEW_TERRITORY_FAIL],
        promise: allocateTerritoryRequest(params)
    };
}
