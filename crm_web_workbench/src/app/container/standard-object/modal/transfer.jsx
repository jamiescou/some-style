/**
 * 批量转移
 */
import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

import SingleTransferModal from './transfer/transfer';
import BatchTransferModal from './transfer/batch-transfer';

export default class TransferModal extends Component {
    static propTypes = {
        // standardObject Name
        // e.g. "Leads"
        objName: PropTypes.string.isRequired,

        // standardObject id string or array
        // e.g. "003bf1572d0354836905ba83aa10b522" or [{}, {}]
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
        // 如果传单个id => 转移
        if (_.isString(id)) {
            return (<SingleTransferModal
                id={id}
                {...other} />);
        }
        // 传id数组 => 批量转移
        return (
            <BatchTransferModal
                idArray={id}
                {...other} />
        );
    }
}
