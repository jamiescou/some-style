import { ajax } from './index';

// 获取一条权限内容
export const getOneRole = (roleId) => () => {
    return new Promise((resolve, reject) => {
        ajax({
            url: `role/${roleId}`,
            type: 'GET',
            success: response => resolve(response),
            error: error => reject(error)
        });
    });
};
