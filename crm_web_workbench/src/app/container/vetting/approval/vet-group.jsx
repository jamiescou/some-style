import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import _ from 'lodash';

import { Avatar } from './vet-approver';
import AddMemberModal from '../modal/add-member';

import style from 'styles/modules/vetting/approval.scss';

export default class VetGroup extends React.Component {
    static propTypes = {
        pointId: PropTypes.number, // 节点id
        groupId: PropTypes.number, // 组id
        groupName: PropTypes.string, // 组名
        members: PropTypes.array, // 抄送 user
        outIds: PropTypes.array, // 需要排除的userId
        users: PropTypes.array, // fetch 的user数据
        addMemberCallback: PropTypes.func,
        deleteCallback: PropTypes.func
    };

    static defaultProps = {
        members: []
    };

    constructor(props) {
        super(props);
        this.state = {
            members: props.members,
            outIds: props.outIds
        };
    }

    handleAddMemberCallback(value) {
        let members = this.state.members;
        let index = value.index;
        members[index].id = value.id;
        members[index].name = value.name;
        members[index].pointId = value.pointId;
        members[index].groupId = value.groupId;
        delete members[index].MemberType;

        let outIds = this.state.outIds.slice();
        outIds.push(value.id);

        this.setState({
            members,
            outIds
        });
        this.props.addMemberCallback(value);
    }

    handleDeleteCallback(index) {
        let members = this.state.members;
        members[index].MemberType = 'Undecided';

        let outIds = this.state.outIds.slice();
        let userId = members[index].id;
        outIds = _.difference(outIds, [userId]);

        this.setState({
            members,
            outIds
        });

        this.props.deleteCallback(members[index]);
    }

    renderAvatars() {
        let result = [];
        let members = this.state.members;
        if (!members) {
            return;
        }
        members.forEach((member, index) => {
            if (member.MemberType === 'Undecided') {
                result.push(<AddMemberModal
                    title="添加审批人员"
                    content="审批人"
                    key={index}
                    outIds={this.state.outIds}
                    pointId={this.props.pointId}
                    groupId={this.props.groupId}
                    index={index}
                    data={this.props.users}
                    addMemberCallback={::this.handleAddMemberCallback} />);
            } else {
                result.push(<Avatar key={index} className="mcds-m__r-12" showIcon={member.id ? true : false} deleteCallback={this.handleDeleteCallback.bind(this, index)} />);
            }
        });
        return result;
    }

    renderMembers() {
        let result = [];
        let members = this.state.members;
        if (!members) {
            return;
        }
        members.forEach((member, index) => {
            if (member.MemberType !== 'Undecided') {
                result.push(
                    <span key={index} className={style['approval-point__group__member-name']}>
                        {member.name || member}
                    </span>
                );
            }
        });
        return result;
    }

    render() {
        let { groupName } = this.props;
        return (
            <div className="mcds-layout__item-6 mcds-p__r-20 mcds-m__b-20">
                <div className={classnames(style['approval-point__group'])}>
                    <div>
                        {this.renderAvatars()}
                    </div>

                    <p className={style['approval-point__group__title']}>
                        {groupName}
                    </p>
                    <p className={style['approval-point__group__description']}>
	                    包含成员
	                </p>

                    <div className="mcds-m__t-5">
                        {this.renderMembers()}
                    </div>
                </div>
            </div>
        );
    }
}
