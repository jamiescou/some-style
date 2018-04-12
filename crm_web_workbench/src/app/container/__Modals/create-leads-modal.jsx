import React, { Component } from 'react';

import {
    ModalTrigger,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFoot,
    Button,
    Input,
    Select
} from 'carbon';

export default class CreateLeadsModal extends Component {
    static propTypes = {
    };

    render() {
        return (
            <ModalTrigger>
                <Button className="mcds-button__brand">Modal</Button>
                <Modal className="mcds-modal__w-820">
                    <ModalHeader>
                        <i className="mcds-modal__close mcds-icon__close-line-20 close" />
                        <p className="mcds-modal__title">
                            新建
                        </p>
                    </ModalHeader>
                    <ModalBody>
                        <div className="mcds-layout__column">
                            <div className="mcds-layout__item-6 mcds-p__r-15">
                                <Input label="客户姓名" id="Input" name="userName" defaultValue="user name" />
                            </div>
                            <div className="mcds-layout__item-6 mcds-p__l-15">
                                <Input label="拥有人" id="Input" name="owner" />
                            </div>
                        </div>
                        <div className="mcds-layout__column mcds-p__t-20">
                            <div className="mcds-layout__item-6 mcds-p__r-15">
                                <Select label="客户状态" value={1}>
                                    <option value={1}>
                                        状态1
                                    </option>
                                    <option value={2}>
                                        状态2
                                    </option>
                                    <option value={3}>
                                        状态3
                                    </option>
                                </Select>
                            </div>
                            <div className="mcds-layout__item-6 mcds-p__l-15">
                                <Select label="转换成的联系人状态" value={1}>
                                    <option value={1}>
                                        状态1
                                    </option>
                                    <option value={2}>
                                        状态2
                                    </option>
                                    <option value={3}>
                                        状态3
                                    </option>
                                </Select>
                            </div>
                        </div>
                        <div className="mcds-layout__column mcds-p__t-20">
                            <div className="mcds-layout__item-6 mcds-p__r-15">
                                <Input label="联系人姓名" id="Input" name="contacts" defaultValue="Lora Crawford" />
                            </div>
                            <div className="mcds-layout__item-6 mcds-p__l-15">
                                <Input label="商机" id="Input" name="Business" />
                            </div>
                        </div>
                        <div className="mcds-layout__column mcds-p__t-20">
                            <div className="mcds-layout__left">
                                <a href="javascript:;">展开填写更多字段</a>
                            </div>
                        </div>
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
