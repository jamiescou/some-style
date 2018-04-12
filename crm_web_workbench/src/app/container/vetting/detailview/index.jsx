import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import { browserHistory } from 'react-router';

import moment from 'moment';
import VetNode from './vet-node';
import VetCopySend from './vet-copy-send';
import EditorExample from './components/editor-example';
import Relevant from './relevant';
import Item from './components/item';
import Approval from './modal/approval';
import Reject from './modal/reject.jsx';
import Forward from './modal/forward';
import Withdraw from './modal/withdraw';
import { convertSeconds } from 'utils/convert';
import { default_avatar } from 'utils/user-setting.js';

import { fetchData } from 'redux/reducers/vetting/detailview';
import { fetchComment } from 'redux/reducers/vetting/detailview';
import { fetchList } from 'redux/reducers/standard-object/listview/list';
import { fetchRelatedDataListByIds } from 'redux/reducers/standard-object/related-object/data';

import ErrorNotify from 'container/share/error/error-notify';

import {
    Button,
    ButtonGroup,
    Loading
} from 'carbon';
import {
    CommentItem
} from './components';

import style from 'styles/modules/vetting/detail.scss';

class VettingDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            nodeShow: {
                1: true,
                2: false
            },
            loading: true,
            authority: false
        };
        this.handleGoDetailview = this.handleGoDetailview.bind(this);
    }

    componentDidMount() {
        let {id} = this.context.router.params;
        let param = {order_by: 'updated_at', order_flag: 'DESC', limit: 5, offset: 0};
        Promise.all([
            this.props.fetchData(id),
            this.props.fetchComment(id),
            this.props.fetchList('User', param)
        ]).then(() => {
            let userId = this.props.data.getIn(['Aw', 'CreateUid']);
            if (userId){
                this.props.fetchRelatedDataListByIds('User', [userId]).then(()=>{
                    this.setState({
                        loading: false
                    });
                });
            }
        }, err => {
            ErrorNotify(err);
        });
    }

    judgmentApprovalAuthority () {
        let { data } = this.props;
        let result = false;
        let currentPoint = data.getIn(['Aw', 'CurrentPoint']);
        let hasMemberId = data.getIn(['VoteObj', 'MemberId']);
        let userJurisdiction = data.getIn(['Aw', 'Points', `${currentPoint-1}`]); // userJurisdiction 是为了获取审批当前的节点；
        let groups = userJurisdiction.get('Groups');
        let pointMembers = userJurisdiction.get('PointMembers');
        if (hasMemberId) {
            if (groups) {
                if (pointMembers) {
                    result = this.searchUserId(pointMembers);
                    if (result) {
                        return result;
                    }
                }
                groups.some( v => {
                    result = this.searchUserId(v.get('Members'));
                    if (result) {
                        return result;
                    }
                });
            } else {
                result = this.searchUserId(pointMembers);
            }
        }
        return result;
    }

    searchUserId (users) {
        let { userId } = this.props;
        let result= false;
        if (users) {
            users.map( v => {
                if (v.get('UserId') === userId) {
                    if (v.get('Status') === 'Wait' || v.get('Status') === 'Voting') {
                        result = true;
                    }
                }
            });
        }
        return result;
    }


    renderDefaultButton() {
        let hasJurisdiction = this.judgmentApprovalAuthority();
        return hasJurisdiction ? <Approval
            id={this.context.router.params.id}
            votelist={this.props.data.get('VoteObj')}
            trigger={
                <Button className="mcds-button__neutral" >
                    <i className="mcds-icon__left mcds-icon__checked-line-20" />
                        同意
                </Button>} /> : null;
    }

    renderOptionalButtons() {
        let { data, userId } = this.props;
        let hasJurisdiction = this.judgmentApprovalAuthority();
        let createUid = data.getIn(['Aw', 'CreateUid']);
        return (
            <ButtonGroup>
                { hasJurisdiction ? <Forward
                    id={this.context.router.params.id}
                    votelist={data.get('VoteObj')}
                    user={this.props.user}
                    trigger={
                        <Button className="mcds-button__neutral" >
                            转发
                        </Button>
                    } /> : null}
                { userId === createUid ? <Withdraw
                    id={this.context.router.params.id}
                    trigger={
                        <Button className="mcds-button__neutral" >
                            撤回
                        </Button>
                    } /> : null}
                { hasJurisdiction ? <Reject
                    id={this.context.router.params.id}
                    votelist={data.get('VoteObj')}
                    trigger={
                        <Button className="mcds-button__neutral" >
                            拒绝
                        </Button>
                    } /> : null }
            </ButtonGroup>
        );
    }

    renderTime (data) {
        let times;
        if (data.get('FinishTime')) {
            times = data.get('FinishTime')-data.get('CreateTime');
        } else {
            times = new Date().getTime()/1000-data.get('CreateTime');
        }
        return convertSeconds(times<=60 ? 60 : parseInt(times), {second: false});
    }
    renderInfo() {
        let { data, relatedUsers, userId } = this.props;
        let info = data.get('Aw');
        let type = data.getIn(['Aw', 'Status']);
        let userInfo = relatedUsers.get(userId);
        let StatusList = ['待审批', '待审批', '审批通过', '拒绝', '审批关闭'];
        let num = null;
        switch (type){
        case 'Wait' :
            num = 0;
            break;
        case 'Voting' :
            num = 1;
            break;
        case 'Approval' :
            num = 2;
            break;
        case 'Reject' :
            num = 3;
            break;
        case 'Closed' :
            num = 4;
            break;
        default :
            num= null;
        }

        if (userInfo) {
            return (
                <article className={`mcds-card ${style.card}`}>
                    <div className="mcds-card__header mcds-grid">
                        <header className="mcds-media mcds-card__media">
                            <div className="mcds-media__figure">
                                <div className={style['icon-small__wrap']}>
                                    <i className="mcds-icon__seal-solid-24" />
                                </div>
                            </div>
                            <div className="mcds-media__body">
                                基本信息
                            </div>
                        </header>
                    </div>
                    <div className={`${style['wrap-info']} mcds-card__body`}>
                        <Item
                            title="提交人"
                            info={userInfo.get('name') ? userInfo.get('name') : '***'}
                            avatar={userInfo.get('Avatar') ? userInfo.get('Avatar') : default_avatar} />
                        <Item title="审批模板" info={info.get('DefineName')} />
                        <Item title="当前审批点" info={info.get('CurrentPoint')+'/'+ info.get('PointCount')} />
                        <Item title="状态" info={StatusList[num]} />
                        <Item title="审批用时" info={this.renderTime(info)} />
                        <Item title="描述" info={info.get('Description')} />
                    </div>
                </article>
            );
        }
    }

    renderComment() {
        let { comments, relatedUsers, userId, data } = this.props;
        let user = relatedUsers.get(userId);
        if ( user && comments ) {
            return (
                <article className={`mcds-card ${style.card}`}>
                    <div className="mcds-card__header mcds-grid mcds-m__b-10">
                        <header className="mcds-media mcds-card__media">
                            <div className="mcds-media__figure">
                                <div className={style['icon-small__wrap']}>
                                    <i className="mcds-icon__seal-solid-24" />
                                </div>
                            </div>
                            <div className="mcds-media__body">
                                审批评论
                            </div>
                        </header>
                    </div>
                    <div className={style['card-body']}>
                        <div className="mcds-tile mcds-media mcds-p__t-20 mcds-p__b-20 mcds-p__l-20 mcds-p__r-20 mcds-p__r-20>">
                            <div className="mcds-media__figure">
                                <span className="mcds-avatar mcds-avatar__small mcds-avatar__circle">
                                    <img
                                        src={user.get('Avatar') ? user.get('Avatar') : default_avatar} />
                                </span>
                            </div>
                            <div className="mcds-media__body mcds-tile__detail">
                                <EditorExample data={data.get('Aw')} />
                            </div>
                        </div>
                        <ul className={style['card-body__group']} style={{maxHeight: '400px', overflowY: 'scroll'}}>
                            {
                                comments.map((v, i) => {
                                    return (
                                        <CommentItem
                                            key={ i }
                                            userid={ v.get('AuthorId') }
                                            date={moment(v.get('CreateTime') * 1000).from(new Date())}
                                            text={v.get('Content')} />
                                    );
                                })
                            }
                        </ul>
                    </div>
                </article>
            );
        }
    }

    renderLayout() {
        let { data } = this.props;
        if (!data){
            return null;
        }
        return (
            <div id="examination" className={`mcds-layout__column ${style.column}`}>
                <div className={`mcds-layou__item ${style['layou-left']}`}>
                    {this.renderInfo()}
                    {<Relevant />}
                </div>
                <div className={`mcds-layou__item, ${style['layou-right']}`}>
                    <VetNode data={data.get('Aw')} />
                    <VetCopySend data={ data.get('Aw') } />
                    {this.renderComment()}
                </div>
            </div>
        );
    }
    handleGoDetailview () {
        browserHistory.push('/vetting');
    }

    renderPageHeader() {
        let { data } = this.props;
        if (data){
            let name  = data.getIn(['Aw', 'Name']);
            let statusType = data.getIn(['Aw', 'Status']);
            return (
                <div className={`mcds-pageheader ${style.header}`}>
                    <div className="mcds-grid mcds-pageheader__header">
                        <div className="mcds-pageheader__header-left">
                            <div className="mcds-media">
                                <div className="mcds-media__figure mcds-p__t-6 mcds-m__r-30">
                                    <div className={style['icon-wrap']}>
                                        <i className="mcds-icon__seal-solid-24" />
                                    </div>
                                </div>
                                <div className="mcds-media__body">
                                    <span className="mcds-pageheader__header-left-text">审批</span>
                                    <div className={`mcds-pageheader__title ${style.single}`} >
                                        <span onClick={this.handleGoDetailview}>{name}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {statusType === 'Approval' || statusType === 'Reject' || statusType ===  'Closed' ? ' ' : <div className="mcds-pageheader__header-right">
                            {this.renderDefaultButton()}
                            {this.renderOptionalButtons()}
                        </div>}
                    </div>
                </div>
            );
        }
    }

    render() {
        if (this.state.loading) {
            return (
                <div className="demo mcds-layout__row mcds-layout__middle mcds-layout__center" style={{height: '50%'}}>
                    <div className="mcds-layout__item-12">
                        <Loading theme="logo" model="small" />
                    </div>
                </div>
            );
        }
        return (
            <div>
                {this.renderPageHeader()}
                {this.renderLayout()}
            </div>
        );
    }
}
VettingDetail.propTypes = {
    fetchData: PropTypes.func,
    fetchComment: PropTypes.func,
    fetchList: PropTypes.func,
    data: PropTypes.object, // 数据源
    user: PropTypes.object, // 转发显示的默认下拉数据
    userId: PropTypes.string, // 当前登录的用户的ID
    comments: PropTypes.object, // 评论的内容
    fetchRelatedDataListByIds: PropTypes.func, // 获取user信息
    relatedUsers: PropTypes.object // user信息
};

VettingDetail.contextTypes = {
    router: PropTypes.object.isRequired
};

export default connect(state => ({
    data: state.getIn(['vetting', 'detailview', 'data']),
    user: state.getIn(['standardObject', 'listview', 'list', 'data']),
    comments: state.getIn(['vetting', 'detailview', 'comment', 'Comments']),
    userId: state.getIn(['userProfile', 'userId']),
    relatedUsers: state.getIn(['standardObject', 'relatedObject', 'User'])
}), dispatch => bindActionCreators({
    fetchData,
    fetchComment,
    fetchList,
    fetchRelatedDataListByIds
}, dispatch))(VettingDetail);
