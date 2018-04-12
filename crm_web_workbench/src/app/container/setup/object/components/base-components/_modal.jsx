import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import {
    Modal,
    ModalHeader,
    ModalBody,
    ModalFoot,
    Button,
    FromMultiSelect
} from 'carbon';
let style = require('styles/modules/setup/object.scss');

export default class FilterModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: this.props.active
        };
    }

    componentWillReceiveProps(nextProps) {
        if (this.state.show !== nextProps.active) {
            this.setState({
                show: nextProps.active
            });
        }
    }

    _close() {
        this.props.onClose();
    }
    _deleteViewFilter(){
        this.props.onClose();
    }
    // 渲染需要插入的字段
    renderInsertField(){
    }
    render() {
        return (
            <Modal className="mcds-modal__w-820" show={this.state.show}>
                <ModalHeader>
                    <i className="mcds-modal__close mcds-icon__close-line-20" onClick={::this._close} />
                    <p className="mcds-modal__title">
                        插入字段
                    </p>
                </ModalHeader>
                <ModalBody className="mcds-p__l-30 mcds-p__r-30">
                    <p className={classnames('mcds-text__size-12', style['text-color'])}>请选择一个字段，然后单击「插入」。后跟「小三角」的标签表示还有更多可用字段</p>
                    <div className={classnames('mcds-grid', style['modal-container'])}>
                        <FromMultiSelect className="mcds-m__t-20">
                            <li className="mcds-picklist__item">
                                Option One
                            </li>
                            <li className={classnames('mcds-picklist__item', style['position-relative'])}>
                                Option Tow
                                <i className={classnames('mcds-p__t-4 mcds-icon mcds-icon__triangle-solid-14 mcds-icon__rotate-270', style['modal-icon__positoin'])} />
                            </li>
                            <li className="mcds-picklist__item">
                                Option Three
                            </li>
                        </FromMultiSelect>
                        <FromMultiSelect className="mcds-m__t-20">
                            <li className="mcds-picklist__item">
                                Option One
                            </li>
                            <li className={classnames('mcds-picklist__item', style['position-relative'])}>
                                Option Tow
                                <i className={classnames('mcds-p__t-4 mcds-icon mcds-icon__triangle-solid-14 mcds-icon__rotate-270', style['modal-icon__positoin'])} />
                            </li>
                            <li className="mcds-picklist__item">
                                Option Three
                            </li>
                        </FromMultiSelect>
                        <FromMultiSelect className={classnames('mcds-m__t-20', style['modal-choose__w-500'])}>
                            <li className={classnames('mcds-m__t-20 mcds-text__size-12', style['text-color'])}>已选取</li>
                            <li>
                                LastModifiedBy.Contact.CreatedBy.Contact.CreatedBy.Alias
                            </li>
                            <li className={classnames('mcds-m__t-20 mcds-text__size-12', style['text-color'])}>类型</li>
                            <li>
                                文本
                            </li>
                            <li className={classnames('mcds-m__t-20 mcds-text__size-12', style['text-color'])}>API名称</li>
                            <li>
                                LastModifiedBy.Contact.CreatedBy.Contact.CreatedBy.Alias
                            </li>
                        </FromMultiSelect>
                    </div>
                </ModalBody>
                <ModalFoot>
                    <div className="mcds-layout__column mcds-layout__center">
                        <Button className="mcds-button__neutral mcds-btn__right" onClick={::this._close}>
                            关闭
                        </Button>
                        <Button className="mcds-button__brand" onClick={this._deleteViewFilter.bind(this)}>
                            插入
                        </Button>
                    </div>
                </ModalFoot>
            </Modal>
        );
    }
}

FilterModal.propTypes = {
    active: PropTypes.bool,
    onClose: PropTypes.func
};
