import { browserHistory } from 'react-router';

// resetFields 清除state树上的fields
import { fetchCreateTemp, fetchUpdataTemp, resetUpdataTemp, resetCreateTemp } from 'redux/reducers/vetting/listview';

import ErrorNotify from 'container/share/error/error-notify';

/*
    @param {string} type: update为更改触发审批
    @param {object} params: objName, objId, owner 等参数
    @param {object} data: 请求审批模板需要的参数
*/
export const approval = (type, params, data) => {
    const dispatch = window.store.dispatch;
    let request = null;
    if (type === 'update') {
        request = fetchUpdataTemp(params.objName, params.objId, data, params);
    } else {
        request = fetchCreateTemp(params.objName, data, params);
    }
    dispatch(request).then((response) => {
        if (response.result.code === 0) {
            browserHistory.push({pathname: '/vetting/choose'});
        }
    }, (error) => {
        ErrorNotify(error);
    });
};


/*
    @param {string} type: update为更改触发审批
*/
export const resetApprovalParam = (type) => {
    const dispatch = window.store.dispatch;
    let request = null;
    if (type === 'update') {
        request = resetUpdataTemp();
    } else {
        request = resetCreateTemp();
    }
    dispatch(request);
    // dispatch(resetFields());
};
