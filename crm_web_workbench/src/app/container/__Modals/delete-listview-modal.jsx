import React, { Component } from 'react';

import {
    ModalTrigger,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFoot,
    Button
} from 'carbon';

export default class CreateLeadsModal extends Component {
    static propTypes = {
    };

    render() {
        return (
            <ModalTrigger>
                <Button className="mcds-button__brand">Modal</Button>
                <Modal className="mcds-modal__w-520">
                    <ModalHeader>
                        <i className="mcds-modal__close mcds-icon__close-line-20 close" />
                        <p className="mcds-modal__title">
                            选择要显示的字段
                        </p>
                    </ModalHeader>
                    <ModalBody>
                        <p>如果您删除此列表，该视图将为所有具备访问权限的用户永久删除。是否确定要删除？</p>
                    </ModalBody>
                    <ModalFoot>
                        <div className="mcds-layout__column mcds-layout__right">
                            <Button className="mcds-button__neutral mcds-btn__right close">
                                取消
                            </Button>
                            <Button className="mcds-button__brand close">
                                保存
                            </Button>
                        </div>
                    </ModalFoot>
                </Modal>
            </ModalTrigger>
        );
    }
}
