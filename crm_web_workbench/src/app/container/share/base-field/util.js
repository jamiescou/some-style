import _ from 'lodash';
import { PropTypes } from 'react';
const isAvailable = param => {
    let isUnavailable =  _.isNull(param) || _.isUndefined(param);
    return !isUnavailable;
};


let commonPtys = {
    // typeof ['immutable', 'object'],
    schema: PropTypes.object.isRequired,

    // 初始值
    value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
        PropTypes.object
    ])
};

export {
    isAvailable,
    commonPtys
};
