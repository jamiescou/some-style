import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {Modal, ModalHeader, ModalBody, ModalFoot, Button} from 'carbon';


export default class VettingSkipModal extends Component {
    static propTypes = {
        onConfirm: PropTypes.func,
        showSkipModal: PropTypes.bool
    };

    constructor(props) {
        super(props);
        this.state = {
            show: props.showSkipModal
        };
    }

    componentWillReceiveProps(nextProps) {
        if (this.state.show !== nextProps.showSkipModal) {
            this.setState({
                show: nextProps.showSkipModal
            });
        }
    }
    handConfirm() {
        this.props.onConfirm();
    }
    _close() {
        this.setState({
            show: false
        });
    }
    render() {
        return (
            <Modal className="mcds-modal__w-520" show={this.state.show}>
                <ModalHeader>
                    <p className="mcds-modal__title">
                        页面即将跳转
                    </p>
                </ModalHeader>
                <ModalBody>
                    <p>您有未完成的任务，跳转将会清空，仍继续么？</p>
                </ModalBody>
                <ModalFoot>
                    <div className="mcds-layout__column mcds-layout__right">
                        <Button className="mcds-button__neutral mcds-btn__right" onClick={this._close.bind(this)}>
                            取消
                        </Button>
                        <Button className="mcds-button__brand" onClick={this.handConfirm.bind(this)}>
                            跳转
                        </Button>
                    </div>
                </ModalFoot>
            </Modal>
        );
    }
}
