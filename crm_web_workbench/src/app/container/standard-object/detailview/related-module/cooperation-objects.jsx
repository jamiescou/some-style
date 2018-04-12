/**
 * 协作者
 */

import { Link } from 'react-router';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import { default_avatar } from 'utils/user-setting';
import { BuildNameLinkContext } from '../../get-suit-context';
import PopoverPanel from '../../panel/detail-popover-panel';
// 请求方法
import { fetchDataRequest } from 'requests/common/standard-object';

import {
    Loading,
    Button,
    ButtonSmallIcon,
    DropDownTrigger,
    DropDownList,
    DropDownItem,
    DropDown
} from 'carbon';

import CreateUserModal from '../modal/create-cooperator';
import DeleteUserModal from '../modal/delete-cooperator';
import EditUserModal from '../modal/edit-cooperator';

const accessLevelMap = {
    0: '禁止', // none
    1: '查看', // read
    2: '编辑', // edit
    3: 'super'// all
};


class CooperateObject extends Component {
    static propTypes = {
        acl: PropTypes.object.isRequired,
        // 对象的详情信息 immutable类型
        detail: PropTypes.object.isRequired,
        // 当前数据的对象名称
        objName: PropTypes.string.isRequired,

        // meta列表
        metaList: PropTypes.object.isRequired,
        // acl fetching status
        aclStatus: PropTypes.bool.isRequired,
        // current user's id
        currentUserId: PropTypes.string.isRequired
    };
    constructor() {
        super();
        this.state = {
            loading: true,
            defaultLength: 3,
            userList: []
        };
    }
    componentDidMount() {

    }

    componentWillReceiveProps(nextProps) {
        let newTeamDetail = nextProps.acl.get('members');
        let refreshFlag = false;
        if (newTeamDetail.size !== this.state.userList.length) {
            refreshFlag = true;
        }
        if (refreshFlag) {
            this.refreshUserInfo(nextProps);
        }
    }

    refreshUserInfo(props) {
        // acl's team info
        let aclTeamDetail = props.acl;
        // 记录的数据

        let memberList = aclTeamDetail.get('members');
        let userIdList = [];
        // console.log("memberList", memberList.toJS())
        memberList.toList().map(v => {
            userIdList.push(v.get('user_id'));
        });
        if (userIdList.length === 0) {
            this.setState({
                loading: false,
                userList: []
            });
        } else {
            this.getTeamBelongUsers(userIdList);
        }
    }

