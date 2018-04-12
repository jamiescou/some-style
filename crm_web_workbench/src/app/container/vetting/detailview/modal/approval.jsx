import {connect} from 'react-redux';
import React, { Component } from 'react';
import {bindActionCreators} from 'redux';
import PropTypes from 'prop-types';

import { fetchComment } from 'redux/reducers/vetting/detailview';
import { fetchAudit } from 'redux/reducers/vetting/detailview';
import ErrorNotify from 'container/share/error/error-notify';


import {
    Modal,
    ModalTrigger,
    ModalBody,
    ModalFoot,
    Button,
    notify
} from 'carbon';

class Approval extends Component {
    constructor() {
        super();
        this.handleSubmitAgree = this.handleSubmitAgree.bind(this);
    }

    handleSubmitAgree() {
        let { id, votelist } = this.props;
        let param = {
            GroupId: votelist.get('GroupId') || 0,
            PointId: votelist.get('PointId'),
            Comment: 'Agree',
            MemberId: votelist.get('MemberId')
        };
        this.props.fetchAudit(id, param).then(()=>{
            this.props.fetchComment(id);
            notify.add('操作成功');
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
                        <div className="mcds-text__center mcds-text__size-13 mcds-p__t-20 mcds-p__b-20">请确定是否同意此审批？</div>
                    </ModalBody>
                    <ModalFoot>
                        <span ref="handleClose" className="close" />
                        <div className="mcds-layout__column mcds-layout__right">
                            <span ref="handleClose" className="close" />
                            <Button className="mcds-button__neutral mcds-btn__right close">
                                取消
                            </Button>
                            <Button className="mcds-button__brand close" onClick={this.handleSubmitAgree}>
                                保存
                            </Button>
                        </div>
                    </ModalFoot>
                </Modal>
            </ModalTrigger>
        );
    }
}

Approval.propTypes = {
    votelist: PropTypes.object,
    id: PropTypes.string,
    fetchAudit: PropTypes.func,
    fetchComment: PropTypes.func,
    trigger: PropTypes.object
};

export default connect(
    null,
    dispatch => bindActionCreators({ fetchAudit, fetchComment }, dispatch)
)(Approval);

