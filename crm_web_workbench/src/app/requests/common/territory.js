import { ajax, config } from './index';
import {encodeObjectToQuery} from '../index';
// 获取海的列表数据
export const fetchTerritoryListRequest = () => () => {
    let version = config.version;
    let orgName = config.orgName;
    let url = `/dml/api/${version}/${orgName}/service/territory/model?offset=0&limit=50`;
    return new Promise((resolve, reject) => {
        ajax({
            url: url,
            type: 'GET',
            success: response => resolve(response),
            error: error => reject(error)
        });
    });
};

// 获取海的树形结构
export const fetchTerritoryNodeRequest = (model_id) => () => {
    let version = config.version;
    let orgName = config.orgName;
    let url = `/dml/api/${version}/${orgName}/service/territory/model/${model_id}`;
    return new Promise((resolve, reject) => {
        ajax({
            url: url,
            type: 'GET',
            success: response => resolve(response),
            error: error => reject(error)
        });
    });
};

// 获取某个海的列表数据
export const fetchTerritoryRecordRequest = (territory_id, param) => () => {
    let version = config.version;
    let orgName = config.orgName;
    let data = encodeObjectToQuery(param);
    let url = `/dml/api/${version}/${orgName}/service/territory/territory-node/${territory_id}/record?${data}`;
    return new Promise((resolve, reject) => {
        ajax({
            url: url,
            type: 'GET',
            success: response => resolve(response),
            error: error => reject(error)
        });
    });
};
// 领取记录
export const claimTerritoryRecordRequest = (record_id) => () => {
    let version = config.version;
    let orgName = config.orgName;
    let url = `/dml/api/${version}/${orgName}/service/territory/object/${record_id}/claim`;
    return new Promise((resolve, reject) => {
        ajax({
            url: url,
            type: 'PUT',
            success: response => resolve(response),
            error: error => reject(error)
        });
    });
};

// 退回公海
export const allocateTerritoryRequest = (params) => () => {
    let version = config.version;
    let orgName = config.orgName;
    let url = `/dml/api/${version}/${orgName}/service/territory/object/allocate`;
    return new Promise((resolve, reject) => {
        ajax({
            url: url,
            type: 'PUT',
            data: JSON.stringify(params),
            success: response => resolve(response),
            error: error => reject(error)
        });
    });
};
