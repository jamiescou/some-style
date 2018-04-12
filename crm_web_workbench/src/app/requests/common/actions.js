/**
 * 获取对象的action
 */

import { ajax, config } from './index';

export const fetchObjActions = (objName) => () => {
    let version = config.version;
    let orgName = config.orgName;
    return new Promise((resolve, reject) => {
        ajax({
            url: `/dml/api/${version}/${orgName}/${objName}/actions`,
            type: 'GET',
            success: response => resolve(response),
            error: error => reject(error)
        });
    });
};

/**
 * 运行指定Action
 * @param  {[type]} actionId [description]
 * @param  {[type]} params   [description]
 * @return {[type]}          [description]
 */
export const fetchCustomerAction = (objName, actionId, type, params) => () => {
    let version = config.version;
    let orgName = config.orgName;
    return new Promise((resolve, reject) => {
        ajax({
            url: `/dml/api/${version}/${orgName}/${objName}/actions/run/${actionId}`,
            type,
            contentType: 'application/json',
            success: response => resolve(response),
            data: params,
            error: error => reject(error)
        });
    });
};
