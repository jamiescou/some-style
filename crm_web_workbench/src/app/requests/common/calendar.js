/**
 * Created by chenmeng on 17/08/03.
 */
import { ajax, config } from './index';

// TODO 这块的接口出来再改

// 获取日程事件列表
export const fetchCalendarListRequest = (objName) => () => {
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

// 获取单个日程数据
export const fetchCalendarDataRequest = (objName) => () => {
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
// 创建日程事件
export const createCalendarRequest = (objName) => () => {
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
// 更新日程事件
export const updateCalendarRequest = (objName) => () => {
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
// 删除日程事件
export const deleteCalendarRequest = (objName) => () => {
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

