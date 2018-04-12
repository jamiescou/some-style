/**
 * Created by zzm on 17/8/02.
 */

import I from 'immutable';
import { createReducer } from 'redux/creator';

import { fetchSearchNavRequest, fetchSearchDataRequest } from 'requests/common/search';
import {
    FETCH_SEARCH_NAV,
    FETCH_SEARCH_NAV_SUCCESS,
    FETCH_SEARCH_NAV_FAIL,

    FETCH_SEARCH_DATA,
    FETCH_SEARCH_DATA_SUCCESS,
    FETCH_SEARCH_DATA_FAIL
} from 'redux/action-types';

export let defaultState = I.fromJS({
    nav: {body: {objects: []}},
    list: {body: {objects: []}},
    offset: 0
});

export default createReducer(I.fromJS(defaultState), {
    [FETCH_SEARCH_NAV_SUCCESS](state, action) {
        return state.set('nav', I.fromJS(action.result.body.objects.sort()));
    },
    [FETCH_SEARCH_DATA](state) {
        return state.set('loading', true);
    },
    [FETCH_SEARCH_DATA_SUCCESS](states, action) {
        let state = states;
        let param = {
            offset: action.param.offset,
            load: false,
            loading: false
        };
        if (parseInt(param.offset) === 0){
            state = state.set('list', I.fromJS(action.result.body.objects));
        } else {
            let body = action.result.body.objects;
            if (body && body.length > 0 && body.length === parseInt(action.param.limit)) {
                state = state.set('list', state.get('list').concat(I.fromJS(body)));
            } else if (body && body.length > 0 && body.length < parseInt(action.param.limit)) {
                state = state.set('list', state.get('list').concat(I.fromJS(body)));
                param.load = true;
            } else {
                param.load = true;
            }
        }
        return state.set('param', param)
            .set('objName', action.objName)
            .set('offset', action.result.body.global_offset)
            .set('loading', false);
    },
    [FETCH_SEARCH_DATA_FAIL](state) {
        return state.set('fetching', false);
    }
});

// 获取 搜索左侧nav
export function fetchSearchNav(param) {
    return {
        types: [FETCH_SEARCH_NAV, FETCH_SEARCH_NAV_SUCCESS, FETCH_SEARCH_NAV_FAIL],
        promise: fetchSearchNavRequest(param)
    };
}
// 获取 搜索右侧内容
export function fetchSearchData(objName, param) {
    return {
        objName,
        param,
        types: [FETCH_SEARCH_DATA, FETCH_SEARCH_DATA_SUCCESS, FETCH_SEARCH_DATA_FAIL],
        promise: fetchSearchDataRequest(objName, param)
    };
}

