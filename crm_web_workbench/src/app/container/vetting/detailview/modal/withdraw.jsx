import {connect} from 'react-redux';
import React, { Component } from 'react';
import {bindActionCreators} from 'redux';
import { browserHistory } from 'react-router';
import PropTypes from 'prop-types';
import ErrorNotify from 'container/share/error/error-notify';

import { fetchRevoke } from 'redux/reducers/vetting/detailview';

import {
    Modal,
    ModalTrigger,
    ModalBody,
    ModalFoot,
    Button,
    notify
} from 'carbon';

class Withdraw extends Component {
    constructor(props) {
        super(props);
        this.handleSubmitWithdraw = this.handleSubmitWithdraw.bind(this);
    }

    handleSubmitWithdraw() {
        let { id } = this.props;
        this.props.fetchRevoke(id).then( () => {
            notify.add('操作成功');
            browserHistory.push('/vetting');
        }, err=>{
            ErrorNotify(err);
        });
    }

    render() {
        return (
            <ModalTrigger>
                {this.props.trigger}
                <Modal className="mcds-modal__w-520" ref="modal">
                    <ModalBody>
                        <div className="mcds-text__center mcds-text__size-13 mcds-p__t-20 mcds-p__b-20">请确定是否撤回此审批？</div>
                    </ModalBody>
                    <ModalFoot>
                        <span ref="handleClose" className="close" />
                        <div className="mcds-layout__column mcds-layout__right">
                            <span ref="handleClose" className="close" />
                            <Button className="mcds-button__neutral mcds-btn__right close">
                                取消
                            </Button>
                            <Button className="mcds-button__brand close" onClick={this.handleSubmitWithdraw}>
                                保存
                            </Button>
                        </div>
                    </ModalFoot>
                </Modal>
            </ModalTrigger>
        );
    }
}

Withdraw.propTypes = {
    fetchRevoke: PropTypes.func,
    id: PropTypes.string,
    trigger: PropTypes.object
};

export default connect(
    null,
    dispatch => bindActionCreators({ fetchRevoke }, dispatch)
)(Withdraw);

