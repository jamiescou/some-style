// import _ from 'lodash';
// import superagent from 'superagent';
import Cookies from 'cookies-js';
import { ajax } from './index';

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

const logout = () => {
    let data = JSON.stringify({source: 'web'});
    let Authorization = Cookies.get('_accountToken');
    return new Promise((resolve, reject) => {
        ajax({
            data: data,
            headers: {Authorization: Authorization},
            url: '/login/account/v1/sign_out',
            type: 'POST',
            success: response => {
                let expires = new Date();
                expires.setTime(expires.getTime() - 1); // 过期
                Cookies.set('_accountToken', '', {expires: expires});
                Cookies.set('_accessToken', '', {expires: expires});
                Cookies.set('_refreshToken', '', {expires: expires});
                // Cookies.set('_userId', '', {expires: expires});
                // window.location.href = '/signin';
                resolve(response);
            },
            error: error => {
                reject(error);
                let expires = new Date();
                expires.setTime(expires.getTime() - 1); // 过期
                Cookies.set('_accountToken', '', {expires: expires});
                Cookies.set('_accessToken', '', {expires: expires});
                Cookies.set('_refreshToken', '', {expires: expires});
                // Cookies.set('_userId', '', {expires: expires});
                // window.location.href = '/signin';
            }
        });
    });
};

const signout = () => {
    let data = JSON.stringify({source: 'web'});
    return new Promise((resolve, reject) => {
        ajax({
            data: data,
            url: '/tenant-gateway/tenant/signout',
            type: 'POST',
            success: response => {
                let expires = new Date();
                expires.setTime(expires.getTime() - 1); // 过期
                Cookies.set('_accessToken', '', {expires: expires});
                Cookies.set('_refreshToken', '', {expires: expires});
                // Cookies.set('_userId', '', {expires: expires});
                resolve(response);
            },
            error: error => {
                reject(error);
                let expires = new Date();
                expires.setTime(expires.getTime() - 1); // 过期
                Cookies.set('_accessToken', '', {expires: expires});
                Cookies.set('_refreshToken', '', {expires: expires});
                // Cookies.set('_userId', '', {expires: expires});
                // window.location.href = '/invite';
            }
        });
    });
};

const test = (phone) => {
    let data = JSON.stringify({source: 'web', phone: '+86 ' + phone});
    let accessToken = Cookies.get('_accessToken');
    return new Promise((resolve, reject) => {
        ajax({
            data: data,
            headers: {access_token: accessToken},
            url: '/tenant-gateway/tenant/invitation',
            type: 'POST',
            success: response => {
                resolve(response);
            },
            error: error => {
                reject(error);
            }
        });
    });
};
export default {
    logout,
    signout,
    test
};
