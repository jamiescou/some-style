/**
 * Created by listen1013 on 17/3/24.
 * 所有标准对象的列表页都使用这一份数据,页面上同时只存在一份 listview
 * 一个 listview 包含 list 的数据和 filter 对象的数据
 * 页面中先获取 filter 的数据,然后通过 filter 的数据中的筛选条件再去请求 list 的数据
 * 这里是面向业务页面开发的,不关心里面存储的具体的业务对象是啥,只是存储的 listview 这个页面的数据
 */

import {combineReducers} from 'redux-immutable';

import list from './list';
import filter from './filter';
import hash from './setting-hash';

export default combineReducers({
    list,
    filter,
    hash
});
