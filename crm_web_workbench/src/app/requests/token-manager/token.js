/*
 * @author: hanxu 
 * @date: 2017-08-28 11:06:05 
 * @last modified by: hanxu 
 * @last modified time: 2017-08-28 11:06:05 
 * @description: 前端的token 管理工具
 * @description: 接口说明 http://wiki.meiqia.com/pages/viewpage.action?pageId=9995464#tenant-gateway接口-创建personalToken
 */

import { ajax } from './index';

export const getTokenList = () => () => {
    return new Promise((resolve, reject) => {
        ajax({
            url: 'personal_token/list',
            type: 'get',
            success: response => resolve(response),
            error: error => reject(error)
        });
    });
};
