/**
 * 关于对象下数据team
 * {
 *     standard: {
 *         'id112312323123123':[
                {
                  "ent_id": "713f17ca614361fb257dc6741332caf2",
                  "object_name": "standard",
                  "record_id": "2b5b39f89997e4f8531bcefc6fab2f81",
                  "owner_id": "00001111222233334444555566667777",
                  "user_id": "617d7edc3589a11e797e5369a4bc725b",
                  "access_level": 1
                }
            ]
 *     }
 * }
 */

/**
 * data中,存放每一个相关对象的 对象名字
 * {
 *     data: {
 *     }
 * }
 */


import I from 'immutable';
import { createReducer } from 'redux/creator';
// import {
//     获根据userId获取manager
//     FETCH_USER_MANAGER_REQUEST,
//     FETCH_USER_MANAGER_REQUEST_SUCCESS,
//     FETCH_USER_MANAGER_REQUEST_FAIL,

//     // 获根据userId获取全部manager
//     FETCH_USER_ALL_MANAGER_REQUEST,
//     FETCH_USER_ALL_MANAGER_REQUEST_SUCCESS,
//     FETCH_USER_ALL_MANAGER_REQUEST_FAIL

// } from 'redux/action-types';


// import { getUserManager, getUserManagers } from 'requests/acl/manager';

let defaultState = I.fromJS({

});


export default createReducer(I.fromJS(defaultState), {

});
