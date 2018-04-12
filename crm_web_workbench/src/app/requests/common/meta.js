/**
 * 元信息接口
 */

import { ajax, config } from './index';

export const fetchSchemaRequest = (objName) => () => {
    let version = config.version;
    let orgName = config.orgName;
    return new Promise((resolve, reject) => {
        ajax({
            url: `/dml/api/${version}/${orgName}/${objName}/meta/schema/`,
            type: 'GET',
            success: response => {
                let { body } = response;
                // 统一hierarchy字段的格式,与lookup,master字段一样
                for (let key in body) {
                    if (body[key] && body[key].type === 'hierarchy') {
                        body[key].object_name = objName;
                    }
                }
                return resolve(response);
            },
            error: error => reject(error)
        });
    });
};

export const fetchMetaRequest = (objName) => () => {
    let version = config.version || 'v1.0';
    let orgName = config.orgName || 'meiqia';
    return new Promise((resolve, reject) => {
        ajax({
            url: `/dml/api/${version}/${orgName}/${objName}/meta`,
            type: 'GET',
            success: response => resolve(response),
            error: error => reject(error)
        });
    });
};

export const fetchAllObjRequest = () => () => {
    let version = config.version || 'v1.0';
    return new Promise((resolve, reject) => {
        ajax({
            url: `/dml/api/${version}/tenant-name/all-metas?acl=true`,
            type: 'GET',
            success: response => resolve(response),
            error: error => reject(error)
        });
    });
};
