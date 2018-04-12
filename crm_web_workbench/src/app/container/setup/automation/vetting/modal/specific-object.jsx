import React from 'react';
import PropTypes from 'prop-types';

import {
    ModalTrigger,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFoot,
    Button
} from 'carbon';

export default class SpecificObject extends React.Component {
    static propTypes = {
        trigger: PropTypes.element.isRequired
    };

    render() {
        return (
            <ModalTrigger>
                {this.props.trigger}
                <Modal className="mcds-modal__w-820">
                    <ModalHeader>
                        <i className="mcds-modal__close mcds-icon__close-line-20" />
                        <p className="mcds-modal__title">
                            新建
                        </p>
                    </ModalHeader>
                    <ModalBody>
                        body
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
