import { connect } from 'react-redux';
import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { browserHistory } from 'react-router';

import classnames from 'classnames';

import { fetchList } from 'redux/reducers/standard-object/listview/list';
import { fetchtempData } from 'redux/reducers/setup/vetting';
import { createApproval } from 'redux/reducers/vetting/listview';
import { fetchRelatedDataListByIds } from 'redux/reducers/standard-object/related-object/data';

import ErrorNotify from 'container/share/error/error-notify';
import VetNodeMember from './vet-node-member';
import VetNodeGroup from './vet-node-group';
import VetCopyTo from './vet-copy-to';
import { resetApprovalParam } from '../../__base/approval';
import VettingSkipModal from '../modal/skip-modal';

import style from 'styles/modules/vetting/approval.scss';

import {
    Input,
    TextArea,
    Loading,
    notify
} from 'carbon';
import { Link } from 'react-router';
import VettingFooter from '../components/footer';

class Approval extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            requireName: false,
            requireDescription: false,
            loading: true,
            ccIds: {},
            members: [],
            managerLevel: 0,
            managerSet: {},
            managerStartIndex: 1, // 从第一层manager信息获取
            showSkipModal: false,
            owner: (this.props.info && this.props.info.owner) || this.props.userId
            // owner: '141efdc89af3617a71b3f76c653f9443'
        };
    }

    componentWillMount() {
        let { info, param } = this.props;
        if (!info || !param) {
            // 如果用没有有 objName 直接返回到主页
            this.props.router.push('/');
        }
        this.returnPage = '/vetting/choose';
        this.unListen = this.context.router.listenBefore((a, b) => {
            this.giveup(a, b);
        });
    }

    componentDidMount() {
        let { info, param, params } = this.props;
        let templateId = params.id;
        if (!info || !param) {
            return false;
        }
        Promise.all([
            this.props.fetchList('User', {order_by: 'updated_at', order_flag: 'DESC', limit: 5, offset: 0}),
            this.props.fetchtempData(templateId)
        ]).then(() => {
            this.getRelatedUsersData();
        }, (error) => {
            ErrorNotify(error);
        });
    }


    componentWillUnmount() {
        if (this.unListen && typeof this.unListen === 'function') {
            this.unListen();
        }
    }

    skipPage() {
        let { info } = this.props;
        this._cb(true);
        resetApprovalParam(info.action);
    }

    giveup(a, cb) {
        this._cb = cb;
        if (a.pathname === this.returnPage || a.pathname === this.jumpRoute) {
            cb(true);
        } else {
            this.setState({
                showSkipModal: true
            });
        }
    }

    // 获取关联的用户信息和待添加的审批人数量
    getRelatedUsersData() {
        let { data, params } = this.props;
        let { id } = params;
        let countAndIds = this.getAllUndecideCountAndIds();
        let undecideCount = countAndIds.count;
        // 审批节点里默认包含的用户的id
        let userIds = countAndIds.ids;

        // 加入抄送者id
        let ccIds = data.getIn([id, 'CCIds']);
        if (ccIds) {
            ccIds.forEach((ids) => {
                userIds.push(ids);
            });
        }

        // 加入ownerID
        let ownerId = this.state.owner;
        if (userIds && ownerId) {
            userIds.push(ownerId);
        }

        // 根据ID获取相关user信息
        this.props.fetchRelatedDataListByIds('User', userIds).then(() => {
            this.setState({
                undecideCount
            });

            this.getUserManagerInfo();
            // this.setState({
            //     loading: false
            // });

        }, (error) => {
            ErrorNotify(error);
        });
    }

    // 获取用户经理的信息
    getUserManagerInfo() {
        let managerLevel = this.state.managerLevel;
        if (managerLevel === 0) {
            this.setState({
                loading: false
            });
            return;
        }
        let ownerId = this.state.owner;
        if (ownerId) {
            this.fetchManagerInfo(ownerId, this.state.managerLevel);
        }
    }

    // 递归拉取用户经理的信息
    fetchManagerInfo(userId, _managerLevel) {
        let managerLevel = _managerLevel;
        if (managerLevel === 0) {
            this.setState({
                loading: false
            });
        } else {
            let userInfo = this.props.relatedUsers.get(userId);
            let managerId = userInfo.get('Manager');

            // 如果managerId 不存在，停止数据请求
            if (!managerId) {
                this.setState({
                    loading: false
                });
            } else {
                this.props.fetchRelatedDataListByIds('User', [managerId]).then(() => {
                    let managerObj = this.props.relatedUsers.get(managerId);
                    let managerSet = this.state.managerSet;
                    let startIndex = this.state.managerStartIndex;
                    managerSet[startIndex] = managerObj;
                    managerLevel--;
                    startIndex++;
                    this.setState({
                        managerSet,
                        managerStartIndex: startIndex
                    });
                    if (managerLevel >= 0) {
                        this.fetchManagerInfo(managerObj.get('id'), managerLevel);
                    }
                }, () => {
                    this.setState({
                        loading: false
                    });
                    // notify.add({message: err.error || '获取用户经理相关用户信息失败', theme: 'error'});
                });
            }
        }
    }

    // 添加一个审批人或抄送人时回调
    handleAddMemberCallback(value) {
        if (!value.pointId) {
            let ccIds = this.state.ccIds;
            ccIds[value.id] = value;
            this.setState({
                ccIds
            });
        } else {
            let members = this.state.members;
            members.push({
                pointId: value.pointId,
                groupId: value.groupId,
                userId: value.id
            });
            this.setState({
                members
            });
        }
    }

    // 删除一个审批人或抄送人时回调
    handleDeleteCallback(value) {
        if (!value.pointId) {
            let ccIds = this.state.ccIds;
            delete ccIds[value.id];
            this.setState({
                ccIds
            });
        } else {
            let members = this.state.members;
            members.forEach((member, index) => {
                if (member.userId === value.id && member.pointId === value.pointId && member.groupId === value.groupId) {
                    members.splice(index, 1);
                    return;
                }
            });
        }
    }

    handleSubmit() {
        let { members, undecideCount, name, description, ccIds, owner } = this.state;
        let { info, params, param } = this.props;
        if (this.validInput()) {
            return;
        } else if (members.length !== undecideCount) {
            notify.add({message: '有尚未添加的审批人！', theme: 'error'});
            return;
        }

        let templateId = params.id;
        let pointVoters = [];
        let groupVoters = [];
        members.forEach((member) => {
            if (member.groupId) {
                groupVoters.push({
                    PointId: member.pointId,
                    GroupId: member.groupId,
                    UserId: member.userId
                });
            } else {
                pointVoters.push({
                    PointId: member.pointId,
                    UserId: member.userId
                });
            }
        });

        let paramsObj = {
            Name: name,
            Description: description,
            RelationType: info.objName,
            OwnerId: owner,
            CCIds: Object.keys(ccIds),
            Record: param,
            PointVoters: pointVoters,
            GroupVoters: groupVoters,
            RelationId: this.returnRelationId(info)
        };

        this.props.createApproval(templateId, paramsObj)
            .then((res) => {
                notify.add('操作成功');
                // 清除state树上的数据
                resetApprovalParam(this.props.info.action);
                this.jumpRoute = `/vetting/${res.result.body.Aw.Id}`;
                browserHistory.push(this.jumpRoute);
            }, (error) => {
                ErrorNotify(error);
            });
    }

    returnRelationId(info) { // 判断当前是否是新建，如果是新建那么RelationId必须为空；
        if (info.action === 'create') {
            return '';
        }
        return (info.objId || '');
    }

    handleNameOnChange(value) {
        this.setState({
            name: value
        });
    }

    handleDescriptionOnChange(value) {
        this.setState({
            description: value
        });
    }

    // 验证输入，名称和描述都不能为空
    validInput() {
        let needValid = false;
        if (!this.state.name || this.state.name.trim() === '') {
            needValid = true;
            this.setState({
                requireName: true
            });
        }

        if (!this.state.description || this.state.description.trim() === '') {
            needValid = true;
            this.setState({
                requireDescription: true
            });
        }
        return needValid;
    }

    getUserName(userId) {
        let users = this.props.relatedUsers;
        return users.get(userId);
    }

    getUserObj(userId) {
        let users = this.props.relatedUsers;
        let userObj = users.get(userId);

        return userObj ? {
            id: userId,
            name: userObj.get('name'),
            avatar: userObj.get('Avatar')
        } : null;
    }

    // 获取抄送者姓名
    getCopyToData() {
        let { data, params } = this.props;
        let { id } = params;
        let members = data.getIn([id, 'CCIds']);
        let result = [];
        if (!members) {
            return;
        }
        members.forEach((userId) => {
            let userObj = this.getUserObj(userId);
            if (userObj) {
                result.push(userObj);
            } else {
                result.push({
                    name: '***',
                    id: userId,
                    avatar: null
                });
            }
        });
        return result;
    }

    // 获取members数组里member的UserId
    getMembersIds(members) {
        let ids = [];
        if (!members) {
            return ids;
        }

        members.forEach((member) => {
            if (member.get('MemberType') === 'SELF') {
                let id = member.get('UserId');
                ids.push(id);
            }
        });
        return ids;
    }

    // 获取单个节点下各个组的userID
    getPointOutIds(groups) {
        let result = [];
        if (!groups) {
            return result;
        }

        groups.forEach((group) => {
            let members = group.get('Members');
            let outIds = this.getMembersIds(members);
            result.push(outIds);
        });
        return result;
    }

    // 获取需要添加的审批人个数以及审批人ID
    getAllUndecideCountAndIds() {
        let { data, params } = this.props;
        let { id } = params;
        let count = 0;
        let ids = [];
        let points = data.getIn([id, 'Points']);
        if (!points) {
            return count;
        }

        points.forEach((point) => {
            let members = point.get('PointMembers');
            let groups = point.get('Groups');

            if (members) {
                let countAndIds = this.getUndecideCountAndIds(members);
                count += countAndIds.count;
                ids = ids.concat(countAndIds.ids);
            }
            if (groups) {
                groups.forEach((group) => {
                    let groupMembers = group.get('Members');
                    let countAndIds = this.getUndecideCountAndIds(groupMembers);
                    count += countAndIds.count;
                    ids = ids.concat(countAndIds.ids);
                });
            }
        });
        return {
            count,
            ids
        };
    }

    getUndecideCountAndIds(members) {
        let count = 0;
        let ids = [];
        if (!members) {
            return count;
        }
        members.forEach((member) => {
            switch (member.get('MemberType')) {
            case 'Undecided':
                count++;
                break;
            case 'SELF':
                let id = member.get('UserId');
                ids.push(id);
                break;
            case 'Manager':
                let formula = member.get('Formula');
                let managerLevel = this.getManagerLevel(formula);
                this.setState({
                    managerLevel
                });
                break;
            default:
                break;
            }
        });
        return {
            count,
            ids
        };
    }

    // 获取manager嵌套的级数,参数为公式
    getManagerLevel(formula) {
        return formula.split('.').length - 1;
    }

    // 获取审批人员姓名
    getMemberName(members) {
        let names = [];
        if (!members) {
            return;
        }

        members.forEach((member, index) => {
            switch (member.get('MemberType')) {
            case 'SELF':
                let userId = member.get('UserId');
                let user = this.getUserName(userId);
                if (user) {
                    names.push(
                        {
                            name: user.get('name'),
                            avatar: user.get('Avatar')
                        });
                } else {
                    names.push(
                        {
                            name: '***',
                            avatar: null
                        });
                }
                break;
            case 'Manager':
                let formula = member.get('Formula');
                let managerLevel = this.getManagerLevel(formula);
                let managerObj = this.state.managerSet[managerLevel];
                if (managerObj) {
                    names.push(
                        {
                            name: managerObj.get('name'),
                            avatar: managerObj.get('Avatar')
                        });
                } else {
                    names.push(
                        {
                            name: '***',
                            avatar: null
                        });
                }
                break;
            case 'Undecided':
                names.push({
                    id: index,
                    MemberType: 'Undecided'
                });
                break;
            default:
                break;
            }
        });
        return names;
    }

    // 获取组,把原生的groups信息进行转换
    getGroups(groups) {
        let resultGroups = [];
        if (!groups) {
            return;
        }

        groups.forEach((group) => {
            let members = group.get('Members');
            members = this.getMemberName(members);
            resultGroups.push({
                Id: group.get('Id'),
                Name: group.get('Name'),
                Members: members
            });
        });

        return resultGroups;
    }

    renderPageHeader() {
        let Name = '发起审批';
        return (
            <div className={classnames('mcds-pageheader', style.header)}>
                <div className="mcds-grid mcds-pageheader__header">
                    <div className="mcds-pageheader__header-left">
                        <div className="mcds-media">
                            <div className="mcds-media__figure mcds-p__t-6 mcds-m__r-30">
                                <div className={style['icon-wrap']}>
                                    <i className="mcds-icon__seal-solid-24" />
                                </div>
                            </div>
                            <div className="mcds-media__body">
                                <span className="mcds-pageheader__header-left-text">审批</span>
                                <div className="mcds-pageheader__title">
                                    {Name}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={style['approval-header__foot']}>
                    <p className={style['vetting-pageheader__text']}>
                        你的保存操作经过检验条件判断后需要审批，请在以下审批中选择一个只有通过审批后，才会对相应的审批字段进行保存（<span>其余字段不会保存</span>）。
                    </p>
                </div>
            </div>
        );
    }

    // 获取抄送人员ID
    getCCIdsArray(members) {
        let result = [];
        if (!members) {
            return result;
        }

        members.forEach((member) => {
            result.push(member);
        });
        return result;
    }

    // 把Immutable的用户信息提取并转换成数组,用于给Lookup组件传data
    formatUsers(users) {
        if (!users) {
            return;
        }

        let result = [];
        users.forEach((user) => {
            if (user.get('name') !== '') {
                result.push({
                    id: user.get('id'),
                    name: user.get('name'),
                    avatar: user.get('Avatar')
                });
            }

        });
        return result.splice(0, 6);
    }

    renderLayout() {
        let { data, params } = this.props;
        let { id } = params;
        let allUsers = this.formatUsers(this.props.users);
        let members = this.getCopyToData();
        let ccOutIds = this.getCCIdsArray(data.getIn([id, 'CCIds']));
        return (
            <div ref="highlyAdaptive" className={classnames('mcds-layout__column mcds-m__t-20', style['approval-layout'])}>
                <div className="mcds-layout__item-6 mcds-p__l-20 mcds-p__r-10">
                    {this.renderLeftSide()}
                </div>
                <div className={classnames('mcds-layout__ite-6 mcds-p__r-20 mcds-p__l-10', style['card-right'])}>
                    <article className={style['approval-border']}>
                        <div className="mcds-card__header mcds-grid  mcds-m__b-0">
                            <header className="mcds-media mcds-card__media">
                                <div className="mcds-media__figure">
                                    <div className={style['icon-small__wrap']}>
                                        <i className="mcds-icon__seal-solid-24" />
                                    </div>
                                </div>
                                <div className="mcds-media__body">
                                    审批流节点
                                </div>
                            </header>
                        </div>

                        {this.renderPoints()}

                        <div className={style['approval-split-bar']} />

                        <VetCopyTo members={members} users={allUsers} outIds={ccOutIds} addMemberCallback={::this.handleAddMemberCallback} deleteCallback={::this.handleDeleteCallback} />
                    </article>
                </div>
            </div>
        );
    }

    renderLeftSide() {
        return (
            <article className={style['approval-border']}>
                <div className="mcds-card__header mcds-grid">
                    <header className="mcds-media mcds-card__media">
                        <div className="mcds-media__figure">
                            <div className={style['icon-small__wrap']}>
                                <i className="mcds-icon__seal-solid-24" />
                            </div>
                        </div>
                        <div className="mcds-media__body">
                            审批信息
                        </div>
                    </header>
                </div>
                <div className={'mcds-layout__column mcds-card__body mcds-p__t-10'}>
                    <div className="mcds-layout__item-6 mcds-p__r-15">
                        <label className="mcds-label">
                            <span className={style['approval-require']}>*</span>
                            审批名称
                        </label>
                        <Input error={this.state.requireName} ref="templateName" placeholder="审批名称" onChange={::this.handleNameOnChange} />
                        { this.state.requireName && <span className="mcds-span__required">该字段为必填字段</span> }
                    </div>
                    <div className="mcds-layout__item-12 mcds-m__t-20 mcds-m__b-30">
                        <label className="mcds-label">
                            <span className={style['approval-require']}>*</span>
                            描述
                        </label>
                        <TextArea style={{resize: 'none'}} error={this.state.requireDescription} ref="templateDescription" onChange={::this.handleDescriptionOnChange} />
                        { this.state.requireDescription && <span className="mcds-span__required">该字段为必填字段</span> }
                    </div>
                </div>
            </article>
        );
    }

    renderPoints() {
        let { data, params } = this.props;
        let { id } = params;
        let result = [];
        let points = data.getIn([id, 'Points']);
        if (!points) {
            return;
        }
        let allUsers = this.formatUsers(this.props.users);

        points.forEach((item, index) => {
            let pointId = item.get('Id');
            let pointName = item.get('Name');
            let groups = item.get('Groups');
            let members = item.get('PointMembers');
            let votePolicy = item.get('VotePolicy');

            if (groups) {
                let groupsOutIds = this.getPointOutIds(groups);
                let outIds = this.getMembersIds(members);
                groups = this.getGroups(groups);
                members = this.getMemberName(members);
                result.push(
                    <VetNodeGroup
                        key={index} outIds={outIds} groupsOutIds={groupsOutIds} pointId={pointId} pointName={pointName}
                        votePolicy={votePolicy}
                        groups={groups} pointMembers={members} users={allUsers} addMemberCallback={::this.handleAddMemberCallback} deleteCallback={::this.handleDeleteCallback} />
                );
            } else {
                let testmembers = this.getMemberName(members);
                let outIds = this.getMembersIds(members);
                result.push(
                    <VetNodeMember
                        key={index} outIds={outIds} pointId={pointId} pointName={pointName} members={testmembers}
                        votePolicy={votePolicy}
                        users={allUsers} addMemberCallback={::this.handleAddMemberCallback} deleteCallback={::this.handleDeleteCallback} />
                );
            }
        });
        return result;
    }

    renderBottomBar() {
        return (
            <VettingFooter>
                <Link className="pull-left" to={'/vetting/choose'} >上一步</Link>
                <a className="pull-right" onClick={::this.handleSubmit}>提交</a>
            </VettingFooter>
        );
    }

    render() {
        if (this.state.loading) {
            return (
                <div className="demo mcds-layout__row mcds-layout__middle mcds-layout__center" style={{height: '50%'}}>
                    <div className="mcds-layout__item-12">
                        <Loading theme="logo" model="small" />
                    </div>
                </div>
            );
        }

        return (
            <div>
                <VettingSkipModal showSkipModal={this.state.showSkipModal} onConfirm={::this.skipPage} />
                <div className="mcds-layout__column">
                    <div className="mcds-layout__item-12">
                        {this.renderPageHeader()}
                    </div>
                    <div className="mcds-layout__item-12">
                        {this.renderLayout()}
                    </div>
                </div>
                {this.renderBottomBar()}
            </div>
        );
    }
}

