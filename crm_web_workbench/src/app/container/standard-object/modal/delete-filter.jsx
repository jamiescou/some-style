// todo 这个delte-view我要迁移到最外层modal
//
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { deleteDataRequest } from 'requests/common/filter';


import {
    Modal,
    ModalHeader,
    ModalTrigger,
    ModalBody,
    ModalFoot,
    Button
} from 'carbon';

export default class DeleteView extends Component {

    static propTypes = {
        // standardObject Name
        // e.g. "Leads"
        objName: PropTypes.string.isRequired,

        // filter.id
        // e.g. "6d4a082f84920a7414d207301208b3eb"
        id: PropTypes.string.isRequired,

        // This handler is called each delete filter success
        success: PropTypes.func,

        // This handler is called each delete filter fail
        fail: PropTypes.func,

        trigger: PropTypes.element.isRequired
    };

    handleDeleteFilter() {
        let { objName, id, success, fail } = this.props;
        let request = deleteDataRequest(objName, id);
        request().then((res) => {
            success(res);
            this.closeModal();
        }, err => {
            fail(err);
        });
    }
    closeModal() {
        if (this.refs.handleClose && this.refs.handleClose.click) {
            this.refs.handleClose.click();
        }
    }
    render() {
        return (
            <ModalTrigger>
                {this.props.trigger}
                <Modal className="mcds-modal__w-520">
                    <ModalHeader>
                        <i className="mcds-modal__close mcds-icon__close-line-20 close" />
                        <p className="mcds-modal__title">
                            删除视图
                        </p>
                    </ModalHeader>
                    <ModalBody>
                        <p>如果您删除此列表视图，该视图将为所有具备访问权限的用户永久删除。是否确定要删除？</p>
                    </ModalBody>
                    <ModalFoot>
                        <div className="mcds-layout__column mcds-layout__right">
                            <span ref="handleClose" className="close" />
                            <Button className="mcds-button__neutral mcds-btn__right mcds-text__weak close">
                                取消
                            </Button>
                            <Button
                                className="mcds-button__destructive"
                                onClick={this.handleDeleteFilter.bind(this)}>
                                删除
                            </Button>
                        </div>
                    </ModalFoot>
                </Modal>
            </ModalTrigger>
        );
    }
}

DeleteView.defaultProps = {
    success: () => {},
    fail: () => {}
};
