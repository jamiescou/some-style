import _ from 'lodash';
import React from 'react';
import moment from 'moment';

import BaseContext from 'container/share/base-field/base-field';

const isAvailable = param => {
    let isUnavailable =  _.isNull(param) || _.isUndefined(param);
    return !isUnavailable;
};

export default class ShowBaseField extends BaseContext {
    constructor(props){
        super(props);
    }
    address(val){
        return val;
    }
    datetime(val) {
        if (!isAvailable(val) || !val) {
            return '';
        }
        return (
            <div>
                {moment(val).format('YYYY-MM-DD HH:mm')}
            </div>
        );
    }
    render() {
        return super.render();
    }
}

