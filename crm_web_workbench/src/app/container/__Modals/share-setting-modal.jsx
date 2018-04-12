import React, { Component } from 'react';

import {
    ModalTrigger,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFoot,
    Button,
    Radio,
    RadioGroup
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
                            共享设置
                        </p>
                    </ModalHeader>
                    <ModalBody>
                        <RadioGroup groupLable="谁可以查看次列表视图?">
                            <Radio label="只有我可以查看此列表视图" name="name" id="name1" checked={true} />
                            <Radio label="所有用户均可查看此列表视图" name="name" id="name2" />
                        </RadioGroup>
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
