/**
 * 依赖关系的获取接口
 */

import { ajax, config } from './index';

export const fetchDependencyRequest = (objName) => () => {
    let version = config.version;
    let orgName = config.orgName;
    return new Promise((resolve, reject) => {
        ajax({
            url: `/ddl/api/${version}/${orgName}/${objName}/meta/dependency-by`,
            type: 'GET',
            success: response => resolve(response),
            error: error => reject(error)
        });
    });
};
