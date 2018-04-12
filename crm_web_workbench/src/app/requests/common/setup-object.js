import { ajax, config } from './index';

// 创建一个新的对象
export const createObjectRequest = (objName, param) => () => {
    let version = config.version;
    let orgName = config.orgName;
    let url = `/ddl/api/${version}/${orgName}/${objName}/meta`;
    return new Promise((resolve, reject) => {
        ajax({
            url: url,
            type: 'POST',
            data: JSON.stringify(param),
            success: response => resolve(response),
            error: error => reject(error)
        });
    });
};

// 添加一列
export const addColumnRequest = (objName, param) => () => {
    let version = config.version;
    let orgName = config.orgName;
    let url = `/ddl/api/${version}/${orgName}/${objName}/meta/add`;
    return new Promise((resolve, reject) => {
        ajax({
            url: url,
            type: 'PUT',
            data: JSON.stringify(param),
            success: response => resolve(response),
            error: error => reject(error)
        });
    });
};

// 新建字段
export const createObjectFieldRequest = (objName, param) => () => {
    let version = config.version;
    let orgName = config.orgName;
    let url = `/ddl/api/${version}/${orgName}/${objName}/meta/add`;
    console.log('request', param);
    return new Promise((resolve, reject) => {
        ajax({
            url: url,
            type: 'PUT',
            data: JSON.stringify(param),
            success: response => resolve(response),
            error: error => reject(error)
        });
    });
};
