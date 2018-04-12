import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ErrorNotify from 'container/share/error/error-notify';
import {
    Modal,
    ModalTrigger,
    ModalHeader,
    ModalBody,
    ModalFoot,
    Button,
    notify
} from 'carbon';
import { fetchOneRequest, deleteDataRequest } from 'requests/common/standard-object';

class DeleteModal extends Component {
    static propTypes = {
        // standardObject Name
        // e.g. "Leads"
        objName: PropTypes.string.isRequired,

        // standardObject id string or array
        // e.g. "003bf1572d0354836905ba83aa10b522"
        id: PropTypes.string.isRequired,

        // This handler is called each create data success
        success: PropTypes.func,

        // This handler is called each create data fail
        fail: PropTypes.func,

        // 触发区域
        trigger: PropTypes.element.isRequired,
        // 这两个是预览卡控制modal的
        onCloseModal: PropTypes.func,
        onOpenModal: PropTypes.func
    };
    constructor(props) {
        super(props);
        this.state = {
            value: ''
        };
    }

    onConfirm(){
        let { objName, id } = this.props;
        let value = this.state.value;
        if (!value) { return; }
        let version = value.version;
        let sendDeleteData = deleteDataRequest(objName, id, version);
        sendDeleteData().then((response) => {
            this.resetState();
            this.closeConfirm();
            // 这个是预览卡的操作
            if (this.props.onCloseModal) {
                this.props.onCloseModal();
            }
            this.props.success(objName, response.body);
            notify.add('删除成功');
        }, errorMsg => {
            ErrorNotify(errorMsg);
            this.props.fail(errorMsg);
        });
    }

    // 取消按钮 逻辑
    handleCancleClick() {
        this.resetState();
        // 这个是预览卡的操作        
        if (this.props.onCloseModal) {
            this.props.onCloseModal();
        }
    }

    resetState(){
        this.setState({
            value: ''
        });
    }

    closeConfirm() {
        let handleClose = this.refs.handleClose;
        if (handleClose && handleClose.click) {
            this.refs.handleClose.click();
        }
    }

    renderTrigger() {
        let newOnClick = () => {
            this.triggerHandle();
            // 这个是预览卡的操作      
            if (this.props.onOpenModal) {
                this.props.onOpenModal();
            }
        };
        return React.cloneElement(this.props.trigger, { onClick: newOnClick});
    }

    triggerHandle() {
        let { objName, id } = this.props;
        let getOneData =  fetchOneRequest(objName, id);
        getOneData().then((response) => {
            this.setState({
                value: response.body
            });
        }, err => {
            console.log('err', err);
        });
    }

    render() {
        return (
            <ModalTrigger>
                {this.renderTrigger()}
                <Modal className="mcds-modal__w-520">
                    <ModalHeader>
                        <i className="mcds-modal__close mcds-icon__close-line-20 close" />
                        <p className="mcds-modal__title">
                            删除数据
                        </p>
                    </ModalHeader>
                    <ModalBody>
                        <p className="mcds-text__center">是否确定要删除？</p>
                    </ModalBody>
                    <ModalFoot>
                        <div className="mcds-layout__column mcds-layout__right">
                            <span ref="handleClose" className="close" />
                            <Button className="mcds-button__neutral mcds-btn__right mcds-text__weak close" onClick={this.handleCancleClick.bind(this)}>
                                取消
                            </Button>

                            <Button
                                onClick={this.onConfirm.bind(this)}
                                className="mcds-button__destructive" >
                                删除
                            </Button>
                        </div>
                    </ModalFoot>
                </Modal>
            </ModalTrigger>
        );
    }

}

DeleteModal.contextTypes = {
    router: PropTypes.object.isRequired
};

DeleteModal.defaultProps = {
    success: () => {},
    fail: () => {}
};

export default DeleteModal;
