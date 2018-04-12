import expect from 'expect';
import I from 'immutable';

import * as types from 'redux/action-types';
import reducer, { defaultState } from './data';

describe('standard-object detailview reducers', () => {
    it('should return the initial state', () => {
        expect(reducer(undefined, {})).toEqual(defaultState);
    });

    it('should handle fetch data success', () => {
        let result = {
            id: '1',
            name: 'a'
        };
        // 第一个参数是初始化的 store 可以指定,不指定就是默认值,可以根据测试环境自行调整
        // 第二个参数是一个 action 相当于输入
        let data = reducer(defaultState, {
            type: types.FETCH_DETAILVIEW_OBJECT_SUCCESS,
            result: result
        });
        expect(data).toEqual(I.fromJS(result));
    });
});
