/* eslint-disable */
const zone = require("./zone.json");

/**
 * 逐级查找值所在的数据下标.
 * @param  {[type]} data   [数据对象]
 * @param  {[type]} select [值]
 * @return {[type]}        [数组下标]
 */
function checkChildChecked (obj, select, indexArray = []) {
    let _indexArray = _.cloneDeep(indexArray);
    for (let i = 0 ;i < obj.length;i++) {
        _indexArray.push(i);
        if (obj[i].value === select) {
            return _indexArray;
        }

        let _array = _.cloneDeep(_indexArray);
        if (obj[i].children) {
            let inChild = checkChildChecked(obj[i].children, select, _array);
            if (inChild) {
                return inChild;
            }
            _indexArray.pop();
        } else {
            _indexArray.pop();
        }
    }
};

/**
 * 逐级查找值所在的数据下标.
 * @param  {[type]} _data   [数据对象]
 * @param  {[type]} _array [数据下标(Array)]
 * @return {[type]}        [值数组]
 */

function setCheckedByIndex (_data, _array, result = []) {
    if (_array && !_.isEqual(_array, []) && _data instanceof Array) {
        let index = _array.shift();
        if (_data[index].children) {
            setCheckedByIndex(_data[index].children, _array, result);
        } 
        result.push(_data[index]['value'])
    }
    return result;
};

function setValue (data) {
    let result = '';
    _.map(data.reverse(), v => {
        result += v;
    })
    return result;
};

//表单提交Address处理
function handleAddress(newParams) {
    let data = newParams.Address;
    if (data instanceof Array && data.length === 2){
        newParams['Address.city'] = data[0];
        newParams['Address.state'] = data[0];
        newParams['Address.country'] = data[1];
    } else if (data instanceof Array && data.length === 3) {
        newParams['Address.city'] = data[0];
        newParams['Address.state'] = data[1];
        newParams['Address.country'] = data[2];
    } else {
        newParams['Address.city'] = '';
        newParams['Address.state'] = '';
        newParams['Address.country'] = '';
    }
    delete newParams['Address'];
};

export default {
    zone,
    checkChildChecked,
    setCheckedByIndex,
    setValue,
    handleAddress
};
