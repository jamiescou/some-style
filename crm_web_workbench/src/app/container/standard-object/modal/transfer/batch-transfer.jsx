/**
 * 编辑所有人
 */
import I from 'immutable';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

import { formatValueBySchema } from 'utils/format-value';
import BaseEditor from 'container/share/base-field-editor';
import { batchUpdateDateOwner } from 'requests/common/standard-object';

import {
    Modal,
    ModalTrigger,
    ModalHeader,
    ModalBody,
    ModalFoot,
    Button,
    notify
} from 'carbon';
const Schema = {
    name: 'user_id',
    type: 'master',
    display_name: '成员',
    object_name: 'User'
};

export default class TransferModal extends Component {
    static propTypes = {
        // standardObject Name
        // e.g. "Leads"
        objName: PropTypes.string.isRequired,

        // standardObject idArray array
        idArray: PropTypes.array.isRequired,

        // This handler is called each create data success
        success: PropTypes.func,

        // This handler is called each create data fail
        fail: PropTypes.func,

        // 触发区域
        trigger: PropTypes.element.isRequired,

        // 父组件传递来的所有标准对象集合
        allObjects: PropTypes.object
    };
    constructor(){
        super();
        this.state = {
            disabled: false
        };
    }

    // 确认提交 按钮
    handleSubmitClick() {
        let owner = this.refs.newOwner.getValue();
        let { objName, idArray } = this.props;

        let params = {
            owner: formatValueBySchema(owner, I.fromJS(Schema)),
            objects: idArray
        };

        let request = batchUpdateDateOwner(objName, params);
        this.setState({
            disabled: true
        }, () => {
            request().then(res => {
                let { code = 0 } = res;
                let { success, fail } = res.body;
                success = success ? success : [];
                fail = fail ? fail : [];
                let errMessage = {
                    107624: '数据已过期,请重新刷新后重试',
                    107625: '数据可能已经被删除,请刷新后重试'
                }[code];

                if (errMessage) {
                    return notify.add({message: errMessage, theme: 'error'});
                }
                if (success.length) {
                    this.props.success(success);
                } else {
                    this.props.fail(fail);
                }
                notify.add(`当前共转移数据${idArray.length}条，成功${success.length}条，失败${fail.length}条`);
                this.closeModal();
            }, err => {
                this.props.fail(err);
                this.resetButtonDisabled();
                return notify.add('操作失败');
            });
        });
    }

    closeModal() {
        let target = this.refs.handleClose;
        if (target && target.click) {
            target.click();
        }
    }
    resetButtonDisabled() {
        setTimeout(() => {
            this.setState({
                disabled: false
            });
        }, 300);
    }
    renderTriggerButton() {
        let { trigger } = this.props;
        let newTrigger = React.cloneElement(trigger, { onClick: ::this.resetButtonDisabled});
        return newTrigger;
    }
    renderModalBodyName(){
        let { allObjects, objName } = this.props;
        let objDisplayName = null;
        let nameOfObject = allObjects.get(objName);
        if (nameOfObject){
            objDisplayName = nameOfObject.get('display');
        }
        return ( <p className="mcds-text__weak mcds-text__size-12">{objDisplayName}拥有人</p> );
    }

    render() {
        return (
            <ModalTrigger>
                {this.renderTriggerButton()}
                <Modal className="mcds-modal__w-520">
                    <ModalHeader>
                        <i className="mcds-modal__close mcds-icon__close-line-20 close" />
                        <p className="mcds-modal__title">
                            更改所有人
                        </p>
                    </ModalHeader>
                    <ModalBody>
                        {this.renderModalBodyName()}
                        <BaseEditor
                            placeholder="搜索人员"
                            ref="newOwner"
                            schema={Schema} />
                    </ModalBody>
                    <ModalFoot>
                        <span ref="handleClose" className="close" />
                        <div className="mcds-layout__column mcds-layout__right">
                            <Button className="mcds-button__neutral mcds-btn__right close">
                                取消
                            </Button>
                            <Button
                                disabled={this.state.disabled}
                                className="mcds-button__brand"
                                onClick={::this.handleSubmitClick}>
                                保存
                            </Button>
                        </div>
                    </ModalFoot>
                </Modal>
            </ModalTrigger>
        );
    }
}
TransferModal.contextTypes = {
    router: PropTypes.object.isRequired
};

TransferModal.defaultProps = {
    success: () => {},
    fail: () => {}
};
