/**
 * Created by listen1013 on 17/5/1.
 * 审批流请求
 */

import { ajax, config } from './index';

// 获取审批列表
export const fetchListRequest = (params) => () => {
    return new Promise((resolve, reject) => {
        // /api/:ver/:org-name/service/approvals/run
        let version = config.version;
        let orgName = config.orgName;
        ajax({
            url: `/approval/api/${version}/${orgName}/service/approvals/run`,
            type: 'GET',
            data: params,
            success: response => {
                resolve(response);
            },
            error: error => reject(error)
        });
    });
};

// 获取审批列表每个类型的审批总条目
export const fetchCountRequest = () => () => {
    return new Promise((resolve, reject) => {
        // /api/v1.0/meiqia/service/approvals/get-awlist-counts
        let version = config.version;
        let orgName = config.orgName;
        ajax({
            url: `approval/api/${version}/${orgName}/service/approvals/run/list-counts`,
            type: 'GET',
            success: response => {
                resolve(response);
            },
            error: error => reject(error)
        });
    });
};

// 获取有审批模板的标准对象
export const fetchApprovalRequest = () => () => {
    return new Promise((resolve, reject) => {
        // /api/v1.0/meiqia/service/approvals/template/object
        let version = config.version;
        let orgName = config.orgName;
        ajax({
            url: `approval/api/${version}/${orgName}/service/approvals/template/object`,
            type: 'GET',
            success: response => {
                resolve(response);
            },
            error: error => reject(error)
        });
    });
};

// 获取指定审批
export const fetchDataRequest = (id) => () => {
    // /api/:ver/:org-name/service/approvals/run/:run-id
    let version = config.version;
    let orgName = config.orgName;
    return new Promise((resolve, reject) => {
        ajax({
            url: `/approval/api/${version}/${orgName}/service/approvals/run/${id}`,
            type: 'GET',
            success: response => {
                resolve(response);
            },
            error: error => reject(error)
        });
    });
};


// 撤回
export const fetchRevokeRequest = (id) => () => {
    // PUT /api/:ver/:org-name/service/approvals/run/:run-id/close
    let version = config.version;
    let orgName = config.orgName;
    return new Promise((resolve, reject) => {
        ajax({
            url: `/approval/api/${version}/${orgName}/service/approvals/run/${id}/close`,
            type: 'PUT',
            success: response => {
                resolve(response);
            },
            error: error => reject(error)
        });
    });
};

// 同意/拒绝审批
export const fetchAuditRequest = (id, params) => () => {
    // POST /api/:ver/:org-name/service/approvals/run/:run-id/vote
    let version = config.version;
    let orgName = config.orgName;
    return new Promise((resolve, reject) => {
        ajax({
            url: `/approval/api/${version}/${orgName}/service/approvals/run/${id}/vote`,
            type: 'POST',
            data: JSON.stringify(params),
            success: response => {
                resolve(response);
            },
            error: error => reject(error)
        });
    });
};

// 转发
export const fetchForwardRequest = (id, params) => () => {
    // POST /api/:ver/:org-name/service/approvals/run/:run-id/forward
    let version = config.version;
    let orgName = config.orgName;
    return new Promise((resolve, reject) => {
        ajax({
            url: `/approval/api/${version}/${orgName}/service/approvals/run/${id}/forward`,
            type: 'POST',
            data: JSON.stringify(params),
            success: response => {
                resolve(response);
            },
            error: error => reject(error)
        });
    });
};


// 在指定审批节点填写可编辑字段数据
export const updateFieldRequest = (id, point_id, params) => () => {
    // PUT /api/:ver/:org-name/service/approvals/run/:run-id/fill-fields/:point-id
    let version = config.version;
    let orgName = config.orgName;
    return new Promise((resolve, reject) => {
        ajax({
            url: `/approval/api/${version}/${orgName}/service/approvals/run/${id}/fill-fields/${point_id}`,
            type: 'PUT',
            data: JSON.stringify(params),
            success: response => {
                resolve(response);
            },
            error: error => reject(error)
        });
    });
};

// 获取指定审批的评论列表
export const fetchCommentRequest = (id) => () => {
    // GET /api/:ver/:org-name/service/approvals/run/:run-id/comments
    let version = config.version;
    let orgName = config.orgName;
    return new Promise((resolve, reject) => {
        ajax({
            url: `/approval/api/${version}/${orgName}/service/approvals/run/${id}/comments`,
            type: 'GET',
            success: response => {
                resolve(response);
            },
            error: error => reject(error)
        });
    });
};

// 在指定审批发表评论
export const createCommentRequest = (id, params) => () => {
    // POST /api/:ver/:org-name/service/approvals/run/:run-id/comments
    let version = config.version;
    let orgName = config.orgName;
    return new Promise((resolve, reject) => {
        ajax({
            url: `/approval/api/${version}/${orgName}/service/approvals/run/${id}/comments`,
            type: 'POST',
            data: JSON.stringify({
                content: params
            }),
            success: response => {
                resolve(response);
            },
            error: error => reject(error)
        });
    });
};

// 获取指定审批模板
export const fetchTempDataRequest = (id) => () => {
    // GET /api/:ver/:org-name/service/approvals/template/:template-id
    let version = config.version;
    let orgName = config.orgName;
    return new Promise((resolve, reject) => {
        ajax({
            url: `/approval/api/${version}/${orgName}/service/approvals/template/${id}`,
            type: 'GET',
            success: response => {
                resolve(response);
            },
            error: error => reject(error)
        });
    });
};

// 获取指定Record有那些字段在审批
export const fetchFieldsRequest = (objName, id) => () => {
    // GET /api/:ver/:org-name/service/approvals/fields/:object-name/:object-id
    let version = config.version;
    let orgName = config.orgName;
    return new Promise((resolve, reject) => {
        ajax({
            url: `/approval/api/${version}/${orgName}/service/approvals/fields/${objName}/${id}`,
            type: 'GET',
            success: response => {
                resolve(response);
            },
            error: error => reject(error)
        });
    });
};

// 获取创建可用的审批模板
export const fetchCreateTempRequest = (objName, params) => () => {
    // POST /api/:ver/:org-name/service/approvals/get-available-templates/:object-name
    let version = config.version;
    let orgName = config.orgName;
    return new Promise((resolve, reject) => {
        ajax({
            url: `/approval/api/${version}/${orgName}/service/approvals/get-available-templates/${objName}`,
            type: 'POST',
            data: JSON.stringify(params),
            success: response => {
                resolve(response);
            },
            error: error => reject(error)
        });
    });
};

// 获取修改可用的审批模板
export const fetchUpdataTempRequest = (objName, objId, params) => () => {
    // PUT /api/:ver/:org-name/service/approvals/get-available-templates/:object-name/:object-id
    let version = config.version;
    let orgName = config.orgName;
    return new Promise((resolve, reject) => {
        ajax({
            url: `/approval/api/${version}/${orgName}/service/approvals/get-available-templates/${objName}/${objId}`,
            type: 'PUT',
            data: JSON.stringify(params),
            success: response => {
                resolve(response);
            },
            error: error => reject(error)
        });
    });
};

// 创建审批
export const createApprovalRequest = (id, params) => () => {
    // POST /api/:ver/:org-name/service/approvals/template/:template-id/run
    let version = config.version;
    let orgName = config.orgName;
    return new Promise((resolve, reject) => {
        ajax({
            url: `/approval/api/${version}/${orgName}/service/approvals/template/${id}/run`,
            type: 'POST',
            data: JSON.stringify(params),
            success: response => {
                resolve(response);
            },
            error: error => reject(error)
        });
    });
};
