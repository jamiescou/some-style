import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

import SingleDeleteModal from './delete/delete';
import BatchDeleteModal from './delete/batch-delete';

export default class DeleteModal extends Component {
    static propTypes = {
        // standardObject Name
        // e.g. "Leads"
        objName: PropTypes.string.isRequired,

        // standardObject id string or array
        // e.g. "003bf1572d0354836905ba83aa10b522" or [{}, {}]
        // if string delete one item
        // else delet
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.array]).isRequired,

        // This handler is called each create data success
        success: PropTypes.func,

        // This handler is called each create data fail
        fail: PropTypes.func,

        // 触发区域
        trigger: PropTypes.element.isRequired
    };

    render(){
        let {id, ...other} = this.props;
        if (_.isString(id)) {
            return <SingleDeleteModal id={id} {...other} />;
        }
        // 传id数组 => 批量删除
        return <BatchDeleteModal idArray={id} {...other} />;
    }
}
