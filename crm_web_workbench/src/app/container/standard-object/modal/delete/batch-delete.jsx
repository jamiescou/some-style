import React, { Component } from 'react';
import PropTypes from 'prop-types';

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
import { batchDeleteDataRequest } from 'requests/common/standard-object';

class DeleteModal extends Component {
    static propTypes = {
        // standardObject Name
        // e.g. "Leads"
        objName: PropTypes.string.isRequired,

        // standardObject idArray array
        // e.g. "003bf1572d0354836905ba83aa10b522"
        idArray: PropTypes.array.isRequired,

        // This handler is called each create data success
        success: PropTypes.func,

        // This handler is called each create data fail
        fail: PropTypes.func,

        // 触发区域
        trigger: PropTypes.element.isRequired
    };
    constructor(props) {
        super(props);
        this.state = {
            disabled: false
        };
    }
    onConfirm(){
        let { objName, idArray } = this.props;
        let params = {
            objects: idArray
        };
        let batchDeleteRequest = batchDeleteDataRequest(objName, params);
        this.setState({
            disabled: true
        }, () => {
            batchDeleteRequest().then((response) => {
                let { success, fail } = response.body;
                success = success ? success : [];
                fail = fail ? fail : [];
                if (success.length) {
                    this.props.success(success);
                } else {
                    this.props.fail(fail);
                }
                notify.add(`当前共删除数据${idArray.length}条，成功${success.length}条，失败${fail.length}条`);
                this.closeConfirm();
            }, errorMsg => {
                this.closeConfirm();
                this.props.fail(errorMsg);
                ErrorNotify(errorMsg);
            });
        });
    }
    closeConfirm() {
        let handleClose = this.refs.handleClose;
        if (handleClose && handleClose.click) {
            this.refs.handleClose.click();
        }
    }

    resetButtonDisabled() {
        setTimeout(() => {
            this.setState({
                disabled: false
            });
        }, 300);
    }
    renderTriggerButton() {
        let { trigger } = this.props;
        let newTrigger = React.cloneElement(trigger, { onClick: ::this.resetButtonDisabled});
        return newTrigger;
    }

    render() {
        return (
            <ModalTrigger>
                {this.renderTriggerButton()}
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
                            <Button className="mcds-button__neutral mcds-btn__right mcds-text__weak close" onClick={::this.closeConfirm}>
                                取消
                            </Button>

                            <Button
                                disabled={this.state.disabled}
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
