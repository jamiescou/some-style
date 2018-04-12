import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { Avatar } from './../approval/vet-approver';

import style from 'styles/modules/vetting/approval.scss';

export default class VetGroup extends React.Component {
    static propTypes = {
        groupName: PropTypes.string,
        members: PropTypes.array
    }

    constructor(props) {
        super(props);
        this.state = {
            members: this.props.members
        };
    }

    renderAvatars() {
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
        members.forEach((member, index) => {
            if (member.MemberType === 'Undecided') {
                result.push(add);
            } else {
                result.push(<Avatar key={index} className="mcds-m__r-12" deleteCallback={()=>{}} />);
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
