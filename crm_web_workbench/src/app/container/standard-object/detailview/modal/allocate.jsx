/**
 * 退回公海的modal
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';

import { allocateTerritory } from 'redux/reducers/standard-object/detailview/data';
import ErrorNotify from 'container/share/error/error-notify';

import {
    Modal,
    ModalTrigger,
    ModalHeader,
    ModalBody,
    ModalFoot,
    Button,
    TextArea,
    notify
} from 'carbon';
class AllocateModal extends Component{
    static propTypes = {
        // standardObject Name
        // e.g. "Leads"
        objName: PropTypes.string.isRequired,
        // record id 
        id: PropTypes.string.isRequired,
        // 触发元素
        trigger: PropTypes.element.isRequired,

        // This handler is called each create data success
        success: PropTypes.func,
        // This handler is called each create data fail
        fail: PropTypes.func,

        // 下边这些是挂载在props上的
        allocateTerritory: PropTypes.func,
        user_id: PropTypes.string

    }
    constructor(){
        super();
        this.state = {
            value: ''
        };
        this.handleTextarea = this.handleTextarea.bind(this);
        this.handleCancleClick = this.handleCancleClick.bind(this);
        this.handleCommit = this.handleCommit.bind(this);
    }
    // 关闭modal
    closeModal() {
        if (this.refs.handleClose && this.refs.handleClose.click) {
            this.refs.handleClose.click();
        }
    }
    // 取消按钮
    handleCancleClick(){
        this.resetState();
    }
    // 文本域的值修改时
    handleTextarea(value){
        this.setState({ value });
    }
    handleParams(type_name, record_id, user_id, message){
        let param = {
            type_name,
            record_id,
            user_id,
            message
        };
        let params = [];
        params.push(param);
        return params;
    }
    // 提交
    handleCommit(){
        let { objName, user_id, id } = this.props;
        let message = this.state.value;
        if (!_.trim(message)) {
            notify.add('请输入退回原因');
        } else {
            let params = this.handleParams(objName, id, user_id, message);
            this.props.allocateTerritory(params).then(res => {
                let { record_result_list } = res.result.body;
                record_result_list.forEach(v => {
                    let { record_id, status } = v;
                    if (id === record_id && status === 'success') {
                        this.props.success();
                        notify.add('退回成功');
                        this.closeModal();
                        this.resetState();
                    } else {
                        notify.add('退回失败');
                    }
                });
            }, error => { ErrorNotify(error); });
        }
    }
    resetState(){
        this.setState({
            value: ''
        });
    }
    // 渲染退回原因
    renderAllocate(){
        return (<TextArea
            value={this.state.value}
            placeholder="请输入退回原因"
            onChange={this.handleTextarea} />);
    }
    renderTriggerButton() {
        let handleClick = () => {
            this.resetState();
        };
        return React.cloneElement(this.props.trigger, { onClick: handleClick });
    }
    render(){
        return (
            <ModalTrigger>
                {this.renderTriggerButton()}
                <Modal className="mcds-modal__w-520">
                    <ModalHeader>
                        <i className="mcds-modal__close mcds-icon__close-line-20 close" />
                        <p className="mcds-modal__title">
                            退回原因
                        </p>
                    </ModalHeader>
                    <ModalBody>
                        {this.renderAllocate()}
                    </ModalBody>
                    <ModalFoot>
                        <div className="mcds-layout__column mcds-layout__right">
                            <span ref="handleClose" className="close" />
                            <Button
                                onClick={this.handleCommit}
                                className="mcds-button__brand" >
                                提交
                            </Button>
                            <Button className="mcds-button__neutral mcds-btn__right mcds-text__weak close" onClick={this.handleCancleClick}>
                                取消
                            </Button>
                        </div>
                    </ModalFoot>
                </Modal>
            </ModalTrigger>
        );
    }
}
AllocateModal.defaultProps = {
    success: () => {},
    fail: () => {}
};

export default connect(
    state => ({
        user_id: state.getIn(['userProfile', 'userId'])
    }),
    dispatch => bindActionCreators({ allocateTerritory }, dispatch)
)(AllocateModal);
