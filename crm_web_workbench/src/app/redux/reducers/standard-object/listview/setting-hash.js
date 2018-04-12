import I from 'immutable';
import _ from 'lodash';
import { createAction, createReducer } from 'redux/creator';
import {
    SETTING_CHECKED_ALL_LIST_SUCCESS,
    CLEAR_CHECKED_ALL_LIST_SUCCESS,
    HANDLE_CHECKED_LIST_SUCCESS,
    DELETE_HASH_DATA_SUCCESS
} from 'redux/action-types';
export let defaultState = I.fromJS({
    hashList: {}
});

export default createReducer(I.fromJS(defaultState), {
    [SETTING_CHECKED_ALL_LIST_SUCCESS](state, action){
        let { hashList } = action;
        let hash = {};
        _.forEach(hashList, val => {
            hash[val.get('id')] = {
                version: val.get('version'),
                object_id: val.get('id')
            };
        });
        return state.set('hashList', I.fromJS(hash));
    },
    [CLEAR_CHECKED_ALL_LIST_SUCCESS](state){
        return state.set('hashList', I.fromJS({}));
    },
    [HANDLE_CHECKED_LIST_SUCCESS](state, action){
        let hashList = state.get('hashList');
        let { currentChecked } = action;
        let id = currentChecked.get('id');
        if (hashList.get(id)) {
            return state.deleteIn(['hashList', id]);
        }
        return state.setIn(['hashList', id], I.fromJS({
            version: currentChecked.get('version'),
            object_id: id
        }));
    },
    [DELETE_HASH_DATA_SUCCESS](state, action){
        let hashList = state.get('hashList');
        let { id } = action;
        if (hashList.get(id)) {
            return state.deleteIn(['hashList', id]);
        }
        return state;
    }
});
export const settingCheckedAll = createAction(SETTING_CHECKED_ALL_LIST_SUCCESS, 'hashList');
export const clearCheckedAll = createAction(CLEAR_CHECKED_ALL_LIST_SUCCESS, 'hashList');
export const handleChecked = createAction(HANDLE_CHECKED_LIST_SUCCESS, 'currentChecked');
export const deleteHashData = createAction(DELETE_HASH_DATA_SUCCESS, 'id');

