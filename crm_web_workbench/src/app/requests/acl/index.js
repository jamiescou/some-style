import { ajax as defaultAjax } from '../index';

function makeUrl(url) {
    return `/acl/acl_admin/${url}`;
}

export const ajax = (opts = {}) => {
    opts.headers = {};
    opts.url = makeUrl(opts.url);
    let cb = (res, success) => {
        if (res.status >= 200 && res.status < 300) {
            return success ? success(res.body) : null;
        }
        success(res.body);
    };
    return defaultAjax(opts, cb);
};
