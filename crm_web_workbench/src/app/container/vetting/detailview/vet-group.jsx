import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import { Link } from 'react-router';

import classnames from 'classnames';
import moment from 'moment';

import VetCard from './vet-card.jsx';
import { default_avatar } from 'utils/user-setting.js';

import { fetchObj } from 'redux/reducers/standard-object/detailview/data';
import { fetchRelatedDataListByIds } from 'redux/reducers/standard-object/related-object/data';

import {
    Line,
    Avatar
} from './components';

import styles from 'styles/modules/vetting/vet-card.scss';

@connect(
    state => ({
        relatedUsers: state.getIn(['standardObject', 'relatedObject', 'User'])
    }),
    dispatch => bindActionCreators({ fetchObj, fetchRelatedDataListByIds }, dispatch)
)
export default class VetGroup extends Component{
    static propTypes = {
        className: PropTypes.string,
        members: PropTypes.object,
        relatedUsers: PropTypes.object, // user的数据源    
        fetchRelatedDataListByIds: PropTypes.func,
        userName: PropTypes.string
    };
    constructor(props){
        super(props);
        this.state = {
            users: null,
            members: props.members
        };
    }

    componentDidMount () {
        this.getGroups();
    }

    componentWillReceiveProps (nextProps) {
        this.setState({
            members: nextProps.members
        });
    }

    getGroups() {
        let ids =[];
        let data = this.state.members;
        let PointMembers = data.get('PointMembers');
        let groups = data.get('Groups');
        if (PointMembers && groups) {
            ids = ids.concat(this.groupsGetUserId(groups));
            ids = ids.concat(this.membersGetUserId(PointMembers));
            this.getUsers(ids);
        } else if (!groups) {
            ids = ids.concat(this.membersGetUserId(PointMembers));
            this.getUsers(ids);
        } else {
            ids = ids.concat(this.groupsGetUserId(groups));
            this.getUsers(ids);
        }
    }

    groupsGetUserId(item) {
        let ids=[];
        item.forEach( val => {
            val.get('Members').toArray().forEach(v => {
                if (v.get('UserId')) {
                    ids.push(v.get('UserId'));
                }
            });
        });
        return ids;
    }

    membersGetUserId (item) {
        let ids=[];
        item.toArray().forEach(v => {
            if (v.get('UserId')) {
                ids.push(v.get('UserId'));
            }
        });
        return ids;
    }

    getUsers(ids) {
        let { relatedUsers } = this.props;
        let id = [];
        if (relatedUsers) { // 为了防止数据反复拉取，如果树上存在数据，不拉取数据
            ids.forEach( v => {
                if (!relatedUsers.get(v)) {
                    id.push(v);
                }
            });
            if (id.length) {
                this.props.fetchRelatedDataListByIds('User', id);
            }
        } else {
            this.props.fetchRelatedDataListByIds('User', ids);
        }
    }

