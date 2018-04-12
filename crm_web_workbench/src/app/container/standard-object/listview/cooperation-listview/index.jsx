import _ from 'lodash';
import I from 'immutable';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import { Loading, notify} from 'carbon';
import React, { Component } from 'react';
import {bindActionCreators} from 'redux';

import { fetchTeamMember } from 'redux/reducers/acl/team';
import { fetchMeta } from 'redux/reducers/standard-object/meta';
import { fetchList } from 'redux/reducers/standard-object/listview/list';
import { fetchItemActions } from 'redux/reducers/standard-object/action';
import { fetchObj } from 'redux/reducers/standard-object/detailview/data';

import { fetchDependency } from 'redux/reducers/standard-object/dependency';
import { fetchObjectTeamRoles } from 'redux/reducers/standard-object/team-role';
import { fetchRelatedObjectsData } from 'redux/reducers/standard-object/related-object/data';

import CooperationTable from './table';
import CooperationPageHeader from './page-header';
const accessLevelMap = {
    0: '禁止', // none
    1: '查看', // read
    2: '编辑', // edit
    3: 'super'// all
};
const SCHEMA = {
    name: {
        display_name: '名称',
        name: 'name',
        readable: true,
        writable: false,
        type: 'text'
    },
    team_member_role: {
        display_name: '协作角色',
        name: 'team_member_role',
        readable: true,
        writable: false,
        type: 'picklist'
    },
    access_level: {
        display_name: '访问权限',
        name: 'access_level',
        readable: true,
        writable: false,
        type: 'picklist'
    },
    updated_at: {
        display_name: '修改时间',
        name: 'updated_at',
        readable: true,
        writable: false,
        type: 'datetime'
    }
};

class List extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            userList: []
        };
    }

    componentDidMount() {
        let { objName, id } = this.props.params;
        this.refreshData(objName, id);
    }

    getTeamBelongUsers(userIdList, objName = 'User') {
        let idArray = {
            field: 'id',
            in_list: userIdList ? userIdList : []
        };
        let params = {
            in: JSON.stringify(idArray)
        };
        this.props.fetchList(objName, params)
            .then(res => {
                if (res.result.code === 0) {
                    let { body } = res.result;
                    this.setState({
                        loading: false,
                        userList: body.objects
                    });
                }
            });
    }
    cooperationSuccessBack(){
        let { objName, id } = this.props.params;
        let { dataDetail } = this.props;
        this.fetchMembers(objName, id, dataDetail.get('owner'));
    }
    buildLayout(props = this.props) {
        let { objName } = this.props.params;
        let { dataDetail } = this.props;
        let meta = props.meta.get(objName);
        let members = this.props.acl.get('members').toJS();
        let data = _.cloneDeep(this.state.userList);
        _.forEach(data, val => {
            if (members[val.id]) {
                val.team_member_role = members[val.id].team_member_role;
                val.access_level = accessLevelMap[members[val.id].access_level || 0];
            }
        });
        let otherProps = {
            objName: objName,
            meta: meta,
            params: props.params,
            schema: I.fromJS(SCHEMA),
            dataDetail: dataDetail,
            data: I.fromJS(data),
            queryParam: props.queryParam,
            offset: props.offset
        };
        let config = {
            fields: [
                'name',
                'team_member_role',
                'access_level',
                'updated_at'
            ],
            optionalButtons: [
                {
                    type: 'modal',
                    operation: 'edit',
                    displayName: '编辑',
                    order: []
                },
                {
                    type: 'modal',
                    operation: 'delete',
                    displayName: '删除'
                }
            ]
        };
        return (
            <div>
                <CooperationPageHeader
                    successBack={::this.cooperationSuccessBack}
                    {...otherProps} />
                <CooperationTable
                    teamRole={this.props.teamRole}
                    successBack={::this.cooperationSuccessBack}
                    memberList={this.state.memberList}
                    config={I.fromJS(config)}
                    {...otherProps} />
            </div>);
    }
    // 获取memeber列表
    fetchMembers(objName, id, owner){
        this.props.fetchTeamMember(objName, id, owner).then(() => {
            let memberList = this.props.acl.get('members');
            this.setState({
                memberList
            });
            let userIdList = _.keys(memberList.toJS());
            this.getTeamBelongUsers(userIdList);
        });
    }

    refreshData(objName, id) {
        if (!objName || !id) {
            console.warn(`the routes must have objName(${objName}) and id(${id}),but one of them maybe undefined`);
            // 如果用没有有 obj 或 id 直接返回到主页
            this.props.router.push('/');
            return false;
        }
        Promise.all([
            this.props.fetchMeta(objName),
            this.props.fetchObj(objName, id),
            this.props.fetchDependency(objName),
            this.props.fetchObjectTeamRoles(objName)
        ]).then(() => {
            let dataDetail = this.props.dataDetail;
            if (dataDetail && dataDetail.toJS) {
                this.fetchMembers(objName, id, dataDetail.get('owner'));
            }
        }, response => notify.add({message: response.error || '操作失败', theme: 'error'}));
    }

    render() {
        if (this.state.loading) {
            return (
                <div className="demo mcds-layout__row mcds-layout__middle mcds-layout__center" style={{height: '50%'}}>
                    <div className="mcds-layout__item-12" style={{marginTop: '40px'}}>
                        <Loading theme="logo" model="small" />
                    </div>
                </div>
            );
        }
        return this.buildLayout();
    }
}

List.contextTypes = {
    router: PropTypes.object
};

List.propTypes = {
    fetchObj: PropTypes.func,
    fetchDependency: PropTypes.func,
    fetchObjectTeamRoles: PropTypes.func,
    teamRole: PropTypes.object,
    fetchList: PropTypes.func,
    params: PropTypes.object,
    router: PropTypes.object,
    objName: PropTypes.string,
    fetchMeta: PropTypes.func,
    data: PropTypes.any,
    meta: PropTypes.object,
    fetchRelatedObjectsData: PropTypes.func,
    fetchTeamMember: PropTypes.func,
    dataDetail: PropTypes.object,
    acl: PropTypes.object
};

export default connect(
    state => ({
        meta: state.getIn(['standardObject', 'meta']),
        dataDetail: state.getIn(['standardObject', 'detailview', 'data']),
        data: state.getIn(['standardObject', 'listview', 'list', 'data']),
        queryParam: state.getIn(['standardObject', 'listview', 'list', 'param']),
        offset: state.getIn(['standardObject', 'listview', 'list', 'offset']),
        acl: state.getIn(['acl', 'team']),
        objName: state.getIn(['standardObject', 'listview', 'list', 'objName']),
        teamRole: state.getIn(['standardObject', 'teamRole'])
    }),
    dispatch => bindActionCreators({
        fetchObj,
        fetchList,
        fetchMeta,
        fetchRelatedObjectsData,
        fetchTeamMember,
        fetchDependency,
        fetchObjectTeamRoles,
        fetchItemActions}, dispatch)
)(List);
