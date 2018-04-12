
import { ajax } from './index';

export const feedback = (params) => {
    return new Promise((resolve, reject) => {
        ajax({
            url: '/feedback/v1/bug',
            type: 'POST',
            data: JSON.stringify(params),
            success: response => {
                resolve(response);
            },
            error: error => reject(error)
        });
    });
};
