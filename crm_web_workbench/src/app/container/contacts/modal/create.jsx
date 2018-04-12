import I from 'immutable';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import React, { Component } from 'react';
import {bindActionCreators} from 'redux';
import { trim } from 'utils/dom';

import { inviteRequest } from 'requests/common/setup-user';
import { formatValueBySchema } from 'utils/format-value';

import ErrorNotify from 'container/share/error/error-notify';

import {
    Modal,
    ModalTrigger,
    ModalHeader,
    ModalBody,
    ModalFoot,
    Button,
    Phone,
    Input,
    notify
} from 'carbon';

class CreateModal extends Component {
    static propTypes = {
        // 触发区域
        trigger: PropTypes.element.isRequired
    };
    constructor(props) {
        super(props);
        this.state = {
            phone: null,
            name: null,
            disabled: false,
            phoneErr: false,
            nameErr: false
        };
    }
    closeModal() {
        if (this.refs.handleClose && this.refs.handleClose.click) {
            this.refs.handleClose.click();
        }
    }

    handleSubmitClick() {
        let { phone, name } = this.state;
        if ( !name ) {
            this.setState({
                nameErr: true
            });
        } else if ( !phone ) {
            this.setState({
                phoneErr: true
            });
        } else {
            inviteRequest(phone, name).then(() => {
                notify.add(`邀请${name}成功`);
                this.closeModal();
            }, (error) => {
                ErrorNotify(error);
            });
        }
    }
    render() {
        let { nameErr, phoneErr } = this.state;
        let resuired = <span className="mcds-span__required">*</span>;
        let dictionary = {CN: '中国', RU: '俄罗斯', US: '美国'};
        let country = 'CN';
        let countries = ['CN', 'US', 'RU'];
        return (
            <ModalTrigger>
                {this.props.trigger}
                <Modal className="mcds-modal__w-520" ref="modal">
                    <ModalHeader>
                        <i ref="handleClose" className="mcds-modal__close mcds-icon__close-line-20 close" />
                        <p className="mcds-modal__title">
                            邀请
                        </p>
                    </ModalHeader>
                    <ModalBody style={{height: 200}}>
                        <div className="mcds-input__container" style={{marginBottom: 20}}>
                            <label className="mcds-label">{resuired}姓名</label>
                            <Input
                                onChange={(val)=>{ this.setState({name: trim(val), nameErr: false}); }}
                                placeholder="请输入姓名"
                                error={nameErr} />
                            { this.state.nameErr && <span className="mcds-span__required">姓名不能为空</span> }
                        </div>
                        <div className="mcds-input__container">
                            <label className="mcds-label">{resuired}手机号</label>
                            <Phone
                                dictionary={dictionary}
                                international={false}
                                onChange={(val)=>{ this.setState({phone: trim(formatValueBySchema(val, {type: 'phone'})), phoneErr: false}); }}
                                country={country}
                                countries={countries}
                                nativeExpanded={false}
                                placeholder="请输入手机号"
                                error={phoneErr} />
                            { this.state.phoneErr && <span className="mcds-span__required">电话不能为空</span> }
                        </div>
                    </ModalBody>
                    <ModalFoot>
                        <span ref="handleClose" className="close" />
                        <div className="mcds-layout__column mcds-layout__right">
                            <span ref="handleClose" className="close" />
                            <Button className="mcds-button__neutral mcds-btn__right close">
                                取消
                            </Button>
                            <Button disabled={this.state.disabled} className="mcds-button__brand" onClick={::this.handleSubmitClick}>
                                邀请
                            </Button>
                        </div>
                    </ModalFoot>
                </Modal>
            </ModalTrigger>
        );
    }
}

CreateModal.defaultProps = {
    success: () => {},
    fail: () => {},
    defaultValue: I.fromJS({})
};

export default connect(
    null,
    dispatch => bindActionCreators({}, dispatch)
)(CreateModal);
