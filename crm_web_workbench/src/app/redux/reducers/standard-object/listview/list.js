/**
 * Created by listen1013 on 17/3/24.
 */
import moment from 'moment';
import I from 'immutable';
import _ from 'lodash';
import { createAction, createReducer } from 'redux/creator';

import {
    fetchDataRequest,
    createDataRequest,
    deleteDataRequest,
    updateDataRequest,
    mergeDataRequest,
    copyDataRequest
} from 'requests/common/standard-object';
import {
    FETCH_LIST_DATA,
    FETCH_LIST_DATA_SUCCESS,
    FETCH_LIST_DATA_FAIL,
    CREATE_DATA,
    CREATE_DATA_SUCCESS,
    CREATE_DATA_FAIL,
    DELETE_DATA,
    DELETE_DATA_SUCCESS,
    DELETE_DATA_FAIL,
    UPDATE_DATA,
    UPDATE_DATA_SUCCESS,
    UPDATE_DATA_FAIL,
    // ADD_TO_DATA,
    // ADD_TO_DATA_SUCCESS,
    // ADD_TO_DATA_FAIL,
    // REMOVE_TO_DATA,
    // REMOVE_TO_DATA_SUCCESS,
    // REMOVE_TO_DATA_FAIL,
    // MODIFY_TO_DATA,
    // MODIFY_TO_DATA_SUCCESS,
    // MODIFY_TO_DATA_FAIL,
    BATCH_DELETE_LIST_DATA_SUCCESS,
    MERGE_DATA,
    MERGE_DATA_SUCCESS,
    MERGE_DATA_FAIL,
    COPY_DATA,
    COPY_DATA_SUCCESS,
    COPY_DATA_FAIL
} from 'redux/action-types';

export let defaultState = I.fromJS({
    objName: null,
    data: [],
    offset: 0,
    fetching: false
});

export default createReducer(I.fromJS(defaultState), {
    [FETCH_LIST_DATA](state) {
        return state.set('fetching', true);
    },

    [FETCH_LIST_DATA_SUCCESS](states, action) {
        let state = states;
        let param = {
            order_by: action.params.curField,
            order_flag: action.params.curFlag,
            offset: action.params.offset,
            load: false,
            view_filter: action.params.view_filter,
            update_date: moment().format('MM/DD/YYYY HH:mm:ss')
        };
        if (parseInt(param.offset) === 0){
            state = state.set('data', I.fromJS(action.result.body.objects));
        } else {
            let body = action.result.body.objects;
            if (body && body.length > 0 && body.length === parseInt(action.params.limit)) {
                state = state.set('data', state.get('data').concat(I.fromJS(body)));
            } else if (body && body.length > 0 && body.length < parseInt(action.params.limit)) {
                state = state.set('data', state.get('data').concat(I.fromJS(body)));
                param.load = true;
            } else {
                param.load = true;
            }
        }
        return state.set('param', param)
            .set('objName', action.objName)
            .set('offset', action.result.body.global_offset)
            .set('fetching', false);
    },

    [FETCH_LIST_DATA_FAIL](state) {
        return state.set('fetching', false);
    },

    [CREATE_DATA_SUCCESS](states, action) {
        let { objName } = action;
        let { body } = action.result;
        let state = states;
        if (objName === states.get('objName')) {
            body.forEach(object => {
                state = state.update('data', data => data.unshift(I.fromJS(object)));
            });
        }
        return state;
    },

    [UPDATE_DATA_SUCCESS](state, action) {
        let { body } = action.result;
        let { objName } = action;
        if (objName === state.get('objName')) {
            let index = state.getIn(['data']).findIndex(d => d.get('id') === action.id);
            if (index >= 0) {
                return state.updateIn(['data', index], data => data.mergeDeep(I.fromJS(body)));
            }
        }
        return state;
    },

    [DELETE_DATA_SUCCESS](state, action) {
        let index = state.getIn(['data']).findIndex(d => d.get('id') === action.id);
        // 找到 index 删除这个位置的数据
        if (index >= 0) {
            return state.deleteIn(['data', index]);
        }
        return state;
    },

    [BATCH_DELETE_LIST_DATA_SUCCESS](state, action){
        let { idList } = action;
        _.forEach(idList, v => {
            let index = state.getIn(['data']).findIndex(d => d.get('id') === v);
            if (index >= 0) {
                return state.deleteIn(['data', index]);
            }
        });
        return state;
    },

    [COPY_DATA_SUCCESS](state, action){
        console.log('COPY_DATA_SUCCESS', state, action);
    },

    [MERGE_DATA_SUCCESS](states, action){
        let { objName } = action;
        let { body } = action.result;
        let state = states;
        if (objName === states.get('objName')) {
            let object = body.datas[objName][0];
            state = state.update('data', data => data.unshift(I.fromJS(object)));
        }
        return state;
    }
});

export const fetchListFail = createAction(FETCH_LIST_DATA_FAIL, 'payload');

// 批量删除
export const batchDeleteList = createAction(BATCH_DELETE_LIST_DATA_SUCCESS, 'idList');

export function fetchList(objName, params) {
    return {
        objName,
        params,
        types: [FETCH_LIST_DATA, FETCH_LIST_DATA_SUCCESS, FETCH_LIST_DATA_FAIL],
        promise: fetchDataRequest(objName, params)
    };
}

export function createData(objName, objects) {
    return {
        objName,
        types: [CREATE_DATA, CREATE_DATA_SUCCESS, CREATE_DATA_FAIL],
        promise: createDataRequest(objName, objects)
    };
}

export function deleteData(objName, id, version = 0) {
    return {
        id,
        objName,
        types: [DELETE_DATA, DELETE_DATA_SUCCESS, DELETE_DATA_FAIL],
        promise: deleteDataRequest(objName, id, version)
    };
}


export function updateData(objName, id, version = 0) {
    return {
        id,
        objName,
        types: [UPDATE_DATA, UPDATE_DATA_SUCCESS, UPDATE_DATA_FAIL],
        promise: updateDataRequest(objName, id, version)
    };
}

export function copyData(objName, id) {
    return {
        objName,
        types: [COPY_DATA, COPY_DATA_SUCCESS, COPY_DATA_FAIL],
        promise: copyDataRequest(objName, id)
    };
}

export function mergeData(objName, object, optional) {
    return {
        objName,
        object,
        optional,
        types: [MERGE_DATA, MERGE_DATA_SUCCESS, MERGE_DATA_FAIL],
        promise: mergeDataRequest(objName, object, optional)
    };
}


export const creatAlldata = createAction(CREATE_DATA_SUCCESS, 'objName', 'result');

export const modifydata = createAction(UPDATE_DATA_SUCCESS, 'objName', 'id', 'result');

export const removedata = createAction(DELETE_DATA_SUCCESS, 'objName', 'id' );

// 复制数据的成功回掉
export const duplicatedata = createAction(COPY_DATA_SUCCESS, 'objName', 'id', 'result');

// 合并数据的成功回掉
export const combinedata = createAction(MERGE_DATA_SUCCESS, 'objName', 'object', 'optional', 'result');

