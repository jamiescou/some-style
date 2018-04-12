/**
 * 可能要换一个位置,探究一下.
 */
import _ from 'lodash';
import I, { isImmutable } from 'immutable';
const systemFields = [
    'version',
    'id',
    'permission'
];

function spliteArrayPerTwo(array) {
    if (!array instanceof Array) {
        return [];
    }
    let result = [];
    for (let i = 0, len = array.length; i < len; i += 2) {
        result.push(array.slice(i, i+2));
    }

    return result;
}

// 获取必填字段
function getRequire(schema){
    let result = [];
    _.map(schema, v => {
        if (!v.get('nullable')) {
            result.push(v);
        }
    });
    return result;
}

// 获取需要渲染的字段
function checkField(schema){
    let result = getRequire(schema);

    _.map(result, v => {
        delete schema[v.get('name')];
    });
    _.map(schema, v => {
        result.push(v);
    });
    return result;
}

// 获取可编辑字段
function filterWriteAble(schema){
    let result = {};
    schema.map(v => {
        if (v.get('writable')){
            result[v.get('name')] = v;
        }
    });
    return result;
}


// 检查是否为系统字段
function checkIsSystemField(key) {
    if (systemFields.indexOf(key) !== -1) {
        return true;
    }
    return false;
}

// 检查编辑状态是否可用
function checkEditable(_data){
    let data = _data;
    if (!isImmutable(data)) {
        data = I.fromJS(data);
    }
    let isEditable = data.getIn(['permission', 'updatable']);
    return isEditable;
}

// 检查是否可以删除
function checkDelable(_data){
    let data = _data;
    if (!isImmutable(data)) {
        data = I.fromJS(data);
    }
    let isDeletable  =  data.getIn(['permission', 'deletable']);
    return isDeletable;
}

// 检查是否可以transfer
function checkTransferable(_data){
    let data = _data;
    if (!isImmutable(data)) {
        data = I.fromJS(data);
    }
    let transferable  =  data.getIn(['permission', 'transferable']);
    return transferable;
}

export default {
    getRequire,
    spliteArrayPerTwo,
    checkEditable,
    checkDelable,
    checkTransferable,
    checkField,
    filterWriteAble,
    checkIsSystemField
};
