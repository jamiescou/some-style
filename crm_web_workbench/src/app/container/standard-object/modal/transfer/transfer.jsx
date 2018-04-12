/**
 * 编辑所有人
 */
import I from 'immutable';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import React, { Component } from 'react';
import {bindActionCreators} from 'redux';
import { eventEmitter } from 'utils/event';

import { formatValueBySchema } from 'utils/format-value';
import BaseEditor from 'container/share/base-field-editor';
import { fetchOneRequest, updateDateOwner } from 'requests/common/standard-object';

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

class TransferModal extends Component {
    static propTypes = {
        // standardObject Name
        // e.g. "Leads"
        objName: PropTypes.string.isRequired,

        // standardObject id string
        // e.g. "003bf1572d0354836905ba83aa10b522"
        id: PropTypes.string.isRequired,

        // This handler is called each create data success
        success: PropTypes.func,

        // This handler is called each create data fail
        fail: PropTypes.func,

        // 触发区域
        trigger: PropTypes.element.isRequired,

        // redux挂载的所有标准对象集合
        allObjects: PropTypes.object
    };

    constructor(props) {
        super(props);
        this.state = {
            data: null,
            loading: true,
            disabled: false
        };
    }

    refresh() {
        let { objName, id } = this.props;
        let request = fetchOneRequest(objName, id);
        request().then((res) => {
            let { body } = res;
            this.setState({
                loading: false,
                data: body
            });
            this.resetButtonDisabled();
        });
    }

    // 确认提交 按钮
    handleSubmitClick() {
        let { loading, data } = this.state;
        if (loading) {
            return notify.add('加载中,请稍后!');
        }

        let newOwner = this.refs.newOwner.getValue();
        let oldOwner = this.state.data.owner;

        if (newOwner === oldOwner) {
            return notify.add({message: '未更改拥有者', theme: 'info'});
        }

        let { objName, id, success, fail } = this.props;
        let params = {
            owner: formatValueBySchema(newOwner, I.fromJS(Schema))
        };

        let request = updateDateOwner(objName, id, data.version, params);

        this.setState({
            disabled: true
        }, () => {
            request().then(res => {
                let { code = 0 } = res;

                let errMessage = {
                    107624: '数据已过期,请重新刷新后重试',
                    107625: '数据可能已经被删除,请刷新后重试'
                }[code];

                if (errMessage) {
                    return notify.add({message: errMessage, theme: 'error'});
                }
                success(res);
                this.resetState();
                this.closeModal();
                notify.add('拥有者更新成功,界面即将更新');

                setTimeout(function() {
                    eventEmitter.emit('refreshDetail');
                }, 500);
            }, err => {
                fail(err);
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

    // 渲染 modal 中间的内容
    renderModalBody() {
        let { loading, data } = this.state;
        let { allObjects, objName } = this.props;
        let objDisplayName = null;
        let nameOfObject = allObjects.get(objName);
        if (nameOfObject){
            objDisplayName = nameOfObject.get('display');
        }
        if (loading) {
            return <span>loading</span>;
        }
        return (
            <div>
                <p className="mcds-text__weak mcds-text__size-12">{objDisplayName}拥有人</p>
                <BaseEditor
                    placeholder="搜索人员"
                    ref="newOwner"
                    schema={Schema}
                    value={data.owner} />
            </div>
        );
    }

    // 取消按钮 逻辑
    handleCancleClick() {
        this.resetState();
    }

    resetState(){
        this.setState({
            data: null,
            loading: true
        });
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
        let newTrigger = React.cloneElement(trigger, { onClick: ::this.refresh});
        return newTrigger;
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
                        {this.renderModalBody()}
                    </ModalBody>
                    <ModalFoot>
                        <span ref="handleClose" className="close" />
                        <div className="mcds-layout__column mcds-layout__right">
                            <Button className="mcds-button__neutral mcds-btn__right close" onClick={this.handleCancleClick.bind(this)}>
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

export default connect(
    state => ({
        allObjects: state.getIn(['standardObject', 'allObjects'])
    }),
    dispatch => bindActionCreators({}, dispatch)
)(TransferModal);

