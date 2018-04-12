/**
 * 标准对象接口
 */

import { ajax, config, handleParam } from './index';

// 获取单挑标准对象数据
export const fetchOneRequest = (objName, id = '') => () => {
    let version = config.version;
    let orgName = config.orgName;
    let url = `/dml/api/${version}/${orgName}/${objName}/${id}`;
    return new Promise((resolve, reject) => {
        ajax({
            url: url,
            type: 'GET',
            success: response => resolve(response),
            error: error => reject(error)
        });
    });
};

// 获取一组标准对象数据
export const fetchDataRequest = (objName, params) => () => {
    let version = config.version;
    let orgName = config.orgName;
    let data = handleParam(params);
    let url = `/dml/api/${version}/${orgName}/${objName}/query?${data}`;
    return new Promise((resolve, reject) => {
        ajax({
            url: url,
            type: 'GET',
            success: response => {
                // 处理objects返回的是null,的情况
                let objects = response.body.objects;
                if (!objects) {
                    response.body.objects = [];
                }
                resolve(response);
            },
            error: error => reject(error)
        });
    });
};


// 创建标准对象,数组形式
export const createDataRequest = (objName, objects) => () => {
    let version = config.version;
    let orgName = config.orgName;
    return new Promise((resolve, reject) => {
        ajax({
            url: `/dml/api/${version}/${orgName}/${objName}`,
            type: 'POST',
            data: JSON.stringify({
                objects: objects
            }),
            success: response => resolve(response),
            error: error => reject(error)
        });
    });
};

// 删除标准对象
export const deleteDataRequest = (objName, id, version) => () => {
    let curVersion = config.version;
    let orgName = config.orgName;
    return new Promise((resolve, reject) => {
        ajax({
            url: `/dml/api/${curVersion}/${orgName}/${objName}/${id}?version=${version}`,
            type: 'DELETE',
            success: response => resolve(response),
            error: error => reject(error)
        });
    });
};
// 批量删除标准对象
export const batchDeleteDataRequest = (objName, params) => () => {
    let curVersion = config.version;
    let orgName = config.orgName;
    console.log('pppp', params);
    return new Promise((resolve, reject) => {
        ajax({
            url: `/dml/api/${curVersion}/${orgName}/${objName}/object_list`,
            type: 'DELETE',
            contentType: ' application/json',
            data: params,
            success: response => resolve(response),
            error: error => reject(error)
        });
    });
};

// 更新标准对象
export const updateDataRequest = (objName, id, updateData) => () => {
    let version = config.version;
    let orgName = config.orgName;
    return new Promise((resolve, reject) => {
        ajax({
            url: `/dml/api/${version}/${orgName}/${objName}/${id}`,
            type: 'PUT',
            data: JSON.stringify(updateData),
            success: response => resolve(response),
            error: error => reject(error)
        });
    });
};

// 更新标准对象的owern
export const updateDateOwner = (objName, id, _version = 0, params) => () => {
    let version = config.version;
    let orgName = config.orgName;
    return new Promise((resolve, reject) => {
        ajax({
            url: `/dml/api/${version}/${orgName}/${objName}/${id}/transfer?version=${_version}`,
            type: 'PUT',
            contentType: ' application/json',
            data: JSON.stringify(params),
            success: response => resolve(response),
            error: error => reject(error)
        });
    });
};
// 批量更新标准对象的owner
export const batchUpdateDateOwner = (objName, params) => () => {
    let version = config.version;
    let orgName = config.orgName;
    return new Promise((resolve, reject) => {
        ajax({
            url: `/dml/api/${version}/${orgName}/${objName}/object_list/transfer`,
            type: 'PUT',
            contentType: ' application/json',
            data: JSON.stringify(params),
            success: response => resolve(response),
            error: error => reject(error)
        });
    });
};

// 获取标准对象的角色

export const fetchObjectTeamRole = (objName) => () => {
    let version = config.version;
    let orgName = config.orgName;
    return new Promise((resolve, reject) => {
        ajax({
            url: `/ddl/api/${version}/${orgName}/${objName}/meta/team-member-roles`,
            type: 'GET',
            success: response => resolve(response),
            error: error => reject(error)
        });
    });
};

export const checkmergeData = (mergeIds, deleteIds, objName) => {
    let param = {
        optional: {
            merge_ids: mergeIds,
            delete_ids: deleteIds
        }
    };
    let version = config.version;
    let orgName = config.orgName;
    let url = `/dml/api/${version}/${orgName}/${objName}/actions/run/merge_data_pre`;
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
// 合并两条或三条标准对象
export const mergeDataRequest = (objName, object, optional) => () => {
    let param = {
        datas: {},
        optional: optional
    }
    param.datas[objName] = [
        object
    ]
    let version = config.version;
    let orgName = config.orgName;
    let url = `/dml/api/${version}/${orgName}/${objName}/actions/run/merge_data_commit`;
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

// 复制一条标准对象
export const copyDataRequest = (objName, id) => () => {
    let param = {
        datas: {
            objName: [
                {
                    id: id
                }]
        }
    };
    let version = config.version;
    let orgName = config.orgName;
    let url = `/dml/api/${version}/${orgName}/${objName}/actions/run/copy_data`;
    return new Promise((resolve, reject) => {
        ajax({
            url: url,
            type: 'PUT',
            data: JSON.stringify(param),
            success: response => {
                // 处理objects返回的是null,的情况
                let objects = response.body.objects;
                if (!objects) {
                    response.body.objects = [];
                }
                resolve(response);
            },
            error: error => reject(error)
        });
    });
};
