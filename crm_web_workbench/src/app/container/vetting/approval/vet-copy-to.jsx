import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';


import { Approver } from './vet-approver';
import AddMemberModal from '../modal/add-member';

import style from 'styles/modules/vetting/approval.scss';

export default class VetCopyTo extends React.Component {
    static propTypes = {
        members: PropTypes.array,
        outIds: PropTypes.array,
        users: PropTypes.array,
        addMemberCallback: PropTypes.func,
        deleteCallback: PropTypes.func
    };

    static defaultProps = {
        members: []
    };

    constructor(props) {
        super(props);
        this.state = {
            users: props.members,
            addUsers: {},
            outIds: props.outIds
        };
    }

    renderMembers() {
        let members = this.state.users;
        let result = [];

        if (!members) {
            return;
        }
        members.forEach((user, index) => {
            result.push(<Approver url={user.avatar} key={index} name={user.name} />);
        });

        // 渲染新添加的抄送人
        let addUsers = Object.values(this.state.addUsers);
        addUsers.forEach((user) => {
        	result.push(<Approver url={user.avatar} key={user.id} name={user.name} showIcon={true} deleteCallback={this.handleDeleteCallback.bind(this, user.id)} />);
        });
        return result;
    }

    handleAddMember(value) {
        let addUsers = this.state.addUsers;
        addUsers[value.id] = value;

        let outIds = this.state.outIds;
        outIds.push(value.id);

        this.setState({
            addUsers,
            outIds
        });

        this.props.addMemberCallback(value);
    }

    handleDeleteCallback(userId) {
        let addUsers = this.state.addUsers;
        let deleteItem = Object.assign({}, addUsers[userId]);
        delete addUsers[userId];

        let outIds = this.state.outIds;
        outIds = _.difference(outIds, [userId]);

        this.setState({
            addUsers,
            outIds
        });

        this.props.deleteCallback(deleteItem);
    }

    render() {
        return (
            <div className={style['approval-copy-to']}>
                <div className={style['approval-copy-to__title']}>
					抄送
                </div>
                <div>
                    {this.renderMembers()}
                    <AddMemberModal title="添加抄送人员" content="抄送人" outIds={this.state.outIds} data={this.props.users} addMemberCallback={::this.handleAddMember} />
                </div>
            </div>
        );
    }
}
