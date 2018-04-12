import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import { isImmutable } from 'immutable';
import { removeTeamMember } from 'redux/reducers/acl/team';

import {
    Modal,
    ModalTrigger,
    ModalBody,
    ModalFoot,
    notify,
    Button
} from 'carbon';


class DeleteModal extends Component {
    static propTypes = {
        objName: PropTypes.string.isRequired, // 权限对象的名称
        record: PropTypes.object.isRequired, // 操作的权限对象数据
        user: PropTypes.object.isRequired, // 某个权限成员的权限数据
        button: PropTypes.element.isRequired, // 触发按钮
        successBack: PropTypes.func,
        errorBack: PropTypes.func,
        removeTeamMember: PropTypes.func
    };
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    onConfirm(){
        let { objName, record, user } = this.props;

        let objId = record.get('id');
        let owner = record.get('owner');

        if (!objName || !record ) {
            console.error('user/modal/delete must have objname&&record in props');
            return false;
        }
        let userId = 0;

        userId = isImmutable(user) ? user.get('id') : user.id;

        this.props.removeTeamMember(objName, objId, owner, userId)
            .then(() => {
                this.props.successBack();
                this.closeModal();
                notify.add({message: '协作成员删除成功', theme: 'success'});
            });
    }
    closeModal() {
        let handleClose = this.refs.handleClose;
        if (handleClose && handleClose.click) {
            handleClose.click();
        }
    }
    render() {
        let button = this.props.button;
        return (
            <ModalTrigger>
                {button}
                <Modal className="mcds-modal__w-520">
                    <ModalBody>
                        <i className="mcds-modal__close mcds-icon__close-line-20 close" />
                        <p className="mcds-text__center mcds-m__b-20 mcds-m__t-20">是否确认删除此协作成员？</p>
                    </ModalBody>
                    <ModalFoot>

                        <div className="mcds-layout__column mcds-layout__right">
                            <span ref="handleClose" className="close" />
                            <Button className="mcds-button__neutral mcds-btn__right mcds-text__weak close">
                                取消
                            </Button>
                            <Button
                                className="mcds-button__destructive"
                                onClick={this.onConfirm.bind(this)}>
                                删除
                            </Button>
                        </div>
                    </ModalFoot>
                </Modal>
            </ModalTrigger>
        );
    }
}

DeleteModal.defaultProps = {
    successBack: () => {},
    errorBack: () => {}
};
export default connect(
    () => ({}),
    dispatch => bindActionCreators({ removeTeamMember }, dispatch)
)(DeleteModal);
