import _ from 'lodash';
import React, { Component } from 'react';
import {bindActionCreators} from 'redux';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import I, { is } from 'immutable';

import { formatValueBySchema, filterFormatValueByScheme } from 'utils/format-value';

import BuildEditors from './cooperator-editor';
import DetailContext from '../base-field';

import { createTeamMember } from 'redux/reducers/acl/team';

import {
    Modal,
    ModalTrigger,
    ModalHeader,
    ModalBody,
    ModalFoot,
    Button,
    notify
} from 'carbon';

const accessLevelMap = {
    0: '禁止',
    1: '查看',
    2: '编辑',
    3: 'super'
};

const checkField = (tmpParams) => {

    let emptyList = [];

    _.map(tmpParams, (v, key) => {
        if (!v) {
            emptyList.push(EditCooperatorUserSchema[key].display_name);
        }
    });

    if (emptyList.length === 0) {
        return true;
    }
    notify.add({message: `${emptyList.join('/')} 不能为空`, theme: 'error'});
    return false;
};
class EditModal extends Component {
    static propTypes = {
        objName: PropTypes.string.isRequired, // 权限对象的名称
        record: PropTypes.object.isRequired, // 操作的权限对象数据,
        value: PropTypes.object.isRequired, // 某个权限成员的权限数据
        button: PropTypes.element.isRequired, // 触发按钮
        teamRole: PropTypes.object.isRequired, // 角色列表数组
        createTeamMember: PropTypes.func,
        successBack: PropTypes.func,
        errorBack: PropTypes.func
    };

    constructor(props) {
        super(props);
        this.state = {
            history: props.value // oldValue
        };
    }

    componentWillReceiveProps(nextProps) {
        let oldValue = this.state.value;
        let newValue = nextProps.value;
        // 判断是否更新历史的值
        if (!is(oldValue, newValue)) {
            this.setState({history: newValue});
        }
    }
    checkIsChange(newPerm) {
        let { history } = this.state;
        for (let k in newPerm) {
            if (newPerm[k] !== history.get(k)) {
                return true;
            }
        }
        return false;
    }
    _buildEditItem(item) {
        let defaultValue = this.props.value.get(item.get('name')) || '';

        return (
            <div className="mcds-input__container">
                <label className="mcds-label">{item.get('display_name')}</label>
                <BuildEditors
                    ref={item.get('name')}
                    className=""
                    schema={item}
                    value={defaultValue} />
            </div>
        );
    }

    handleOnConfirm() {
        let tmpParams = {};
        let params = {};

        let { objName, record } = this.props;

        if (!objName || !record ) {
            console.log('user/modal/create must have objname&&record in props');
            return false;
        }
        let objId = record.get('id');
        let owner = record.get('owner');

        _.map(EditCooperatorUserSchema, v => {
            let tmpVal = this.refs[v.name].getValue();
            tmpParams[v.name] = formatValueBySchema(tmpVal, I.fromJS(v));
        });
        tmpParams = filterFormatValueByScheme(tmpParams, I.fromJS(EditCooperatorUserSchema));

        if (!checkField(tmpParams)) {
            return false;
        }

        if (tmpParams.user_id && tmpParams.user_id) {
            params.user_id = tmpParams.user_id;
        }


        _.map(accessLevelMap, (v, key) => {
            if (v === tmpParams.access_level){
                params.access_level = parseInt(key);
            }
        });
        params.team_member_role = tmpParams.team_role;

        if (!this.checkIsChange(params)) {
            return notify.add({message: '未修改', theme: 'info'});
        }

        this.props.createTeamMember(objName, objId, owner, params)
            .then((res) => {
                notify.add({message: '协作成员添加成功', theme: 'success'});
                this.closeModal();
                this.props.successBack(res.body);

            }, (error) => {
                notify.add({message: '协作成员添加失败', theme: 'error'});
                this.props.errorBack(error);
            });
    }

    closeModal() {
        let handleClose = this.refs.handleClose;
        if (handleClose && handleClose.click) {
            handleClose.click();
        }
    }
    getTeamRoleByObject() {
        let { objName } = this.props;
        let teamRole = this.props.teamRole.get(objName);
        if (teamRole) {
            return teamRole.toJS();
        }
        return false;
    }

    render() {
        let value = this.props.value;
        let button = this.props.button || <button>none</button>;
        let teamRoles = this.getTeamRoleByObject();
        if (teamRoles) {
            EditCooperatorUserSchema.team_role.options = teamRoles.join(';');
        }
        let name = new DetailContext({
            value: value.get('user_id'),
            schema: EditCooperatorUserSchema.user_id
        }).render();
        return (
            <ModalTrigger>
                {button}
                <Modal className="mcds-modal__w-520" ref="modal">
                    <ModalHeader>
                        <i className="mcds-modal__close mcds-icon__close-line-20 close" />
                        <p className="mcds-modal__title">
                            编辑
                        </p>
                    </ModalHeader>
                    <ModalBody style={{height: '300px'}}>
                        <div className="mcds-input__container">
                            <label className="mcds-label">协作成员</label>
                            <div className="mcds-text__line-33">
                                {name}
                            </div>
                            <div className="mcds-text__line-33 hide">
                                <BuildEditors
                                    ref="user_id"
                                    className=""
                                    schema={EditCooperatorUserSchema.user_id}
                                    value={value.get('user_id')} />
                            </div>
                        </div>
                        <div className="mcds-input__container mcds-m__t-20">
                            <label className="mcds-label">客户访问权限</label>
                            <div className="mcds-text__line-33">
                                <BuildEditors
                                    className=""
                                    ref="access_level"
                                    schema={EditCooperatorUserSchema.access_level}
                                    value={accessLevelMap[value.get('access_level') || 0]} />
                            </div>
                        </div>
                        <div className="mcds-input__container mcds-m__t-20">
                            <label className="mcds-label">协作角色{value.get('team_member_role')}</label>
                            <div className="mcds-text__line-33">
                                <BuildEditors
                                    className=""
                                    ref="team_role"
                                    schema={EditCooperatorUserSchema.team_role}
                                    value={value.get('team_member_role')} />
                            </div>
                        </div>
                    </ModalBody>
                    <ModalFoot>
                        <span ref="handleClose" className="close" />
                        <div className="mcds-layout__column mcds-layout__right">
                            <span ref="handleClose" className="close" />
                            <Button className="mcds-button__neutral mcds-btn__right close">
                                取消
                            </Button>
                            <Button className="mcds-button__brand" onClick={::this.handleOnConfirm}>
                                保存
                            </Button>
                        </div>
                    </ModalFoot>
                </Modal>
            </ModalTrigger>
        );
    }
}

EditModal.contextTypes = {
    router: PropTypes.object.isRequired
};

EditModal.defaultProps = {
    successBack: () => {},
    errorBack: () => {},
    value: I.fromJS({}),
    record: I.fromJS({})
};

export default connect(
    state => ({
        teamRole: state.getIn(['standardObject', 'teamRole'])
    }),
    dispatch => bindActionCreators({ createTeamMember }, dispatch)
)(EditModal);

let EditCooperatorUserSchema = {
    // 用buildEditor构建
    user_id: {
        name: 'user_id',
        display_name: '协作成员',
        type: 'master',
        object_name: 'User',
        readable: true
    },
    access_level: {
        name: 'access_level',
        type: 'picklist',
        display_name: '客户访问权限',
        options: '查看;编辑;禁止;super'
    },
    team_role: {
        name: 'team_role',
        display_name: '协作角色',
        type: 'picklist',
        options: 'a;b;c'
    }
};
