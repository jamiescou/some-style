import _ from 'lodash';
import superagent from 'superagent';
import Cookies from 'cookies-js';
import { eventEmitter } from '../utils/event';
import errorCode from '../constants/error-code.json';

/**
 * @this {function}
 * @param {string} ops.type
 * @param {string} ops.dataType
 * @param {string} ops.contentType
 * @param {string} ops.url
 * @param {json} ops.data
 * @param {function} ops.error
 * @param {function} ops.success
 */
let timer = null;
let requestMap = new Map();
export const ajax = (ops = {}, responseCb) => {

    const options = {
        url: ops.url,
        type: (ops.type || 'GET').toUpperCase(),
        headers: ops.headers,
        dataType: ops.dataType || 'json',
        data: ops.data || {},
        contentType: ops.contentType || 'application/x-www-form-urlencoded',
        error: ops.error,
        success: ops.success
    };

    let request = superagent(options.type, options.url)
        .set('X-Token', Cookies.get('_accessToken') || '')
        .set('Content-Type', options.contentType)
        .accept('application/json')
        .on('error', (err) => {
            return options.error ? options.error(err) : null;
        });

    // 请求参数
    if (options.type === 'GET') {
        request.query(options.data);
    } else {
        request.send(options.data);
    }

    if (options.headers) {
        for (let key in options.headers) {
            request.set(key, options.headers[key]);
        }
    }

    return request.end((err, res) => {
        if (err) {
            return options.error ? options.error(err, res) : null;
        }

        if (!res.body) {
            return options.error ? options.error(null, null) : null;
        }

        let code = res.body.code;

        // 刷新或者退出登录
        if ([103, 104].indexOf(code) !== -1) {
            // 需要在token刷新之后发送的请求
            // 为了区分相同url,导致的key相同 
            let timestamp = new Date().getTime();
            requestMap.set(ops.url + timestamp, {ops, responseCb});
            return refresh(ops, responseCb);
        } else if ([101, 102, 105].indexOf(code) >= 0) {
            eventEmitter.emit('loginExpired');
            // 这里必须用error去调用 不然会出现redux层的报错
            return options.error(res.body);
        }

        if (responseCb) {
            return responseCb(res, options.success, options.error);
        }
        if (res.status === 200 && (res.body.response === 'success' || code === 0)) {
            return options.success ? options.success(res.body) : null;
        }
        let errors = {};
        // Todo: 这里需要格式化出来用户可以看明白的信息
        let buildFieldError = (valid = res.body) => {
            let fieldError = [];
            let topError = [];
            let { validations = [] } = valid;
            validations.forEach(v => {
                // 定位到字段级别的错误
                if (v.position) {
                    fieldError.push({
                        msg: errorCode[v.code],
                        ...v
                    });
                } else {
                    // position不存在,的顶级错误
                    topError.push({
                        msg: errorCode[v.code],
                        ...v
                    });
                }
            });
            if (!fieldError.length) {
                fieldError = null;
            }
            if (!topError.length) {
                topError = null;
            }
            return {fieldError, topError};
        };
        let ErrorTypes = buildFieldError(res.body);
        errors.message = res.body.message || res.body.msg || `code: ${code}, message: ${errorCode[code]}`;
        errors.fields = ErrorTypes.fieldError;
        errors.topError = ErrorTypes.topError;
        errors.code = code;
        errors.body = res.body;
        console.log('errors', errors);
        return options.error(errors);

        // return options.error ? options.error(err, res) : null;
    });
};

// 刷新token 确保只发一次刷新token的请求
const refresh = () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
        let refreshToken = Cookies.get('_refreshToken') || '';
        let request = superagent('PUT', '/tenant-gateway/tenant/refresh_token')
            .set('Content-Type', 'application/json')
            .set('X-Token', Cookies.get('_accessToken') || '')
            .accept('application/json');

        let data = {refresh_token: refreshToken};

        request.send(JSON.stringify(data));
        return request.end((err, res) => {
            if ( res.status === 200 && res.body.body) {
                let accessExpires = 24 * 7 * 3600;
                Cookies.set('_accessToken', res.body.body.access_token, { expires: accessExpires });
                Cookies.set('_refreshToken', res.body.body.refresh_token, { expires: accessExpires });
                refreshRequest();
            } else {
                eventEmitter.emit('loginExpired');
            }
        });
    }, 500);
};

// token 刷新之后，继续请求页面所需数据
const refreshRequest = () => {
    for (let value of requestMap.values()) {
        ajax(value.ops, value.responseCb);
    }
    requestMap.clear();
};

export const upload = (options) => {
    let request = superagent.post(options.url);
    request.set('X-Token', Cookies.get('_accessToken') || '');

    for (let name in options.data) {
        request = request.field(name, options.data[name]);
    }

    return request.attach('upload', options.file)
        .on('progress', e => {
            return options.progress ? options.progress(e) : null;
        })
        .end((err, res) => {
            if (err) {
                return options.error ? options.error(err, res) : null;
            }

            if (res.status >= 200 && res.status < 300) {
                return options.success ? options.success(res.body) : null;
            }

            return options.error ? options.error(err, res) : null;
        });
};

export const encodeObjectToQuery = data => {
    let obj = data || {};
    let params = [];
    _.forEach(obj, (val, key) => {
        if (_.isArray(val) && val.length > 0) {
            params.push(val.map((v) => `${key}=${encodeURIComponent(v)}`).join('&'));
        } else if (_.isString(val) || _.isNumber(val) || _.isBoolean(val)) {
            if (val && val !== '') {
                params.push(`${key}=${encodeURIComponent(val)}`);
            }
            if (val === 0 || val === false) {
                params.push(`${key}=${encodeURIComponent(val)}`);
            }
        } else if (_.isObject(val) && !_.isEmpty(val)) {
            params.push(`${key}=${JSON.stringify(val)}`);
        }
    });
    return params.join('&');
};
