/**
 * Created by listen1013 on 16/12/30.
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import { Link, browserHistory } from 'react-router';
import { logout, signout } from 'requests/common/logout';
import { feedback } from 'requests/common/feedback';

import ErrorNotify from 'container/share/error/error-notify';

import _ from 'lodash';
import { clearCheckedAll } from 'redux/reducers/standard-object/listview/setting-hash';
import { fetchUserData } from 'redux/reducers/user-profile';
require('styles/modules/global-header/global-header.scss');
import {
    DropDown,
    DropDownTrigger,
    DropDownList,
    DropDownItem,
    notify
} from 'carbon';
import SubmitBug from './submit-bug';
import BaseSearch from './base-search';

import { default_avatar } from 'utils/user-setting';

const LOGO_WIDTH = 150;
const NAV_RIGHT = 410;
// 「主页」 + 「审批」 + 「更多」,如果右侧结构改了这个宽度也需要变
const MORE_WIDTH = 60 + 60 + 63;



class GlobalHeader extends Component {

    constructor(props){
        super(props);
        // 合法有权限的对象
        this.legalNav = this.filterLegalNav();
        this.state = {
            showTabItems: this.legalNav.size,
            showSubmitBug: false
        };
    }
    componentDidMount() {
        let { me } = this.props;
        this.props.fetchUserData(me);
        window.addEventListener('resize', _.throttle(this._onResize.bind(this), 300), true);
        setTimeout(() => this._getMoreValue(), 1000);
        // this._getMoreValue();
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this._onResize.bind(this));
    }
    /**
     * 对照所有的有权限的meta,过滤没有权限的对象
     */
    filterLegalNav() {
        let { sObjects, legalObjects } = this.props;
        let legalNav = [];
        legalNav = sObjects.filter(v => {
            return legalObjects.get(v.get('name'));
        });
        return legalNav;
    }

    _onResize() {
        this._getMoreValue();
    }
    _toSignin() {
        window.location.href = '/signin';
        // 这里使用browserHistory只改变路由而不跳转，不知道为什么
        // browserHistory.push({pathname: '/signin'});
    }
    _toInvite() {
        window.location.href = '/invite';
    }
    _LogoutClick() {
        signout()
            .then(logout, this._toSignin)
            .then(this._toSignin, this._toSignin);
    }
    _SignoutClick() {
        signout().then(this._toInvite, this._toInvite);
    }
    _getMoreValue() {
        let liTeam = document.getElementsByClassName('header-li');
        let maxNavWidth = document.getElementById('header').clientWidth - LOGO_WIDTH - NAV_RIGHT;
        let w = 0;
        let stop = 0;
        for (let i=0;i<liTeam.length;i++) {
            w += liTeam[i].clientWidth;
            // console.log(i, liTeam[i], liTeam[i].clientWidth);
            // 假设出现了「更多」后宽度超出了,那么应该从这一点就开始截止了,只显示此下标之前的
            if (w + MORE_WIDTH > maxNavWidth) {
                break;
            }
            stop = i;
        }
        //        console.log('stop', stop);
        this.setState({showTabItems: ++stop});
    }

    _handleMoreItemClick(path) {
        browserHistory.push({pathname: path});
        // 修改 dropdown 下的 isSelect 样式,强制更新一下。
        this.forceUpdate();
    }
    handleSettingClick() {
        browserHistory.push({pathname: '/setting'});
    }
    handleSearchClick() {

        // if (keyword !== ''){
        //     browserHistory.push({pathname: '/search', query: {keyword}});
        // }
        return;

    }
    closeSubmitBug() {
        // 提交栏收回的时候更自然，先执行动画效果，0.5s后再干掉该元素
        // 如果不通过三元判断，会在页面刷新的时候执行一遍收回的动画
        setTimeout(() => this.setState({
            showSubmitBug: false
        }), 500);
    }
    handleSubmitBug(data) {
        // let bugPageUrl = this.context.router.location.pathname;
        let bugPageUrl = window.location.href;
        let customerId = this.props.me;
        let tenantId = this.props.tenantId;
        let customerName = this.props.userData.get('name');
        let newData = _.assign(data, {bugPageUrl}, {customerId}, {customerName}, {tenantId});
        feedback(newData).then(() => {
            notify.add({message: '提交成功，我们会及时对您提交的问题进行处理', theme: 'success'});
        }, response => ErrorNotify(response));
    }
    _routerSwitch(){
        this.props.clearCheckedAll();
        this.forceUpdate();
    }

    _renderList(){
        let { showTabItems } = this.state;
        // 显示8个 slice 就要多加一个
        let legalNav = this.legalNav;
        let list = legalNav.slice(0, showTabItems);

        return list.map((so, i) => {
            return (
                <li className="mcds-list__item mcds-layout__item mcds-layout__item-1 header-li" key={i}>
                    <Link to={`/sObject/${so.get('name')}`} className="mcds-tab__item" activeClassName="mcds-tab__active" onClick={::this._routerSwitch}>
                        {so.get('display_name')}
                    </Link>
                </li>
            );
        });
    }

    _renderMore() {
        let { showTabItems } = this.state;
        let legalNav = this.legalNav;
        if (showTabItems === legalNav.size) {
            return null;
        }
        let moreObj = legalNav.toArray().slice(showTabItems);
        let moreLength = moreObj.length;
        if ( moreLength === 0 ) {
            return null;
        }
        let currentPath = this.context.router.location.pathname;
        let list = moreObj.map((so, i) => {
            let path = `/sObject/${so.get('name')}`;
            return (
                <DropDownItem key={i} className="close" onClick={this._handleMoreItemClick.bind(this, path)} isSelected={currentPath === path}>
                    {so.get('display_name')}
                </DropDownItem>
            );
        });
        let cls = '';
        for (let obj of moreObj) {
            // console.log('obj', obj);
            if (`/sObject/${obj.path}` === currentPath) {
                cls = 'mcds-tab__active';
            }
        }
        return (
            <li className="mcds-list__item mcds-layout__item mcds-layout__item-1 header-li" key="more">
                <DropDownTrigger autoCloseTag="close">
                    <a className={`mcds-tab__item ${cls}`}>
                        更多
                        <i className="mcds-icon mcds-icon__triangle-solid-14" />
                    </a>
                    <DropDown>
                        <DropDownList>
                            {list}
                        </DropDownList>
                    </DropDown>
                </DropDownTrigger>
            </li>
        );

    }

    _renderSearch() {
        return (
            <li className="mcds-list__item mcds-globalnavigation__actions-search mcds-m__r-30">
                <BaseSearch />
            </li>
        );
    }
    _renderAvatar() {
        let { userData } = this.props;
        let avatarSrc = userData.get('Avatar') || default_avatar;
        return (
            <li className="mcds-list__item mcds-m__r-30">
                <DropDownTrigger
                    target="self"
                    placement="bottom-left"
                    autoCloseTag="setting">
                    <span className="mcds-avatar mcds-avatar__medium mcds-avatar__circle mcds-cursor__pointer">
                        <img className="mcds-avatar__circle" src={avatarSrc} />
                    </span>
                    <DropDown className="mcds-dropdown__min-no">
                        <DropDownList>
                            <DropDownItem onClick={this.handleSettingClick} className="setting">
                                个人设置
                            </DropDownItem>
                            <DropDownItem onClick={this._SignoutClick.bind(this)}>
                                选择企业
                            </DropDownItem>
                            <DropDownItem onClick={this._LogoutClick.bind(this)}>
                                退出登录
                            </DropDownItem>
                        </DropDownList>
                    </DropDown>
                </DropDownTrigger>
            </li>
        );
    }
    _renderSubmitBug() {
        let { showSubmitBug } = this.state;
        if (showSubmitBug) {
            return (
                <SubmitBug
                    onClose={::this.closeSubmitBug}
                    onSave={::this.handleSubmitBug}
                    show={showSubmitBug} />
            );
        }
        return null;
    }

    render() {
        return (
            <div className="mcds-container" id="global-header">
                <div className="mcds-media mcds-globalnavigation">
                    <div id="logo">MEIQIA PRO</div>
                    <div className="mcds-media__body">
                        <nav className="mcds-list__item mcds-tab__default global-nav">
                            <ul id="list" ref="list" className="mcds-tab__items mcds-list__horizontal mcds-layout__column mcds-layout__md">
                                <li className="mcds-list__item mcds-layout__item mcds-layout__item-1 headerLi">
                                    <Link to="/home" className="mcds-tab__item" activeClassName="mcds-tab__active" onClick={() => this.forceUpdate()}>
                                       主页
                                    </Link>
                                </li>
                                <li className="mcds-list__item mcds-layout__item mcds-layout__item-1 headerLi">
                                    <Link to="/vetting" className="mcds-tab__item" activeClassName="mcds-tab__active" onClick={() => this.forceUpdate()}>
                                       审批
                                    </Link>
                                </li>
                                {this._renderList()}
                                {this._renderMore()}
                            </ul>
                        </nav>
                    </div>
                    <div className="mcds-globalnavigation__actions mcds-m__t-14">
                        <ul className="mcds-list__horizontal">
                            {this._renderSearch()}
                            {/*
                            <li className="mcds-list__item mcds-m__r-20">

                                <span className="mcds-icon__search-line-20 mcds-icon__size-18" />
                            </li>
                            */}
                            <li className="mcds-list__item mcds-m__r-20 mcds-cursor__pointer">
                                <DropDownTrigger
                                    target="self"
                                    autoCloseTag="setting">
                                    <span className="mcds-icon__help-line-20 mcds-icon__size-18" />
                                    <DropDown className="mcds-dropdown__min-no">
                                        <DropDownList>
                                            <DropDownItem onClick={()=>{ this.setState({showSubmitBug: true}); }}>
                                                问题反馈
                                            </DropDownItem>
                                        </DropDownList>
                                    </DropDown>
                                </DropDownTrigger>
                            </li>
                            {/**
                            <li className="mcds-list__item mcds-m__r-20">
                                <Link to="/setup">
                                    <span className="mcds-icon__settings-line-20 mcds-icon__size-18" />
                                </Link>
                            </li>
                            **/}
                            <li className="mcds-list__item mcds-m__r-20">
                                <Link to="/">
                                    <span className="mcds-icon__bell-line-20 mcds-icon__size-18" />
                                </Link>
                            </li>
                            {this._renderAvatar()}
                        </ul>
                    </div>
                </div>
                {this._renderSubmitBug()}
            </div>
        );
    }
}

GlobalHeader.contextTypes = {
    router: PropTypes.object
};

GlobalHeader.propTypes = {
    // 我的个人id
    me: PropTypes.string,
    // 当前用户的详细信息
    userData: PropTypes.object,

    // 配置在layout中的导航栏目全部的信息排序
    // 不涉及任何权限,需要与legalObjects对比,进行过滤
    sObjects: PropTypes.object.isRequired,
    // 过了acl权限的,全部对象的列表
    legalObjects: PropTypes.object.isRequired,
    // 租户id
    tenantId: PropTypes.string,

    fetchUserData: PropTypes.func,

    // todo 清除redux上关于列表挂载的数据
    // @chenmeng
    clearCheckedAll: PropTypes.func
};

export default connect(
    state => ({
        legalObjects: state.getIn(['standardObject', 'allObjects']),
        sObjects: state.getIn(['standardObject', 'layout', 'header']),
        me: state.getIn(['userProfile', 'userId']),
        tenantId: state.getIn(['userProfile', 'tenantId']),
        userData: state.getIn(['userProfile', 'user'])
    }),
    dispatch => bindActionCreators({ clearCheckedAll, fetchUserData }, dispatch)
)(GlobalHeader);
