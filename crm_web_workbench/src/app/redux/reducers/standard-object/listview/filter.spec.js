import expect from 'expect';
import I from 'immutable';

import * as types from 'redux/action-types';
import reducer, { defaultState } from './filter';

describe('standard-object listview filter reducers', () => {
    it('should return the initial state', () => {
        expect(reducer(undefined, {})).toEqual(defaultState);
    });

    it('should handle fetch filter data success', () => {
        let result = {body: {name: 'cm', age: 18}};
        // 第一个参数是初始化的 store 可以指定,不指定就是默认值,可以根据测试环境自行调整
        // 第二个参数是一个 action 相当于输入
        let data = reducer(defaultState, {
            type: types.FETCH_FILTER_DATA_SUCCESS,
            result: result
        }).get('data');
        expect(data).toEqual(I.fromJS(result.body));
    });
});
describe('standard-object listview filter reducers', () => {
    it('should handle create filter data success', () => {
        let result = {
            body: {
                id: '2',
                view_filter: {
                    name: 'cm'
                }
            }
        };
        let data = reducer(I.fromJS({data: {view_filters: {}}}), {
            type: types.CREAT_FILTER_DATA_SUCCESS,
            result: result
        }).get('data');
        let obj = data.getIn(['view_filters', '2', 'name']);
        expect(obj).toBe('cm');
    });
});
describe('standard-object listview filter reducers', () => {
    it('should handle update filter data success', () => {
        let result = {
            body: {
                id: '2',
                view_filter: {
                    name: 'cm'
                }
            }
        };
        let data = reducer(I.fromJS({data: {view_filters: {2: 'haha'}}}), {
            type: types.UPDATE_FILTER_DATA_SUCCESS,
            result: result
        }).get('data');
        let obj = data.getIn(['view_filters', '2', 'name']);
        expect(obj).toBe('cm');
    });
    it('should handle update filter data ("id" does not exist)', () => {
        let result = {
            body: {
                id: '5',
                view_filter: {
                    name: 'cm'
                }
            }
        };
        let data = reducer(I.fromJS({data: {view_filters: {2: 'sure'}}}), {
            type: types.UPDATE_FILTER_DATA_SUCCESS,
            result: result
        }).get('data');
        let obj = data.getIn(['view_filters', '2']);
        expect(obj).toBe('sure');
    });
});
describe('standard-object listview filter reducers', () => {
    it('should handle delete filter data success', () => {
        let result = {
            body: {
                id: '2'
            }
        };
        let data = reducer(I.fromJS({data: {view_filters: {2: 'cm'}}}), {
            type: types.DELETE_FILTER_DATA_SUCCESS,
            result: result
        }).get('data');
        let obj = data.getIn(['view_filters', '2']);
        expect(obj).toBeFalsy();
    });
    it('should handle delete data ("id" does not exist)', () => {
        let data = reducer(I.fromJS({data: {view_filters: {2: 'cm'}}}), {
            type: types.DELETE_FILTER_DATA_SUCCESS,
            result: {body: {id: '4'}}
        }).get('data');
        let obj = data.getIn(['view_filters', '2']);
        expect(obj).toBe('cm');
    });
});
