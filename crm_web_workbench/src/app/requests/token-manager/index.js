
import { ajax as defaultAjax } from '../index';
import requestConfig from '../config';


const selfConfig = {};

export const config  =  Object.assign(selfConfig, requestConfig);


function makeUrl(url) {
    return `/tenant-gateway/${url}`;
}


export const ajax = (opts = {}) => {
    opts.url = makeUrl(opts.url);
    return defaultAjax(opts);
};
