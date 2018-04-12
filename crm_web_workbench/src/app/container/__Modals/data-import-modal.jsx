import React, { Component } from 'react';

import {
    ModalTrigger,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFoot,
    Button,
    Select,
    FileSelector
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
                            数据导入
                        </p>
                    </ModalHeader>
                    <ModalBody>
                        <FileSelector
                            drop
                            className="mcds-file-selector__images mcds-data__import"
                            label="上传数据文件"
                            Icon="mcds-icon__add-group-small"
                            accept="image/png"
                            iconContent="上传数据文件"
                            dropContent="或拖放数据文件到这里" />
                        <Select label="当客户名与联系人手机号重复时" value={123} className="mcds-m__t-20">
                            <option value={123}>
                                提示选择是否额外创建、合并现有、覆盖或者不创建
                            </option>
                        </Select>
                    </ModalBody>
                    <ModalFoot>
                        <div className="mcds-layout__column">
                            <div className="mcds-layout__item-6 mcds-layout__left">
                                <a href="javascript:;">下载导入模板</a>
                            </div>
                            <div className="mcds-layout__column mcds-layout__item-6 mcds-layout__right">
                                <Button className="mcds-button__neutral mcds-btn__right close">
                                    取消
                                </Button>
                                <Button className="mcds-button__brand close">
                                    开始导入
                                </Button>
                            </div>
                        </div>
                    </ModalFoot>
                </Modal>
            </ModalTrigger>
        );
    }
}
