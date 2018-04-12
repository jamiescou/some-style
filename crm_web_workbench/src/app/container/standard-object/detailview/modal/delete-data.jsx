import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
    Modal,
    ModalHeader,
    ModalTrigger,
    ModalBody,
    ModalFoot,
    Button
} from 'carbon';

export default class DeleteDataModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    onConfirm(){
        console.log('this', this);
        this.props.onDelete(this.closeConfirm.bind(this));
    }
    closeConfirm() {
        let handleClose = this.refs.handleClose;
        if (handleClose && handleClose.click) {
            this.refs.handleClose.click();
        }
    }
    render() {
        let button = this.props.button;
        return (
            <ModalTrigger>
                {button}
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
                            <Button className="mcds-button__neutral mcds-btn__right close mcds-text__weak">
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

DeleteDataModal.propTypes = {
    deleteActive: PropTypes.bool,
    onClose: PropTypes.func,
    onDelete: PropTypes.func,
    button: PropTypes.element.isRequired
};