    renderMember(){
        let members = this.state.members;
        let groups = members.get('Groups');
        let name=[];
        return groups.map( item => {
            item.get('Members').map(v => {
                name.push(v.get('UserId'));
            });
            this.setState({users: name});
        });
    }
    renderText (text) {
        let writeText = '';
        switch (text) {
        case 'AND' :
            writeText = '全体审批人通过方可';
            break;
        case 'OR' :
            writeText = '其中一个审批人通过即可';
            break;
        default :
            break;
        }
        return writeText;
    }
    renderCard() {
        let { members } = this.state;
        let { relatedUsers } = this.props;
        let userName='***';
        let avatar = default_avatar;
        let pointMembers = members.get('PointMembers');
        if (pointMembers && relatedUsers) {
            return pointMembers.map( (v, i) => {
                if (relatedUsers.get(v.get('UserId'))) {
                    userName = relatedUsers.getIn([v.get('UserId'), 'name']) || '***';
                    avatar = relatedUsers.getIn([v.get('UserId'), 'Avatar']) || default_avatar;
                }
                return (
                    <VetCard
                        key={i}
                        className="mcds-layout__item-6 mcds-p__b-20 mcds-p__r-20"
                        userName={userName}
                        agreestTime={moment(v.get('UpdateTime') * 1000).format('HH:mm')}
                        agreest={v.get('Status') || 'Wait'}
                        avatar={avatar} />
                );
            });
        }
    }
    renderGroup(){
        let groups = this.state.members.get('Groups');
        let { relatedUsers } = this.props;
        if (!groups) {
            return null;
        }
        return groups.map( val => {
            let names=[];
            let lineWidth=0;
            let consentNumber=0;
            let agreest = [];
            let length = val.get('Members').size;
            for (let i=0; i<length; i++) {
                names.push(<span key={val} className="mcds-m__r-5">'***'</span>);
            }
            let avatar = val.get('Members').map( (v, i) => {
                let userAvatar = default_avatar;
                let userId = v.get('UserId');
                if (relatedUsers && relatedUsers.get(userId)) {
                    names[i] = <span key={v} className="mcds-m__r-5">{relatedUsers.getIn([userId, 'name'])}</span>;
                    userAvatar = relatedUsers.getIn([userId, 'Avatar']) || default_avatar;
                }
                switch (v.get('Status')){
                case 'Wait' :
                case 'Voting':
                    agreest.push('Voting');
                    break;
                case 'Approval' :
                    agreest.push('Approval');
                    consentNumber+=1;
                    lineWidth+=1;
                    break;
                case 'Reject':
                    agreest.push('Reject');
                    lineWidth+=1;
                    break;
                case 'Closed':
                    agreest.push('Closed');
                    break;
                default:
                    agreest.push('Voting');
                }
                return (<Avatar
                    key={i}
                    agreest={ v.get('Status') }
                    avatar={userAvatar} />);
            });
            return (
                <PointGroups
                    key={val}
                    agreest={agreest}
                    lineWidth={lineWidth}
                    length={length}
                    avatar={avatar}
                    name={val.get('Name')}
                    consentNumber={consentNumber}
                    names={names}
                    VotePolicy={this.renderText(val.get('VotePolicy'))} />
            );
        });
    }

    render(){
        return (
            <div className="mcds-p__t-10 mcds-layout__column">
                {this.renderCard()}
                {this.renderGroup()}
            </div>
        );
    }
}


const PointGroups = ({agreest, lineWidth, length, avatar, name, VotePolicy, consentNumber, names})=>{
    return (
        <div className={classnames(styles['vet-Group'], 'mcds-layout__item-6 mcds-m__b-20 mcds-p__r-20')}>
            <div className={classnames(styles['position-rel'], 'mcds-card mcds-card__medium mcds-p__t-10 mcds-p__b-10')}>
                <Line agreest={agreest} lineWidth={lineWidth/length*100+'%'} />
                <div className={classnames(styles['vet-header'], 'mcds-card__header mcds-grid')}>
                    <header className="mcds-media mcds-card__media">
                        {avatar}
                    </header>
                </div>
                <div className={classnames(styles['vet-body'], 'mcds-m__b-15', 'mcds-card__body')}>
                    <div>
                        <Link className={classnames(styles['vet-manage'])} >{name}</Link>
                        <p className="mcds-m__t-5"><span className="mcds-m__r-5">*</span>{VotePolicy}</p>
                    </div>
                    <span>包含成员</span>
                    <div className={classnames(styles['vet-member'])}>
                        { names }
                    </div>
                </div>
                <div className={classnames(styles['vet-footer'], 'mcds-m__b-0', 'mcds-card__body')}>
                    已同意 <span>{consentNumber+'/'+length}</span>
                </div>
            </div>
        </div>
    );
};
PointGroups.propTypes = {
    agreest: PropTypes.any,
    lineWidth: PropTypes.number,
    length: PropTypes.number,
    avatar: PropTypes.object,
    name: PropTypes.string,
    names: PropTypes.array,
    VotePolicy: PropTypes.string,
    consentNumber: PropTypes.number
};
