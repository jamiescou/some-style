/**
 * Created by chenmeng on 17/08/03.
 */
import I from 'immutable';
import { createReducer } from 'redux/creator';

import {
    fetchCalendarListRequest,
    fetchCalendarDataRequest,
    createCalendarRequest,
    updateCalendarRequest,
    deleteCalendarRequest
} from 'requests/common/calendar';

import {
    // 获取日程事件列表数据
    FETCH_CALENDAR_LIST_DATA,
    FETCH_CALENDAR_LIST_DATA_SUCCESS,
    FETCH_CALENDAR_LIST_DATA_FAIL,

    // 获取单条日程事件数据
    FETCH_CALENDAR_DATA,
    FETCH_CALENDAR_DATA_SUCCESS,
    FETCH_CALENDAR_DATA_FAIL,

    // 创建日程事件
    CREATE_CALENDAR_EVENT,
    CREATE_CALENDAR_EVENT_SUCCESS,
    CREATE_CALENDAR_EVENT_FAIL,

    // 更新日程事件
    UPDATE_CALENDAR_EVENT,
    UPDATE_CALENDAR_EVENT_SUCCESS,
    UPDATE_CALENDAR_EVENT_FAIL,

    // 删除日程事件
    DELETE_CALENDAR_EVENT,
    DELETE_CALENDAR_EVENT_SUCCESS,
    DELETE_CALENDAR_EVENT_FAIL
} from 'redux/action-types';

export let defaultState = I.fromJS({
});
export default createReducer(I.fromJS(defaultState), {
    [FETCH_CALENDAR_LIST_DATA_SUCCESS](state){
        return state;
    },
    [FETCH_CALENDAR_DATA_SUCCESS](state) {
        return state;
    },
    [CREATE_CALENDAR_EVENT_SUCCESS](state) {
        return state;
    },
    [UPDATE_CALENDAR_EVENT_SUCCESS](state) {
        return state;
    },
    [DELETE_CALENDAR_EVENT_SUCCESS](state) {
        return state;
    }
});

// 获取日程事件列表
export function fetchCalendarList(objName) {
    return {
        types: [FETCH_CALENDAR_LIST_DATA, FETCH_CALENDAR_LIST_DATA_SUCCESS, FETCH_CALENDAR_LIST_DATA_FAIL],
        promise: fetchCalendarListRequest(objName)
    };
}
// 获取单条日程事件
export function fetchCalendarData(objName) {
    return {
        types: [FETCH_CALENDAR_DATA, FETCH_CALENDAR_DATA_SUCCESS, FETCH_CALENDAR_DATA_FAIL],
        promise: fetchCalendarDataRequest(objName)
    };
}

// 创建日程事件
export function createCalendar(objName) {
    return {
        types: [CREATE_CALENDAR_EVENT, CREATE_CALENDAR_EVENT_SUCCESS, CREATE_CALENDAR_EVENT_FAIL],
        promise: createCalendarRequest(objName)
    };
}

// 编辑日程事件
export function updateCalendar(objName) {
    return {
        types: [UPDATE_CALENDAR_EVENT, UPDATE_CALENDAR_EVENT_SUCCESS, UPDATE_CALENDAR_EVENT_FAIL],
        promise: updateCalendarRequest(objName)
    };
}

// 删除日程事件
export function deleteCalendar(objName) {
    return {
        types: [DELETE_CALENDAR_EVENT, DELETE_CALENDAR_EVENT_SUCCESS, DELETE_CALENDAR_EVENT_FAIL],
        promise: deleteCalendarRequest(objName)
    };
}
