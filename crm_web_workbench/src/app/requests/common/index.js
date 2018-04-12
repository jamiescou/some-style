import { ajax as defaultAjax, encodeObjectToQuery } from '../index';
import requestConfig from '../config';

const selfConfig = {};

export const ajax = (opts = {}) => {
    return defaultAjax(opts);
};

export const config  =  Object.assign(selfConfig, requestConfig);

// 复合字段排序处理
export const handleParam = params => {
    let order_flag = params.order_flag;
    params.curField = params.order_by;
    params.curFlag = params.order_flag;
    switch (params.order_by) {
    case 'Address':
        params.order_by = ['Address.city', 'Address.country', 'Address.state', 'Address.street'];
        params.order_flag = [order_flag, order_flag, order_flag, order_flag];
        break;
    case 'Amount':
    case 'Balance':
    case 'BillAmount':
    case 'Plan':
    case 'Result':
    case 'TotalPrice':
    case 'Sum':
        params.order_by = [`${params.order_by}.value`];
        params.order_flag = [order_flag];
        break;
    case 'Geolocation':
        params.order_by = ['Geolocation.latitude', 'Geolocation.longtitude'];
        params.order_flag = [order_flag, order_flag];
        break;
    default:
        break;
    }
    return encodeObjectToQuery(params);
};
