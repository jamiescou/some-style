import { ajax, config } from './index';
// 获取 ViewFilter
export const fetchFilterRequest = (objName, param) => () => {
    let version = config.version;
    let orgName = config.orgName;
    let url = `/ddl/api/${version}/${orgName}/${objName}/view-filters`;
    return new Promise((resolve, reject) => {
        ajax({
            url: url,
            type: 'GET',
            data: param,
            success: response => resolve(response),
            error: error => reject(error)
        });
    });
};

// 创建 ViewFilter
export const createDataRequest = (objName, param) => () => {
    let version = config.version || 'v1.0';
    let orgName = config.orgName || 'meiqia';
    return new Promise((resolve, reject) => {
        ajax({
            url: `/ddl/api/${version}/${orgName}/${objName}/view-filters`,
            type: 'POST',
            dataType: 'json',
            data: JSON.stringify(param),
            success: response => {
                return resolve(response);
            },
            error: error => {
                return reject(error);
            }
        });
    });
};

// 修改 ViewFilter
export const updateDataRequest = (objName, param, vid) => () => {
    let version = config.version || 'v1.0';
    let orgName = config.orgName || 'meiqia';
    return new Promise((resolve, reject) => {
        ajax({
            url: `/ddl/api/${version}/${orgName}/${objName}/view-filters/${vid}`,
            type: 'PUT',
            dataType: 'json',
            data: JSON.stringify(param),
            success: response => resolve(response),
            error: error => reject(error)
        });
    });
};

// 删除 ViewFilter
export const deleteDataRequest = (objName, vid) => () => {
    let version = config.version || 'v1.0';
    let orgName = config.orgName || 'meiqia';
    return new Promise((resolve, reject) => {
        ajax({
            url: `/ddl/api/${version}/${orgName}/${objName}/view-filters/${vid}`,
            type: 'DELETE',
            data: {vid: vid},
            success: response => resolve(response),
            error: error => reject(error)
        });
    });
};
