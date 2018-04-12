/**
 * 用来格式化标准对象提交的数据
 * export formatValueBySchema(value, schema), filterFormatValueByScheme(data) funs
 * 前端为了更好的做一些限制, 先用formatValueBySchema格式化数据, 再用filterFormatValueByScheme过滤的一些问题字段
 */
import _ from 'lodash';
import moment from 'moment';
import { trim } from 'utils/dom';
import { asYouType } from 'libphonenumber-js';
import { isImmutable } from 'immutable';


let Types = {};
Types.textType = (value) => {
    return trim(value);
};


Types.textareaType = (value) => {
    return trim(value);
};

Types.emailType = (param) => {
    let value = trim(param);
    if (!value) {
        return null;
    }
    return value;
};

Types.picklistType = (value) => {
    let key;
    if (value === -1) {
        key = null;
    } else if (!trim(value)){
        key = null;
    } else {
        key = value;
    }
    return key;
};
Types.comboxType = (value) => {
    let key;
    if (value === -1) {
        key = null;
    } else if (!trim(value)){
        key = null;
    } else {
        key = value;
    }
    return key;
};



Types.checkboxType = (value) => {
    if (typeof value === 'string'){
        let val = value.toLowerCase();
        if (val === 'true') {
            return true;
        }
        if (val === 'false'){
            return false;
        }
    }
    return value;
};

Types.percentType = (value) => {
    let result = Number(value);
    if (_.isNaN(result)){
        result = 0;
    }
    return result;
};

Types.dateType = (value) => {
    let reg = /^-?[0-9]*$/;
    let result = value;
    if (reg.test(value)) {
        console.log('reg.test(value)', reg.test(value), value);
        let timestamp = value ? parseInt(value) : Date.parse(new Date());
        result = moment(timestamp).utcOffset(0).format('YYYY-MM-DDTHH:mm:ss') + 'Z';
    } else {
        result = undefined;
    }
    return result;
};

Types.datetimeType = (value) => {

    let reg = /^-?[0-9]*$/;
    let result = value;

    if (reg.test(value)) {
        let timestamp = value ? parseInt(value) : Date.parse(new Date());
        result = moment(timestamp).utcOffset(0).format('YYYY-MM-DDTHH:mm:ss') + 'Z';
    }

    return result;
};

Types.timeType = (value) => {

    let reg = /^-?[0-9]*$/;
    let result = value;

    if (reg.test(value)) {
        let timestamp = value ? parseInt(value) : Date.parse(new Date());
        result = moment(timestamp).utcOffset(0).format('YYYY-MM-DDTHH:mm:ss') + 'Z';
    }

    return result;
};

Types.phoneType = (param) => {
    let value = trim(param);

    if (value === '') {
        return null;
    }
    let phone = new asYouType();
    phone.input(value);
    if (phone.national_number === '') {
        return null;
    }

    return `+${phone.country_phone_code} ${phone.national_number}`;
};

Types.integerType = (value) => {
    let number = parseInt(value);
    if (!isNaN(number)) {
        return number;
    }
};

Types.urlType = (value) => {
    if (value) {
        return value;
    }
    return null;
};

Types.addressType = (value) => {

    let emptyAddress = {
        country: null,
        state: null,
        city: null,
        street: null
    };


    if (!value) { return emptyAddress; }
    // 获取值对应下标
    if (typeof value === 'string') {
        return emptyAddress;
    }

    if (typeof value === 'object') {
        for (let key in emptyAddress) {
            if (!value.hasOwnProperty(key)) {
                value[key] = '';
            }
        }
        return value;
    }

    return emptyAddress;
};

Types.currencyType = (value) => {
    let defaultValue = {
        symbol: null,
        value: null
    };
    // 如果value不存在.或者为null,那么只返回undefined
    if (!value) {
        return defaultValue;
    }

    let currency = {};

    /**
     * 当value结构为{
     *  currency,
     *  value
     * }
     */
    if (_.isObject(value)) {
        currency = value;
    }

    currency.value = parseFloat(currency.value);

    if (isNaN(currency.value)) {
        currency.value = 0;
    }

    if (currency.symbol === -1 || !currency.symbol || !currency.hasOwnProperty('symbol')) {
        currency = defaultValue;
    }

    return currency;
};

Types.mpicklistType = (value) => {
    let result = null;

    if (_.isArray(value)){
        result = value.join(';');
    }
    if (_.isString(value) && value) {
        result = value;
    }

    return result;
};

Types.doubleType = (value) => {
    let doubleValue = parseFloat(value);
    if (isNaN(doubleValue)) {
        doubleValue = 0;
    }
    return doubleValue;
};

Types.lookupType = (value) => {
    let result = null;

    if (value && value.result) {
        result = value.result.join('');
    }

    if (typeof value === 'string') {
        result = value;
    }
    if (!trim(value)) {
        result = null;
    }
    return result;
};

Types.fileType = (fileObject) => {
    // 这里分为对file字段的操作的情况 与 无操作的情况
    // 有操作的时候.fileObject会传入dom的file结构.区别加入了fileObject.operation = 'update'
    // 无操作的时候.就是后端给的数据结构
    if (!fileObject) {
        return undefined;
    }
    let result = {};
    console.log('fileObject', fileObject);
    if (fileObject.operation === 'update') {
        result = {
            filename: fileObject.name,
            size: fileObject.size,
            url: fileObject.url
        };
    } else {
        result = fileObject;
    }
    return result;
};
Types.hierarchyType = (value) => {
    let result = null;
    if (_.isArray(value)) {
        if (value.length === 1) {
            result = value[0];
        }
    }
    if (typeof value === 'string') {
        result = value;
    }

    if (_.isObject(value)) {
        result = value.result[0];
    }

    if (!trim(result)) {
        result = null;
    }
    return result;
};
Types.masterType = (value) => {
    let result = null;
    if (_.isArray(value)) {
        if (value.length === 1) {
            result = value[0];
        }
    }
    if (typeof value === 'string') {
        result = value;
    }

    if (_.isObject(value)) {
        result = value.result[0];
    }

    if (!trim(result)) {
        result = null;
    }
    return result;
};

function formatValueBySchema(_value, _schema) {
    let value = _value;
    let schema = _schema;
    let result;
    if (isImmutable(_value)) {
        value = _value.toJS();
    }
    if (isImmutable(_schema)) {
        schema = _schema.toJS();
    }
    try {
        if (typeof value === 'undefined' || typeof schema ==='undefined') {
            throw new Error('formatValueBySchema need two params');
        }
        let type = schema.type;
        let formatMethod = Types[`${type}Type`];
        if (formatMethod) {
            result = formatMethod(value, schema);
        } else {
            result = value;
        }
    } catch (e) {
        console.log('formatValueBySchema error', e.message);
    }
    if (typeof result === 'string') {
        result = trim(result) ? result : null;
    }
    return result;
}

/**
 * 过淲掉数据中undefined的属性.
 * @param  {[type]} data   [数据对象]
 * @param  {[type]} schema [schema对象]
 * @return {[type]}        [过滤后的数据]
 */
function filterFormatValueByScheme(data) {
    let result = {};
    if (typeof data !== 'object'){
        return result;
    }
    for (let key in data) {
        if (data.hasOwnProperty(key)) {
            if (typeof data[key] !== 'undefined'){
                result[key] = data[key];
            }
        }
    }

    return result;
}

export default {
    formatValueBySchema,
    filterFormatValueByScheme
};
