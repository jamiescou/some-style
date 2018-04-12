/*
 * 这个文件放置海和视图筛选器的一些方法
 */
/**
 * transferToTree 将海的数据转为树状结构的数据
 * @param {*} data 传入的海数据
 * @param {*} territory_id string e.g. 'territory_id'
 * @param {*} parent_id string e.g. 'parent_id'
 * @param {*} children 子集的key值 string e.g. 'children'
 */
import I from 'immutable';
/**
 * 
 * @param {*} data 将immutable类型转换为原生的类型
 */
function transferData(data) {
    let result;
    if (I.isImmutable(data)) {
        result = data.toJS();
    } else {
        result = data;
    }
    return result;
}

function transferToTree(data, territory_id, parent_id, children) {
    let result = transferData(data);
    let array = [];
    let hash = {};
    let len = result.length;
    for (let i = 0; i < len; i++) {
        hash[result[i][territory_id]] = result[i];
    }
    for (let j = 0; j < len; j++) {
        let value = result[j];
        let hashParent = hash[value[parent_id]];
        if (hashParent) {
            if (!hashParent[children]) {
                hashParent[children] = [];
            }
            hashParent[children].push(value);
        } else {
            array.push(value);
        }
    }
    return I.fromJS(array);
}

export default {
    transferToTree
};
