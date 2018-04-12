/**
 * Created by listen1013 on 17/3/24.
 */

// 布局是伴随着页面来的,一个应用使用到的布局的情况同时只能存在一个,要么是 list 要么是 detail 要么是
export default [
    // 获取导航
    'FETCH_HEADER_NAV',
    'FETCH_HEADER_NAV_SUCCESS',
    'FETCH_HEADER_NAV_FAIL',
    // 获取对象全局配置
    'FETCH_OBJ_EXTENDS_CONFIG',
    'FETCH_OBJ_EXTENDS_CONFIG_SUCCESS',
    'FETCH_OBJ_EXTENDS_CONFIG_FAIL',
    // 获取 布局
    'FETCH_LAYOUT',
    'FETCH_LAYOUT_SUCCESS',
    'FETCH_LAYOUT_FAIL'
];
