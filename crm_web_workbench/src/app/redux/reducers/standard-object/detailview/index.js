/**
 * Created by listen1013 on 17/3/24.
 * 所有标准对象的详情页都使用这一份数据,页面上同时只存在一份 detailview
 */

import {combineReducers} from 'redux-immutable';

import data from './data';

export default combineReducers({
    data
});
