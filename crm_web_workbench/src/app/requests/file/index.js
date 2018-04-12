import { ajax as defaultAjax, upload as defaultUpload } from '../index';
import requestConfig from '../config';
import superagent from 'superagent';

const selfConfig = {};

function makeUrl(url) {
    return `/file/v1/${url}`;
}


export const ajax = (opts = {}) => {
    opts.url = makeUrl(opts.url);
    return defaultAjax(opts);
};

export const upload = (opts = {}) => {
    opts.url = makeUrl(opts.url);
    return defaultUpload(opts);
};

export const makeUploadAvatar = (options) => {
    superagent
        .post('image/upload')
        .field('type', 'avatar')
        .attach('file', options.file, options.file.name)
        .end((err, res) => {
            if (err) {
                if (options.error) {
                    options.error(err, res);
                }
            } else if (res.status >= 200 && res.status < 300) {
                if (options.success) {
                    options.success(res.body);
                }
            }
        });
};

export const config  =  Object.assign(selfConfig, requestConfig);
