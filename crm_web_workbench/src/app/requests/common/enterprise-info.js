import { ajax } from './index';

// 获取公司工商信息
export const fetchDataRequest = (keyword) => () => {
    let url = `/enterprise/enterprise_info/search_infoes?keyword='${keyword}'`;
    return new Promise((resolve, reject) => {
        ajax({
            url: url,
            type: 'GET',
            success: response => {
                let result = response;
                if (!result.body.items) {
                    result.body.items = [];
                }
                return resolve(response);
            },
            error: error => reject(error)
        });
    });
};


// 获取企业基本信息
export const fetchEnterpriseInfo = (id) => () => {
    let url = `/tenant-gateway/tenant/org/${id}`;
    return new Promise((resolve, reject) => {
        ajax({
            url: url,
            type: 'GET',
            success: response => resolve(response),
            error: error => reject(error)
        });
    });
};
