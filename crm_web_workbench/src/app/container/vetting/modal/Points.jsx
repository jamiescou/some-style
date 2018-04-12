import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import style from 'styles/modules/vetting/approval.scss';
import {
    ModalTrigger,
    Modal,
    ModalHeader,
    ModalBody
} from 'carbon';

import { fetchtempData } from 'redux/reducers/setup/vetting';

import ErrorNotify from 'container/share/error/error-notify';
import VetNodeMember from './vet-node-member';
import VetNodeGroup from './vet-node-group';
import VetCopyTo from './vet-copy-to';
import { default_avatar } from '../../../utils/user-setting.js';



class Points extends Component {
    static propTypes = {
        id: PropTypes.string,
        user: PropTypes.object,
        users: PropTypes.object,
        info: PropTypes.object,
        userId: PropTypes.string,
        Point: PropTypes.object,
        data: PropTypes.object, // 数据源
        // 数据
        fetchtempData: PropTypes.func,
        relatedUsers: PropTypes.object,
        trigger: PropTypes.element.isRequired,
        // 触发区域
        fetchOneRequest: PropTypes.func,
        fetchRelatedDataListByIds: PropTypes.func
    };
    constructor(props){
        super(props);
        this.state = {
            data: null,
            loading: true,
            managerSet: {},
            managerLevel: 0,
            managerStartIndex: 1,
            ownerId: (props.info && props.info.owner) || props.userId
        };
    }

