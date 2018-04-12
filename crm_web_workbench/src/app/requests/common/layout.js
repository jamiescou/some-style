
import { ajax, config } from './index';

let _tenant_id = config._tenant_id;
let version = config.version;
let orgName = config.orgName;

export const fetchLayoutRequest = (objName, page) => () => {
    return new Promise((resolve, reject) => {
        ajax({
            url: `/layout/api/${version}/${orgName}/${objName}/layout/${page}?_tenant_id=${_tenant_id}`,
            type: 'GET',
            success: response => {
                resolve(response);
            },
            error: error => reject(error)
        });
    });
};

export const fetchOrgNavConfig = () => () => {
    return new Promise((resolve, reject) => {
        ajax({
            url: `/layout/api/${version}/${orgName}?_tenant_id=${_tenant_id}`,
            type: 'GET',
            success: response => {
                resolve(response);
            },
            error: error => reject(error)
        });
    });
};

export const fetchObjGlobalConfig = (objName) => () => {
    return new Promise((resolve, reject) => {
        ajax({
            url: `/layout/api/${version}/${objName}/global?_tenant_id=${_tenant_id}`,
            type: 'GET',
            success: response => {
                resolve(response);
            },
            error: error => reject(error)
        });
    });
};
