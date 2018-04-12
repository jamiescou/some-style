// import _ from 'lodash';
import I from 'immutable';
import { createReducer } from 'redux/creator';
import { createObjectRequest, addColumnRequest, createObjectFieldRequest } from 'requests/common/setup-object';
import {
    CREATE_OBJECT,
    CREATE_OBJECT_SUCCESS,
    CREATE_OBJECT_FAIL,
    ADD_COLUMN_DATA,
    ADD_COLUMN_DATA_SUCCESS,
    ADD_COLUMN_DATA_FAIL,
    ADD_OBJECT_FIELD,
    ADD_OBJECT_FIELD_SUCCESS,
    ADD_OBJECT_FIELD_FAIL
} from 'redux/action-types';
let defaultState = I.fromJS({
    data: []
});
export default createReducer(I.fromJS(defaultState), {
    [CREATE_OBJECT_SUCCESS](state, action){
        let { body } = action.result;
        return state.set('data', state.get('data').push(I.fromJS(body)));
    },
    [ADD_COLUMN_DATA_SUCCESS](state){
        // Todo: 这块获取所有的meta接口没给 这个的数据不知道如何处理
        return state;
    },
    [ADD_OBJECT_FIELD_SUCCESS](state){
        // Todo: 这块获取所有的meta接口没给 这个的数据不知道如何处理
        return state;
    }
});

// 新建对象
export function createObject(objName, param){
    return {
        types: [CREATE_OBJECT, CREATE_OBJECT_SUCCESS, CREATE_OBJECT_FAIL],
        promise: createObjectRequest(objName, param)
    };
}
// 添加一列
export function addColumn(objName, param){
    return {
        types: [ADD_COLUMN_DATA, ADD_COLUMN_DATA_SUCCESS, ADD_COLUMN_DATA_FAIL],
        promise: addColumnRequest(objName, param)
    };
}

// 新建字段
export function createObjectField(objName, param){
    return {
        types: [ADD_OBJECT_FIELD, ADD_OBJECT_FIELD_SUCCESS, ADD_OBJECT_FIELD_FAIL],
        promise: createObjectFieldRequest(objName, param)
    };
}
