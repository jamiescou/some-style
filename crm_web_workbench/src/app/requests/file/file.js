import { ajax, upload, makeUploadAvatar } from './index';


export const fileUpload = (file) => () => {
    return new Promise((resolve, reject) => {
        upload({
            url: 'upload',
            type: 'POST',
            file: file,
            success: response => resolve(response),
            error: error => reject(error)
        });
    });
};
// - request
//    - file_id string
//    - object_name string
//    - field_name string
//    - record_id string
//    - version int64
// - return
//    - url string
//    - credential
//      - access_key_id string
//      - secret_access_key string
//      - session_token string
//    - code int
//    - message string
export const fileDownload = (param) => () => {
    let { file_id, ...others } = param;
    return new Promise((resolve, reject) => {
        ajax({
            url: file_id.split('/').slice(4),
            type: 'GET',
            data: others,
            success: response => resolve(response),
            error: error => reject(error)
        });
    });
};


/**
 *  给文件标记一个 object/field 绑定关系
 * - request
 * - file_url string
 * - object_name string
 * - field_name string
 * - record_id string
 * - version int64
 * - return
 * - code int
 * - message string
 * @param {*} param 
 */

export const markFileIdWithStandardObject = (param) => () => {
    return new Promise((resolve, reject) => {
        ajax({
            url: 'internal/mark_file',
            type: 'POST',
            contentType: 'application/json',
            data: param,
            success: response => resolve(response),
            error: error => reject(error)
        });
    });
};

export function uploadAvatar(file) {
    return new Promise((resolve, reject) => {
        makeUploadAvatar({
            file: file,
            error: (error) => reject(error),
            success: (response) => resolve(response.photo_url)
        });
    });
}
