import React, { Component } from 'react';

import {
    ModalTrigger,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFoot,
    Button,
    Select,
    ButtonSmallIcon,
    FromMultiSelect
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
                        <div className="mcds-grid">
                            <div>
                                <Select label="下拉菜单" value={123}>
                                    <option value={123}>
                                        角色
                                    </option>
                                    <option value={456}>
                                        B
                                    </option>
                                    <option value={789}>
                                        C
                                    </option>
                                </Select>
                                <FromMultiSelect label="未显示字段">
                                    <li className="mcds-picklist__item">
                                        Option One
                                    </li>
                                    <li className="mcds-picklist__item mcds-picklist__active">
                                        Option Tow
                                    </li>
                                    <li className="mcds-picklist__item">
                                        Option Three
                                    </li>
                                </FromMultiSelect>
                            </div>
                            <div className="mcds-grid mcds-picklist__vertical">
                                <ButtonSmallIcon icon="mcds-icon__triangle-solid-14" />
                                <ButtonSmallIcon className="mcds-m__t-13" icon="mcds-icon__triangle-solid-14" />
                            </div>
                            <div>
                                <Select label="下拉菜单" value={123}>
                                    <option value={123}>
                                        角色
                                    </option>
                                    <option value={456}>
                                        B
                                    </option>
                                    <option value={789}>
                                        C
                                    </option>
                                </Select>
                                <FromMultiSelect label="显示字段">
                                    <li className="mcds-picklist__item">
                                        Option One
                                    </li>
                                    <li className="mcds-picklist__item">
                                        Option Three
                                    </li>
                                </FromMultiSelect>
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
