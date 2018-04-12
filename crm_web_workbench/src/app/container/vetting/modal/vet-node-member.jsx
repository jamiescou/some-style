import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { Approver } from './../approval/vet-approver';


import style from 'styles/modules/vetting/approval.scss';

export default class VetNodeMember extends React.Component {
    static propTypes = {
        pointId: PropTypes.number,
        pointName: PropTypes.string,
        members: PropTypes.array,
        users: PropTypes.array,
        votePolicy: PropTypes.string
    };

    constructor(props) {
        super(props);
        this.state = {
            show: true,
            members: props.members
        };
    }

    handleToggleNodeBody() {
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
                <i className={classnames('mcds-m__r-20 mcds-icon__arrow-line-20 mcds-cursor__pointer pull-right', {'mcds-icon__rotate-180': !show})} onClick={::this.handleToggleNodeBody} />
            </div>
        );
    }

    renderMembers() {
        let members = this.state.members;
        let result = [];

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
                result.push(<Approver key={index} name={item.name || item} url={item.avatar} deleteCallback={()=>{}} />);
            }
        });
        return result;
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
                <div className={style['approval-point__description']}>
                    {count > 1 ? <div>
                        <span className="mcds-m__r-5">*</span>
                        {votePolicyText}
                    </div> : null}
                </div>
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
