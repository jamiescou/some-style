import React from 'react';
import classnames from 'classnames';

import { Approver } from './../approval/vet-approver';
import PropTypes from 'prop-types';

import VetGroup from './vet-group';

import style from 'styles/modules/vetting/approval.scss';

export default class VetNodeGroup extends React.Component {
    static propTypes = {
        pointId: PropTypes.number,
        pointName: PropTypes.string,
        groups: PropTypes.array,
        pointMembers: PropTypes.array,
        users: PropTypes.array,
        votePolicy: PropTypes.string
    }

    constructor(props) {
        super(props);
        this.state = {
            show: true,
            members: props.pointMembers
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
            result.push(<VetGroup
                key={index} pointId={this.props.pointId} groupId={group.Id} groupName={groupName}
                members={members} users={this.props.users} />);
        });
        return result;
    }

    renderMembers() {
        let result = [];
        let members = this.state.members;
        if (!members) {
            return;
        }
        let add = (
            <div className={`mcds-m__r-10 ${style['approval-point__choose-add-icon']}`}>
                <span className="mcds-icon mcds-icon__add-line-20 mcds-text__size-12" />
            </div>
        );
        members.forEach((item, index) => {
            if (item.MemberType === 'Undecided') {
                result.push(add);
            } else {
                result.push(<Approver key={index} name={item.name || item} deleteCallback={()=>{}} />);
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
