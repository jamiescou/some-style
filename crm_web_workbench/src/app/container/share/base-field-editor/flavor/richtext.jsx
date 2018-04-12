import React, { Component } from 'react';

import { commonPtys } from '../util';

import {
    Input,
    Editor,
    ModalTrigger,
    ModalHeader,
    Modal,
    ModalBody,
    ModalFoot,
    Button
} from 'carbon';

export default class BaseRichText extends Component {
    static propTypes = {
        ...commonPtys
    }

    constructor(props) {
        super(props);
    }
    handleOnChange() {
        let { onChange } = this.props;
        let html = this.refs.richtext_editor.html();
        onChange(html);
    }
    buildField() {

        let { value, schema, error = false } = this.props;

        return (
            <ModalTrigger>
                <Input error={error} value={value || ''} placeholder={`请输入${schema.display_name}`} />
                <Modal className="mcds-modal__w-820">
                    <ModalHeader>
                        <i className="mcds-modal__close mcds-icon__close-line-20 close" />
                        <p className="mcds-modal__title">
                            富文本编辑
                        </p>
                    </ModalHeader>
                    <ModalBody>
                        <Editor placeholder="123131" error={false} defaultValue={value || ''} ref="richtext_editor" />
                    </ModalBody>
                    <ModalFoot>
                        <div className="mcds-layout__column mcds-layout__right">
                            <Button className="mcds-button__neutral mcds-btn__right close">
                                取消
                            </Button>
                            <Button
                                className="mcds-button__brand close"
                                onClick={this.handleOnChange.bind(this)}>
                                保存
                            </Button>
                        </div>
                    </ModalFoot>
                </Modal>
            </ModalTrigger>
        );
    }

    render() {
        return this.buildField();
    }
}
