import { ajax } from './index';

// 获取指定组的信息
export const getOneGroup = (groupId) => () => {
    return new Promise((resolve, reject) => {
        ajax({
            url: `/group/${groupId}`,
            type: 'GET',
            success: response => resolve(response),
            error: error => reject(error)
        });
    });
};