Approval.propTypes = {
    requireName: PropTypes.bool, // 审批名称是否必填
    requireDescription: PropTypes.bool, // 描述信息是否必填
    data: PropTypes.object, // 模板信息
    param: PropTypes.object, // 修改或创建的条目记录信息
    params: PropTypes.object, // 模板参数
    router: PropTypes.object, // 路由
    info: PropTypes.object, // 上页面传过来的，里面存储ownerId
    users: PropTypes.object, // 添加审批或者抄送时的默认数据
    relatedUsers: PropTypes.object, // 页面中出现的所有审批人抄送人的信息
    userId: PropTypes.string, // 当前登录用户ID
    fetchList: PropTypes.func, // 获取默认用户信息的方法
    fetchtempData: PropTypes.func, // 获取审批模板
    createApproval: PropTypes.func, // 发起审批
    fetchRelatedDataListByIds: PropTypes.func // 根据ID获取user信息
};

Approval.contextTypes = {
    router: PropTypes.object
};

export default connect(
    state => ({
        userId: state.getIn(['userProfile', 'userId']),
        users: state.getIn(['standardObject', 'listview', 'list', 'data']),
        relatedUsers: state.getIn(['standardObject', 'relatedObject', 'User']),
        data: state.getIn(['setup', 'vetting', 'data']),
        param: state.getIn(['vetting', 'listview', 'param']),
        info: state.getIn(['vetting', 'listview', 'info'])
    }),
    dispatch => bindActionCreators({fetchList, fetchtempData, createApproval, fetchRelatedDataListByIds}, dispatch)
)(Approval);