    getTeamBelongUsers(userIdList, objName = 'User') {
        let idArray = {
            field: 'id',
            in_list: userIdList ? userIdList : []
        };
        let params = {
            in: JSON.stringify(idArray)
        };
        fetchDataRequest(objName, params)()
            .then(res => {
                if (res.code === 0) {
                    let { body } = res;

                    this.setState({
                        loading: false,
                        userList: body.objects
                    });
                }
            });
    }
    renderLoadingStatus() {
        return (
            <div className="mcds-layout__row mcds-layout__middle mcds-layout__center mcds-loading ">
                <div className="mcds-layout__item-12">
                    <Loading theme="logo" model="small" />
                </div>
            </div>
        );
    }
    renderEmptyList() {
        return <div />;
    }
    buildDropDownArray(detail, objName, user, aclDetail) {
        let result = [];
        let { currentUserId } = this.props;
        // 只有数据的owenr才有权限
        if (detail.get('owner') !==  currentUserId) {
            return null;
        }
        result.push(
            <EditUserModal
                objName={objName}
                key="edit"
                record={detail}
                user={user}
                value={aclDetail}
                button={<DropDownItem className="close">编辑</DropDownItem>} />);

        result.push(
            <DeleteUserModal
                objName={objName}
                key="delete"
                record={detail}
                user={user}
                value={aclDetail}
                button={<DropDownItem className="close">删除</DropDownItem>} />);

        return (
            <DropDownTrigger target="self" autoCloseTag="close" placement="bottom-left">
                <ButtonSmallIcon icon="mcds-icon__triangle-solid-14" />
                <DropDown className="mcds-dropdown__min-no">
                    <DropDownList>
                        {result}
                    </DropDownList>
                </DropDown>
            </DropDownTrigger>
        );
    }
    renderUserList() {
        let { objName, detail, acl } = this.props;
        // 产品说明,不需要对象名称
        // let objDisplayName = objName;

        // if (metaList.get(objName)) {
        //     objDisplayName = metaList.getIn([objName, 'display_name']);
        // }
        let { userList = [] } = this.state;

        if (userList.length === 0 && !this.props.aclStatus) {
            return this.renderEmptyList();
        }

        let items = [];
        for (let i = 0; i < userList.length; i++) {

            if (i >= 3) {
                continue;
            }
            let user = userList[i];
            let aclDetail = acl.getIn(['members', userList[i].id + '']);

            if (!aclDetail) {
                continue;
            }
            let dropDownOptions = this.buildDropDownArray(detail, objName, user, aclDetail);
            let trigger = (
                <span className="mcds-truncate">
                    {BuildNameLinkContext(user.name, user.id, 'User', {className: ''})}
                </span>
            );
            let panel = (
                <PopoverPanel
                    objName="User"
                    id={user.id}
                    trigger={trigger} />
            );
            items.push(
                <li className="mcds-list__item mcds-m__b-15" key={i}>
                    <div className="mcds-media" >
                        <div className="mcds-media__figure">
                            <span className="mcds-avatar mcds-avatar__size-24">
                                <img src={user.Avatar ? user.Avatar : default_avatar} style={{height: '100%', width: '100%'}} />
                            </span>
                        </div>
                        <div className="mcds-media__body">
                            <ul className="mcds-list">
                                <li className="mcds-list__item">
                                    <div className="mcds-tile">
                                        <h3 className="mcds-tile__head mcds-tile__fun" title="title">
                                            <div className="mcds-tile__fun-block mcds-text__line-20">
                                                {panel}
                                            </div>
                                            {dropDownOptions}
                                        </h3>
                                        <div className="mcds-tile__detail">
                                            <dl className="mcds-tile__detail-list">
                                                {/*  <dt className="mcds-tile__item-label mcds-truncate" title="First Label">
                                                    姓名:
                                                </dt>
                                                <dd className="mcds-tile__item-detail mcds-truncate">
                                                    {user.name}
                                                </dd> */}
                                                <dt className="mcds-tile__item-label mcds-truncate" title="First Label">
                                                    协作角色:
                                                </dt>
                                                <dd className="mcds-tile__item-detail mcds-truncate">
                                                    {aclDetail.get('team_member_role')}
                                                </dd>

                                                <dt className="mcds-tile__item-label mcds-truncate" title="First Label">
                                                    {/* objDisplayName */}访问权限:
                                                </dt>
                                                <dd className="mcds-tile__item-detail mcds-truncate">
                                                    {accessLevelMap[aclDetail.get('access_level') || '0']}
                                                </dd>
                                            </dl>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </li>
            );
        }

        return (
            <ul className="mcds-list">
                {items}
            </ul>
        );
    }
    renderCreateButton() {
        let { objName, detail, currentUserId } = this.props;
        // 只有数据的owenr才有权限
        if (detail.get('owner') !==  currentUserId) {
            return null;
        }

        let memberList = this.props.acl.get('members');

        let userFilterArray = [];
        // 将其他的协作成员放入过滤列表
        memberList.toArray().forEach(v => {
            userFilterArray.push(v.get('user_id'));
        });
        userFilterArray.push(detail.get('owner'));

        return <CreateUserModal objName={objName} userFilter={userFilterArray} record={detail} button={<Button className="mcds-button__neutral">添加协作成员</Button>} />;
    }
    renderViewAll() {
        let { userList, defaultLength } = this.state;
        let { objName, detail } = this.props;
        let objId = detail.get('id');
        if (userList.length < defaultLength) {
            return null;
        }
        // /${objName}ID
        return <Link to={`/sObject/${objName}/cooperationList/User/${objId}`}>查看全部</Link>;
    }
    render() {
        let { userList } = this.state;
        return (
            <article className="mcds-card mcds-card__small">
                <div className="mcds-card__header mcds-grid">
                    <header className="mcds-media mcds-card__media">
                        <div className="mcds-media__figure mcds-icon__container mcds-bg__green" style={{background: '#00cebd'}} >
                            <span className="mcds-icon__menbers-solid-24 mcds-text__white" />
                        </div>
                        <div className="mcds-media__body">
                            协作成员({userList.length > 3 ? '3+' : userList.length})
                        </div>
                    </header>
                    <div>
                        {this.renderCreateButton()}
                    </div>
                </div>
                <div className="mcds-card__body mcds-card__body-loading">
                    { this.props.aclStatus ? this.renderLoadingStatus() : '' }
                    { this.renderUserList() }
                </div>
                <div className="mcds-card__footer">
                    {this.renderViewAll()}
                </div>
            </article>
        );
    }
}

CooperateObject.contextTypes = {
    router: PropTypes.object
};
export default connect(
    state => ({
        currentUserId: state.getIn(['userProfile', 'userId']),
        aclStatus: state.getIn(['acl', 'team', 'fetching']), // 请求状态每个请求都会将其置为false
        acl: state.getIn(['acl', 'team']),
        detail: state.getIn(['standardObject', 'detailview', 'data']),
        metaList: state.getIn(['standardObject', 'meta'])
    }),
    dispatch => bindActionCreators({}, dispatch)
)(CooperateObject);

