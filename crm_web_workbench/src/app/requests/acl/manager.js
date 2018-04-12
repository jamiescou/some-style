import { ajax } from './index';

// 获取一个人的manager
export const getUserManager = (userId) => () => {
    return new Promise((resolve, reject) => {
        ajax({
            url: `user/${userId}/manager`,
            type: 'GET',
            success: response => resolve(response),
            error: error => reject(error)
        });
    });
};

// 获取一个人全部manager ？？
export const getUserManagers = (userId) => () => {
    return new Promise((resolve, reject) => {
        ajax({
            url: `user/${userId}/manager/all`,
            type: 'GET',
            success: response => resolve(response),
            error: error => reject(error)
        });
    });
};
