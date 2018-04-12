import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Cookies from 'cookies-js';
import {
    Modal,
    ModalHeader,
    ModalBody,
    ModalFoot,
    Button
} from 'carbon';

export default class ExpiresModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: this.props.showSigninModal
        };
    }

    componentWillReceiveProps(nextProps) {
        if (this.state.show !== nextProps.showSigninModal) {
            this.setState({
                show: nextProps.showSigninModal
            });
        }
    }

    _redirect(){
        let expires = new Date();
        expires.setTime(expires.getTime() - 1); // 过期
        Cookies.set('_accountToken', '', {expires: expires});
        Cookies.set('_accessToken', '', {expires: expires});
        Cookies.set('_refreshToken', '', {expires: expires});
        window.location.href = '/signin';
    }

    render() {
        return (
            <Modal className="mcds-modal__w-520" show={this.state.show}>
                <ModalHeader>
                    <p className="mcds-modal__title">
                        登录状态已过期
                    </p>
                </ModalHeader>
                <ModalBody>
                    <p>登录状态已过期，请重新登录</p>
                </ModalBody>
                <ModalFoot>
                    <div className="mcds-layout__column mcds-layout__right">
                        <Button className="mcds-button__brand" onClick={this._redirect.bind(this)}>
                            确定
                        </Button>
                    </div>
                </ModalFoot>
            </Modal>
        );
    }
}

ExpiresModal.propTypes = {
    showSigninModal: PropTypes.bool
};
