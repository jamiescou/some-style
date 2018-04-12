/**
 * Created by listen1013 on 17/3/24.
 */
import moment from 'moment';
import I from 'immutable';
import { createReducer } from 'redux/creator';

import {
    fetchTerritoryListRequest,
    fetchTerritoryNodeRequest,
    fetchTerritoryRecordRequest,
    claimTerritoryRecordRequest
} from 'requests/common/territory';

import {
    // 获取海的列表数据
    FETCH_TERRITORY_LIST,
    FETCH_TERRITORY_LIST_SUCCESS,
    FETCH_TERRITORY_LIST_FAIL,

    // 海 相关的 获取海的树形结构
    FETCH_TERRITORY_NODE,
    FETCH_TERRITORY_NODE_SUCCESS,
    FETCH_TERRITORY_NODE_FAIL,

    // 获取某个海的 record list
    FETCH_TERRITORY_RECORD_LIST,
    FETCH_TERRITORY_RECORD_LIST_SUCCESS,
    FETCH_TERRITORY_RECORD_LIST_FAIL,

    // 领取记录
    CLAIM_TERRITORY_RECORD,
    CLAIM_TERRITORY_RECORD_SUCCESS,
    CLAIM_TERRITORY_RECORD_FAIL
} from 'redux/action-types';

export let defaultState = I.fromJS({
    objName: null,
    data: [],
    offset: 0,
    fetching: false,
    model: {},
    territory_list: []
});

export default createReducer(I.fromJS(defaultState), {
    [FETCH_TERRITORY_LIST_SUCCESS](state, action){
        let { objName } = action;
        let { model_list } = action.result.body;
        let model = null;
        if (model_list) {
            model_list.forEach(v => {
                let { type_name } = v;
                if (type_name === objName) {
                    model = v;
                }
            });
            if (model) {
                return state.set('model', I.fromJS(model));
            }
            return state
                .set('model', I.fromJS({}))
                .set('territory_list', I.fromJS([]));
        }
        return state;
    },
    [FETCH_TERRITORY_NODE_SUCCESS](state, action){
        let { territory_list } = action.result.body;
        if (territory_list) {
            return state.set('territory_list', I.fromJS(territory_list));
        }
        return state;
    },
    [FETCH_TERRITORY_RECORD_LIST](state){
        return state.set('fetching', true);
    },
    [FETCH_TERRITORY_RECORD_LIST_SUCCESS](states, action){
        let state = states;
        // order_by
        // order_flag 海不支持排序 这两个是为了兼容切换海和标准对象的
        let param = {
            order_by: 'updated_at',
            order_flag: 'DESC',
            offset: action.params.offset,
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
            }
        }
        return state.set('param', param)
            .set('objName', action.objName)
            .set('offset', action.result.body.global_offset)
            .set('fetching', false);
    },
    [FETCH_TERRITORY_RECORD_LIST_FAIL](state){
        return state.set('fetching', false);
    },
    [CLAIM_TERRITORY_RECORD_SUCCESS](state, action){
        let { record_id } = action;
        let { code } = action.result;
        if (code === 0) {
            let index = state.get('data').findIndex(d => d.get('id') === record_id);
            if (index >= 0) {
                return state.deleteIn(['data', index]);
            }
        }
        return state;
    }
});

// 获取海的列表数据
export function fetchTerritoryList(objName) {
    return {
        objName,
        types: [FETCH_TERRITORY_LIST, FETCH_TERRITORY_LIST_SUCCESS, FETCH_TERRITORY_LIST_FAIL],
        promise: fetchTerritoryListRequest()
    };
}

// 获取海的树形结构
export function fetchTerritoryNode(model_id) {
    return {
        types: [FETCH_TERRITORY_NODE, FETCH_TERRITORY_NODE_SUCCESS, FETCH_TERRITORY_NODE_FAIL],
        promise: fetchTerritoryNodeRequest(model_id)
    };
}

// 获取某个海的列表数据
export function fetchTerritoryRecord(objName, territory_id, params) {
    return {
        objName,
        params,
        types: [FETCH_TERRITORY_RECORD_LIST, FETCH_TERRITORY_RECORD_LIST_SUCCESS, FETCH_TERRITORY_RECORD_LIST_FAIL],
        promise: fetchTerritoryRecordRequest(territory_id, params)
    };
}
// 领取记录
export function claimTerritoryRecord(record_id) {
    return {
        record_id,
        types: [CLAIM_TERRITORY_RECORD, CLAIM_TERRITORY_RECORD_SUCCESS, CLAIM_TERRITORY_RECORD_FAIL],
        promise: claimTerritoryRecordRequest(record_id)
    };
}