    componentDidMount() {
        let { id } = this.props;
        Promise.all([
            this.props.fetchtempData(id)
        ]).then(()=>{
            this.getRelatedUsersData();
        }, (error) => {
            ErrorNotify(error);
        }
        );
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
                    avatar: user.get('Avatar') || {default_avatar}
                });
            }

        });
        return result.splice(0, 6);
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
                ids.push(member.get('UserId'));
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
    // 获取需要添加的审批人个数以及审批人ID
    getAllUndecideCountAndIds() {
        let { data, id } = this.props;
        let count = 0;
        let ids = [];
        let point = data.getIn([id, 'Points']);
        if (!point) {
            return count;
        }
        point.forEach((poi) => {
            let members = poi.get('PointMembers');
            let groups = poi.get('Groups');

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

    getRelatedUsersData() {
        let { data, id } = this.props;
        let countAndIds = this.getAllUndecideCountAndIds();
        if (!countAndIds) {
            return;
        }
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
        let { ownerId } = this.state;

        if (ownerId) {
            userIds.push(ownerId);
        }
        // 根据ID获取相关user信息
        this.props.fetchRelatedDataListByIds('User', userIds).then(() => {
            this.setState({
                undecideCount,
                loading: false
            });

            this.getUserManagerInfo();

        }, (error) => {
            ErrorNotify(error);
        });
    }

    // 获取用户经理的信息
    getUserManagerInfo() {
        let {managerLevel, ownerId} = this.state;
        if (managerLevel === 0) {
            return;
        }
        if (ownerId) {
            this.fetchManagerInfo(ownerId, managerLevel);
        }
    }

    // 递归拉取用户经理的信息
    fetchManagerInfo(userId, _managerLevel) {
        let { users } = this.props;
        let managerLevel = _managerLevel;
        if (managerLevel === 0) {
            this.setState({
                loading: false
            });
        } else {
            let userInfo = users.get(userId);
            let managerId = userInfo.get('Manager');
            // 如果managerId 不存在，停止数据请求
            if (!managerId) {
                this.setState({
                    loading: false
                });
            } else {
                this.props.fetchRelatedDataListByIds('User', [managerId]).then(() => {
                    let managerObj = this.props.users.get(managerId); // 这个位置是需要从新获取一次props,以便拿到新的manager信息；
                    if (!managerObj) {
                        return;
                    }
                    let { managerSet, managerStartIndex } = this.state;
                    managerSet[managerStartIndex] = {
                        id: managerObj.get('id'),
                        name: managerObj.get('name'),
                        avatar: managerObj.get('Avatar')
                    };
                    managerLevel--;
                    managerStartIndex++;
                    this.setState({
                        managerSet,
                        managerStartIndex: managerStartIndex
                    });
                    if (managerLevel >= 0) {
                        this.fetchManagerInfo(managerObj.get('id'), managerLevel);
                    }
                }, () => {
                    this.setState({
                        loading: false
                    });
                });
            }
        }
    }
    // 获取审批人员姓名
    getMemberName(members) {
        let { users } = this.props;
        let names = [];
        if (!members) {
            return;
        }
        members.forEach((member, index) => {
            switch (member.get('MemberType')) {
            case 'SELF':
                let UserId = member.get('UserId');
                let user = users.get(UserId);
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
                            name: managerObj.name,
                            avatar: managerObj.avatar
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
    renderPoints() {
        let { data, users, id } = this.props;
        let result = [];
        let Point = data.getIn([id, 'Points']);
        if (!Point) {
            return;
        }
        let allUsers = this.formatUsers(users);
        Point.forEach((item, index) => {
            let pointId = item.get('Id');
            let pointName = item.get('Name');
            let groups = item.get('Groups');
            let members = item.get('PointMembers');
            let votePolicy = item.get('VotePolicy');
            if (groups) {
                groups = this.getGroups(groups);
                members = this.getMemberName(members);
                result.push(
                    <VetNodeGroup
                        key={index} pointId={pointId} pointName={pointName} groups={groups} pointMembers={members}
                        users={allUsers} votePolicy={votePolicy} />
                );
            } else {
                let testMember = this.getMemberName(members);
                result.push(
                    <VetNodeMember
                        key={index} pointId={pointId} pointName={pointName} members={testMember} users={allUsers}
                        votePolicy={votePolicy} />
                );
            }
        });
        return result;
    }
    // 获取组
    getGroups(groups) {
        let resultGroups = [];
        if (!groups) {
            return;
        }

        groups.forEach( group => {
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

    // 获取用户经理的姓名，flag===true时，获取用户经理的经理姓名
    getManagerName(userId, flag=false) {
        let { users } = this.props;
        let managerName;
        if (!users) {
            return;
        }

        users.forEach((user) => {
            if (user.get('id') === userId) {
                let managerId = user.get('Manager');
                if (!flag) {
                    managerName = users.get(managerId);
                    return;
                }
                managerName = users.get(managerId);
            }
        });
        return managerName;
    }

    getUserObj(userId) {
        let { users } = this.props;
        if (users) {
            let userObj = users.get(userId);
            return userObj ? {
                id: userId,
                name: userObj.get('name'),
                avatar: userObj.get('Avatar')
            } : null;
        }
    }
    // 获取抄送者姓名
    getCopyToData() {
        let { data, id } = this.props;
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
                    avatar: default_avatar
                });
            }
        });
        return result;
    }
    render() {
        let { data } = this.props;
        if (this.state.loading || !data) {
            return null;
        }
        let allUsers = this.formatUsers(this.props.users);
        let members = this.getCopyToData();
        return (
            <ModalTrigger>
                {this.props.trigger}
                <Modal className="mcds-modal__w-820 mcds-modal__auto">
                    <ModalHeader>
                        <i className="mcds-modal__close mcds-icon__close-line-20 close" />
                        <p className="mcds-modal__title">
				        	审批流节点
				      	</p>
                    </ModalHeader>
                    <ModalBody className={`${style['modal-body']} mcds-p__l-40)`}>
                        <article className={style['approval-border']}>
                            <div className="mcds-card__header mcds-grid mcds-m__b-0">
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
                            <div className={style['split-bar']} />
                            <VetCopyTo members={members} users={allUsers} />
                        </article>
                    </ModalBody>
                </Modal>
            </ModalTrigger>
        );
    }
}
export default connect(
    state => ({
        data: state.getIn(['setup', 'vetting', 'data']),
        users: state.getIn(['standardObject', 'relatedObject', 'User'])
    }),
    dispatch => bindActionCreators({ fetchtempData }, dispatch))(Points);
