import React from 'react';
import PropTypes from 'prop-types';


import { Approver } from './../approval/vet-approver';

import style from 'styles/modules/vetting/approval.scss';

export default class VetCopyTo extends React.Component {
    static propTypes = {
        members: PropTypes.array,
        users: PropTypes.array
    }

    constructor(props) {
        super(props);
        this.state = {
            users: props.members
        };
    }

    renderMembers() {
        let members = this.state.users;
        let result = [];
        if (!members) {
            return;
        }
        members.forEach((user, index) => {
            result.push(<Approver key={index} name={user.name} url={user.avatar} />);
        });
        return result;
    }

    renderAddMember() {
        return (
            <div className={`mcds-m__r-10 ${style['approval-point__choose-add-icon']}`}>
                <span className="mcds-icon mcds-icon__add-line-20 mcds-text__size-12" />
            </div>
        );
    }

    render() {
        return (
            <div className={style['approval-copy-to']}>
                <div className={style['approval-copy-to__title']}>
					抄送
                </div>
                <div>
                    {this.renderMembers()}
                    {this.renderAddMember()}
                </div>
            </div>
        );
    }
}
