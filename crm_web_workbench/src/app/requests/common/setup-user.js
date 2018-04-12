
import { ajax } from './index';

// 邀请
export const inviteRequest = (phone, name) => {
    return new Promise((resolve, reject) => {
        ajax({
            data: JSON.stringify({source: 'web', phone, name}),
            url: '/tenant-gateway/tenant/invitation',
            type: 'POST',
            success: response => {
                resolve(response);
            },
            error: error => {
                reject(error);
            }
        });
    });
};
