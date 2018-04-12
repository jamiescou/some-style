import expect from 'expect';

import I from 'immutable';

import * as types from 'redux/action-types';
import * as actions from './list';
import reducer, { defaultState } from './list';

describe('standard-object listview actions creators', () => {
    // 测试普通的 action
    it('should create an action equal FETCH_LIST_DATA_FAIL', () => {
        expect(actions.fetchListFail().type).toBe(types.FETCH_LIST_DATA_FAIL);
    });
});

// 成功获取列表数据
describe('standard-object listview reducers', () => {
    it('should return the initial state', () => {
        expect(reducer(undefined, {})).toEqual(defaultState);
    });

    it('should handle fetch list success', () => {
        let result = {body: {
            objects: [{name: 1, age: 2}],
            objName: 'leads',
            global_offset: 50,
            param: {
                order_by: 'updated_at',
                order_flag: 'DESC',
                offset: 0,
                load: false,
                view_filter_id: '123'
            }
        }};
        // let result = {body: {objects: null}}

        // 第一个参数是初始化的 store 可以指定,不指定就是默认值,可以根据测试环境自行调整
        // 第二个参数是一个 action 相当于输入
        let data = reducer(defaultState, {
            type: types.FETCH_LIST_DATA_SUCCESS,
            result: result,
            params: {
                offset: 0,
                order_by: 'updated_at',
                order_flag: 'DESC',
                view_filter_id: '123'
            },
            objName: 'leads'
            // params: {}
        });
        expect(data.get('data')).toEqual(I.fromJS(result.body.objects));
        expect(data.get('offset')).toBe(result.body.global_offset);
        expect(data.get('objName')).toBe(result.body.objName);
        expect(data.get('param')).toEqual(result.body.param);
    });

    it('should handle fetch list (body is true)', () => {
        let result = {body: {
            objects: [{id: 2, age: 2}],
            objName: 'leads',
            global_offset: 50,
            param: {
                order_by: 'updated_at',
                order_flag: 'DESC',
                offset: 50,
                load: false,
                view_filter_id: '123'
            }
        }};
        let data = reducer(I.fromJS({data: [{id: 1, age: 3}]}), {
            type: types.FETCH_LIST_DATA_SUCCESS,
            result: result,
            params: {
                offset: 50,
                order_by: 'updated_at',
                order_flag: 'DESC',
                view_filter_id: '123'
            },
            objName: 'leads'
            // params: {}
        });
        let index = data.get('data').findIndex(d => d.get('id') === result.body.objects[0].id);
        expect(data.getIn(['data', index, 'age'])).toBe(result.body.objects[0].age);
        expect(data.get('offset')).toBe(result.body.global_offset);
        expect(data.get('objName')).toBe(result.body.objName);
        expect(data.get('param')).toEqual(result.body.param);
    });

});

// // 创建数据
describe('standard-object listview reducers', () => {

    it('should handle create data success', () => {
        let result = {body: [{id: 1, age: 2}]};
        let data = reducer(I.fromJS({data: []}), {
            type: types.CREATE_DATA_SUCCESS,
            result: result
        }).get('data');
        let index = data.findIndex(d => d.get('id') === result.body[0].id);

        // expect(index >= 0).toBeTruthy(); // 这种写法也可以
        expect(index).toBeGreaterThan(-1);

    });
});


// 修改数据
describe('standard-object listview reducers', () => {
    it('should handle update data success', () => {
        let result = {body: {id: 1, age: 2}};
        let data = reducer(I.fromJS({data: [{id: 1, age: 3}]}), {
            type: types.UPDATE_DATA_SUCCESS,
            result: result,
            id: 1
        }).get('data');
        let index = data.findIndex(d => d.get('id') === 1);

        expect(data.getIn([index, 'age'])).toBe(result.body.age);
    });

    it('should handle update data ("id" does not exist)', () => {
        let result = {body: {id: 1, age: 3}};
        let data = reducer(I.fromJS({data: [{id: 1, age: 3}]}), {
            type: types.UPDATE_DATA_SUCCESS,
            result: result,
            id: 2 // 没有id=2 的数据
        }).get('data');
        expect(data.getIn([0, 'age'])).toBe(result.body.age);
    });
});

// 删除数据
describe('standard-object listview reducers', () => {
    it('should handle delete data success', () => {
        let data = reducer(I.fromJS({data: [{id: 1, age: 3}]}), {
            type: types.DELETE_DATA_SUCCESS,
            id: 1
        }).get('data');
        let index = data.findIndex(d => d.get('id') === 1);
        expect(index).toBe(-1);
    });

    it('should handle delete data ("id" does not exist)', () => {
        let data = reducer(I.fromJS({data: [{id: 1, age: 3}]}), {
            type: types.DELETE_DATA_SUCCESS,
            id: 7
        }).get('data');
        expect(data.getIn([0, 'age'])).toBe(3);
    });
});
