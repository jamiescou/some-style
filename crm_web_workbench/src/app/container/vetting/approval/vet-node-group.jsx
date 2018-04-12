import React from 'react';
import classnames from 'classnames';
import _ from 'lodash';

import { Approver } from './vet-approver';
import PropTypes from 'prop-types';

import VetGroup from './vet-group';
import AddMemberModal from '../modal/add-member';

import style from 'styles/modules/vetting/approval.scss';

export default class VetNodeGroup extends React.Component {
    static propTypes = {
        pointId: PropTypes.number.isRequired, // 节点id
        pointName: PropTypes.string.isRequired, // 节点名字
        groups: PropTypes.array, // 节点内的组
        pointMembers: PropTypes.array, // 审批人
        outIds: PropTypes.array, // 需要排除的userId
        groupsOutIds: PropTypes.array, // 需要排除的组Id
        users: PropTypes.array, // fetch 的user数据
        addMemberCallback: PropTypes.func,
        deleteCallback: PropTypes.func,
        votePolicy: PropTypes.string // 用来判断节点文本
    };

    constructor(props) {
        super(props);
        this.state = {
            show: true,
            members: props.pointMembers,
            outIds: props.outIds
        };
    }

    handleHideNodeBody() {
        this.setState({
            show: !this.state.show
        });
    }

    handleAddMemberCallback(value) {
        if (!value.groupId) {
            let members = this.state.members;
            let index = value.index;
            members[index].id = value.id;
            members[index].name = value.name;
            members[index].pointId = value.pointId;
            members[index].groupId = value.groupId;
            delete members[index].MemberType;

            let outIds = this.state.outIds;
            outIds.push(value.id);

            this.setState({
                members,
                outIds
            });
        }
        this.props.addMemberCallback(value);
    }

    handleDeleteCallback(value) {
        if (!value.groupId) {
            let members = this.state.members;
            let index = value;
            members[index].MemberType = 'Undecided';

            let outIds = this.state.outIds;
            let userId = members[index].id;
            outIds = _.difference(outIds, [userId]);

            this.setState({
                members,
                outIds
            });
            this.props.deleteCallback(members[index]);
        } else {
            this.props.deleteCallback(value);
        }
    }

    renderNodeHeader() {
        let show = this.state.show;
        let { pointName } = this.props;
        return (
            <div className={style['approval-point__title']}>
                {pointName}
                <i className={classnames('mcds-m__r-20 mcds-icon__arrow-line-20 mcds-cursor__pointer pull-right', {'mcds-icon__rotate-180': !show})} onClick={::this.handleHideNodeBody} />
            </div>
        );
    }

    renderNodeBody() {
        let { votePolicy, groups } = this.props;
        let votePolicyText = '其中一个审批人 / 审批组通过即可';
        if ( votePolicy === 'AND') {
            votePolicyText = '全体审批人 / 审批组通过方可';
        }
        let count = 0;
        count+=groups.length;
        if (this.props.pointMembers) {
            count+=this.props.pointMembers.length;
        }
        return (
            <div>
                <p className={style['approval-point__description']}>
                    {count > 1 ? <div>
                        <span className="mcds-m__r-5">*</span>
                        {votePolicyText}
                    </div> : null}
                </p>
                <div className="mcds-m__t-10 mcds-layout__column">
                    {this.renderGroups()}
                    {this.renderMembers()}
                </div>
            </div>
        );
    }

    renderGroups() {
        let result = [];
        let { groups } = this.props;
        if (!groups) {
            return;
        }

        groups.forEach((group, index) => {
            let groupName = group.Name;
            let members = group.Members;
            let outIds = this.props.groupsOutIds[index];

            result.push(<VetGroup
                key={index} outIds={outIds} pointId={this.props.pointId} groupId={group.Id} groupName={groupName}
                members={members} users={this.props.users} addMemberCallback={::this.handleAddMemberCallback} deleteCallback={::this.handleDeleteCallback} />);
        });
        return result;
    }

    renderMembers() {
        let result = [];
        let members = this.state.members;
        if (!members) {
            return;
        }

        members.forEach((item, index) => {
            if (item.MemberType === 'Undecided') {
                result.push(<AddMemberModal
                    title="添加审批人员"
                    content="审批人"
                    key={index}
                    outIds={this.state.outIds}
                    pointId={this.props.pointId}
                    index={index}
                    data={this.props.users}
                    addMemberCallback={::this.handleAddMemberCallback} />);
            } else {
                result.push(<Approver key={index} name={item.name || item} showIcon={item.id ? true : false} deleteCallback={this.handleDeleteCallback.bind(this, index)} />);
            }
        });
        return result;
    }

    render() {
        let show = this.state.show;
        return (
            <div className="mcds-p__l-20 mcds-divider__bottom">
                <div className={classnames({'mcds-p__b-20': !show})}>
                    {this.renderNodeHeader()}
                    {show && this.renderNodeBody()}
                </div>
            </div>
        );
    }
}
