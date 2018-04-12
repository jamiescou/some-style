import {connect} from 'react-redux';
import React, { Component } from 'react';
import {bindActionCreators} from 'redux';
import PropTypes from 'prop-types';
import ErrorNotify from 'container/share/error/error-notify';

import { fetchAudit } from 'redux/reducers/vetting/detailview';
import { fetchComment } from 'redux/reducers/vetting/detailview';

import {
    Modal,
    ModalTrigger,
    ModalBody,
    ModalFoot,
    Button,
    notify
} from 'carbon';

class Reject extends Component {

    constructor(props) {
        super(props);
        this.handleSubmitDisAgree = this.handleSubmitDisAgree.bind(this);
    }

    handleSubmitDisAgree() {
        let { id, votelist } = this.props;
        let param = {
            GroupId: votelist.get('GroupId') || 0,
            PointId: votelist.get('PointId'),
            Comment: 'DisAgree',
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
                <Modal className={'mcds-modal__w-520'} ref="modal">
                    <ModalBody>
                        <div className="mcds-text__center mcds-text__size-13 mcds-p__t-20 mcds-p__b-20">请确定是否拒绝此审批？</div>
                    </ModalBody>
                    <ModalFoot>
                        <span ref="handleClose" className="close" />
                        <div className="mcds-layout__column mcds-layout__right">
                            <span ref="handleClose" className="close" />
                            <Button className="mcds-button__neutral mcds-btn__right close">
                                取消
                            </Button>
                            <Button className="mcds-button__brand close" onClick={this.handleSubmitDisAgree}>
                                保存
                            </Button>
                        </div>
                    </ModalFoot>
                </Modal>
            </ModalTrigger>
        );
    }
}
Reject.propTypes = {
    trigger: PropTypes.object,
    fetchAudit: PropTypes.func,
    fetchComment: PropTypes.func,
    votelist: PropTypes.object,
    id: PropTypes.string
};

export default connect(
    null,
    dispatch => bindActionCreators({ fetchAudit, fetchComment }, dispatch)
)(Reject);

