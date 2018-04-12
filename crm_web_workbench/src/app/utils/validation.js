import _ from 'lodash';

/**
 * 验证IP格式是否合法
 */
export const validateIP = (...ips) => {
    let result = true;
    _.each(ips, ip => {
        if (!/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ip)) {
            result = false;
            return;
        }
    });
    return result;
};

/**
 * 验证起始地址不能大于结束地址
 */
export const validateIPRange = (begin, end) => {
    const b_arr = begin.split('.');
    const e_arr = end.split('.');
    for (let i = 0; i <= 3; i++) {
        if (b_arr[i] < e_arr[i]) {
            return true;
        } else if (b_arr[i] > e_arr[i]) {
            return false;
        }
    }
    // begin equal end
    return true;
};


// 邮箱
export const validateEmail = (val) => {
    return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(val);
};

// 电话号码－宽松模式
export const validateTel = (val) => {
    if (isNaN(+val) || val.length < 6) {
        return false;
    }
    return true;
};

// 数字
export const validateNum = (val) => {
    let re = /^\d+$/;
    return re.test(val);
};

// 电话号码－严格模式（座机和手机）
export const validatePhoneNum = (val) => {
    let re = /^(0[1-9]\d[1-9]\d{7}|0[1-9]\d{2}[1-9]\d{6,7}|1\d{10})$/;
    return re.test(val);
};

