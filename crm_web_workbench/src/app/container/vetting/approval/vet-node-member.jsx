import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import _ from 'lodash';

import { Approver } from './vet-approver';
import AddMemberModal from '../modal/add-member';


import style from 'styles/modules/vetting/approval.scss';

export default class VetNodeMember extends React.Component {
    static propTypes = {
        pointId: PropTypes.number,
        pointName: PropTypes.string,
        members: PropTypes.array,
        users: PropTypes.array,
        outIds: PropTypes.array,
        addMemberCallback: PropTypes.func,
        deleteCallback: PropTypes.func,
        votePolicy: PropTypes.string
    };

    constructor(props) {
        super(props);
        this.state = {
            show: true,
            members: this.props.members,
            outIds: this.props.outIds
        };
    }

    handleHideNodeBody() {
        this.setState({
            show: !this.state.show
        });
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

    renderMembers() {
        let members = this.state.members;
        let result = [];
        const memberType = 'Undecided';
        if (!members) {
            return;
        }
        members.forEach((item, index) => {
            if (item.MemberType === memberType) {
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
                result.push(<Approver key={index} name={item.name || item} url={item.avatar} showIcon={item.id ? true : false} deleteCallback={this.handleDeleteCallback.bind(this, index)} />);
            }
        });
        return result;
    }

    handleAddMemberCallback(value) {
        let members = this.state.members;
        let index = value.index;
        members[index].id = value.id;
        members[index].name = value.name;
        members[index].pointId = value.pointId;
        members[index].groupId = value.groupId;
        members[index].avatar = value.avatar;
        delete members[index].MemberType;
        let outIds = this.state.outIds;
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

        let outIds = this.state.outIds;
        let userId = members[index].id;
        outIds = _.difference(outIds, [userId]);

        this.setState({
            members,
            outIds
        });
        this.props.deleteCallback(members[index]);
    }

    renderNodeBody() {
        let { votePolicy, members } = this.props;
        let count = members.length;
        let votePolicyText = '其中一个审批人 / 审批组通过即可';
        if ( votePolicy === 'AND' ) {
            votePolicyText = '全体审批人 / 审批组通过方可';
        }
        return (
            <div>
                <p className={style['approval-point__description']}>
                    {count > 1 ? <div>
                        <span className="mcds-m__r-5">*</span>
                        {votePolicyText}
                    </div> : null}
                </p>
                <div className="mcds-m__t-16">
                    {this.renderMembers()}
                </div>
            </div>
        );
    }
    render() {
        let show = this.state.show;
        return (
            <div className="mcds-p__l-20 mcds-divider__bottom">
                <div className="mcds-p__b-20">
                    {this.renderNodeHeader()}
                    {show && this.renderNodeBody()}
                </div>
            </div>
        );
    }
}
