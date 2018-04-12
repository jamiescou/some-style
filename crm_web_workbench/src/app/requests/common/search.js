import { ajax, config, handleParam } from './index';
// 获取 搜索左侧nav
export const fetchSearchNavRequest = (params) => () => {
    let version = config.version;
    let orgName = config.orgName;
    let data = handleParam(params);
    let url = `/approval/api/${version}/${orgName}/service/search?${data}`;
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

// 获取搜索右侧内容
export const fetchSearchDataRequest = (objName, params) => () => {
    let version = config.version;
    let orgName = config.orgName;
    let data = handleParam(params);
    let url = `/approval/api/${version}/${orgName}/service/search/${objName}/?${data}`;
    return new Promise((resolve, reject) => {
        ajax({
            url: url,
            type: 'GET',
            success: response => {
                // 处理objects返回的是null,的情况
                // let objects = response.body.objects;
                let body = response.body;
                if (!body) {
                    response.body = {};
                    response.body.objects = [];
                }
                resolve(response);
            },
            error: error => reject(error)
        });
    });
};
