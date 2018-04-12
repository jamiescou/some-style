// import { encodeObjectToQuery } from '../index';

import { ajax } from './index';
// 获取 ViewFilter
export const getTeamMember = (objName, objId, ownerId) => () => {
    return new Promise((resolve, reject) => {
        ajax({
            url: `team/${objName}/${objId}/${ownerId}/member`,
            type: 'GET',
            success: response => resolve(response),
            error: error => reject(error)
        });
    });
};
/**
 * 新增teamd成员
 * @param  {[type]} objName [对象名字]
 * @param  {[type]} objId   [对象id]
 * @param  {[type]} ownerId [拥有者id]
 * @param  {[type]} params  [{
    "user_id": "5594da966a3318a735ce73db27fe1f50",
    "TeamMemberRole": "teest",
    "AccessLevel": 1
}]
 * @return {[type]}         [description]
 */

export const addTeamMember = (objName, objId, ownerId, params) => () => {
    return new Promise((resolve, reject) => {
        ajax({
            url: `team/${objName}/${objId}/${ownerId}/member`,
            type: 'POST',
            data: JSON.stringify(params),
            success: response => resolve(response),
            error: error => reject(error)
        });
    });
};


export const deleteTeamMember = (objName, objId, ownerId, userId) => () => {
    return new Promise((resolve, reject) => {
        ajax({
            url: `team/${objName}/${objId}/${ownerId}/member/${userId}`,
            type: 'DELETE',
            success: response => resolve(response),
            error: error => reject(error)
        });
    });
};
