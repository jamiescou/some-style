/**
 * data中,存放每一个相关对象的 对象名字
 * {
 *     data: {
 *     }
 * }
 */


import I from 'immutable';
import { createReducer, createAction } from 'redux/creator';
import _ from 'lodash';
import {
    FETCH_RELATED_DATA,
    FETCH_RELATED_DATA_SUCCESS,
    FETCH_RELATED_DATA_FAIL
} from 'redux/action-types';
import { fetchDataRequest, fetchOneRequest } from 'requests/common/standard-object';

let defaultState = I.fromJS({
});

const isAvailable = param => {
    let isUnavailable =  _.isNull(param) || _.isUndefined(param);
    return !isUnavailable;
};

export default createReducer(I.fromJS(defaultState), {
    [FETCH_RELATED_DATA_SUCCESS](state, action) {
        let { objName, id, result } = action;
        let lists = result.body.objects;

        let finalState = state;
        if (!isAvailable(objName)) {
            return state;
        }
        if (!id) {
            let tmpResult = {};
            _.map(lists, v => {
                tmpResult[v.id] = v;
            });

            if (state.get(objName)) {
                finalState = state.mergeIn([objName], I.fromJS(tmpResult));
            } else {
                finalState = state.set(objName, I.fromJS(tmpResult));
            }
        } else if (state.get(objName)) { // 更新单条数据
            finalState = state.setIn([objName, id], I.fromJS(result));
        } else { // 没有这个对象的列表.加进去.
            let list = {};
            list[id] = result;
            finalState = state.set(objName, I.fromJS(list));
        }

        return finalState;
    }
});

/**
 * 处理list数据集合,按照外键objName进行分类.分别发送请求,获取相应数据
 * @param  {[type]} meta  [description]
 * @param  {[type]} list) [{},{},{}]
 * @return {[type]}       [description]
 */
export const fetchRelatedObjectsData =(meta, list, relatedKeys=['lookup', 'master', 'external_id', 'hierarchy']) => (dispatch) => {
    let columns = meta.schema || {};
    // 需要关联的字段数组
    let relatedInfoArray = _.filter(columns, (v) => {
        return relatedKeys.indexOf(v.type) !== -1;
    });

    let params = {};
    // 遍历meta为lookup//master的meta数组
    _.map(relatedInfoArray, k => {
        _.map(list, v => {

            let fieldValue = v[k.name];

            if (!fieldValue) {
                return ;
            }

            // related object name
            let relatedObjName = '';
            // realted object id
            let realtedObjId = '';

            if (relatedKeys.indexOf(k.type) !== -1) {
                relatedObjName = k.object_name;
                realtedObjId = fieldValue;
            }

            if (!params[relatedObjName]) {
                params[relatedObjName] = [];
            }
            if (realtedObjId) {
                params[relatedObjName].push(realtedObjId);
            }
        });

    });

    // 分别请求数据
    _.map(params, (v, key) => {
        if (v && key && v.length !== 0) {
            dispatch(fetchRelatedDataListByIds(key, _.uniq(v)));
        }
    });
};

/**
 * 在related-editor中,每次编辑或者onChange都会触发
 * @type {[type]}
 */
export const updateRelatedList = createAction(FETCH_RELATED_DATA_SUCCESS, 'objName', 'result');

/**
 * 获取一组相关数据 
 * 如果传入的params是长度为1,则优化使用单条数据请求
 * @param  {[string]} objName [对象名称]
 * @param  {[array]} params  [id集合]
 * @return {[type]}         [description]
 */
export function fetchRelatedDataListByIds(objName, _params) {
    let params = _params;
    if (['string', 'number'].indexOf(typeof params) !== -1) {
        return fetchRelatedDataListById(objName, params);
    }
    params = _.filter(params, v => v);
    let idArray = {
        field: 'id',
        in_list: params ? params : []
    };

    let result = {
        in: JSON.stringify(idArray)
    };
    return {
        objName,
        types: [FETCH_RELATED_DATA, FETCH_RELATED_DATA_SUCCESS, FETCH_RELATED_DATA_FAIL],
        promise: fetchDataRequest(objName, result)
    };
}

/**
 * 获取一条相关数据
 * @param  {[type]} objName [对象名称]
 * @param  {[type]} id  id
 * @return {[type]}         [description]
 */
function fetchRelatedDataListById(objName, id) {
    return {
        objName,
        id,
        types: [FETCH_RELATED_DATA, FETCH_RELATED_DATA_SUCCESS, FETCH_RELATED_DATA_FAIL],
        promise: fetchOneRequest(objName, id)
    };
}
