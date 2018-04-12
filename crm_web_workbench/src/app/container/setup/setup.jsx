/**
 * [设置入口]
 */
import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';

import classnames from 'classnames';
import { Link } from 'react-router';

import {
    Navigation,
    NavTitle,
    NavList,
    NavItem,
    InputSearch
} from 'carbon';

import style from 'styles/modules/setup/setup.scss';

export default class Setup extends React.Component {
    static propTypes = {
        children: PropTypes.any
    };
    constructor(){
        super();
        this.state = {
            user: true,
            automation: true,
            object: false
        };
    }
    //  开关 用户：user 自动化：automation object: 对象    false: 展开
    handleToggleUer(){
        this.setState({
            user: !this.state.user
        });
    }
    handleToggleAutomation(){
        this.setState({
            automation: !this.state.automation
        });
    }
    handleToggleObject(){
        this.setState({
            object: !this.state.object
        });
    }

    renderNav() {
        return (
            <Navigation>
                <NavTitle id="folder-header">
                    <InputSearch className={classnames('mcds-m__l-4 mcds-m__t-4 mcds-m__b-4', style['setup-search'])} placeholder="搜索" search="left" />
                </NavTitle>
                <NavTitle className="mcds-m__l-4 mcds-text__line-18 mcds-text__size-13">
                    <Link to="/setup" className={classnames(style['setup-index'])}>
                        设置主页
                    </Link>
                </NavTitle>
                <NavList>
                    {/* 用户设置*/}
                    <NavTitle className={classnames(' mcds-p__l-30 mcds-p__t-15 mcds-p__b-15', style['nav-header'])} onClick={::this.handleToggleUer}>
                        <i className={classnames('mcds-icon__arrow-line-20 mcds-text__size-14', style['arrow-position'], {'mcds-icon__rotate-270': this.state.user})} />
                        用户设置
                    </NavTitle>
                    <NavList className={classnames(style.list, 'mcds-text__size-13', {'mcds-filter__close': this.state.user})}>
                        <NavItem>
                            <Link to="/setup/contacts/User" activeClassName="mcds-is-active" className="mcds-tab__item mcds-p__l-20">
                                用户
                            </Link>
                        </NavItem>
                        <NavItem>
                            <Link to="/setup/role" activeClassName="mcds-is-active" className="mcds-tab__item mcds-p__l-20">
                                角色
                            </Link>
                        </NavItem>
                        <NavItem>
                            <Link to="/setup/group" activeClassName="mcds-is-active" className="mcds-tab__item mcds-p__l-20">
                                小组
                            </Link>
                        </NavItem>
                        <NavItem>
                            <Link to="/setup/queue" activeClassName="mcds-is-active" className="mcds-tab__item mcds-p__l-20">
                                队列
                            </Link>
                        </NavItem>
                    </NavList>
                    {/* 权限设置*/}
                    <NavTitle className={classnames(' mcds-p__l-30 mcds-p__t-15 mcds-p__b-15', style['nav-header'])} onClick={::this.handleToggleObject}>
                        <i className={classnames('mcds-icon__arrow-line-20 mcds-text__size-14', style['arrow-position'], {'mcds-icon__rotate-270': this.state.object})} />
                        对象设置
                    </NavTitle>
                    <NavList className={classnames(style.list, 'mcds-text__size-13', {'mcds-filter__close': this.state.object})}>
                        <NavItem>
                            <Link to="/setup/object" activeClassName="mcds-is-active" className="mcds-tab__item mcds-p__l-20">
                                对象和字段设置
                            </Link>
                        </NavItem>
                    </NavList>
                    {/* 工作自动化设置*/}
                    <NavTitle className={classnames(' mcds-p__l-30 mcds-p__t-15 mcds-p__b-15', style['nav-header'])} onClick={::this.handleToggleAutomation}>
                        <i className={classnames('mcds-icon__arrow-line-20 mcds-text__size-14', style['arrow-position'], {'mcds-icon__rotate-270': this.state.automation})} />
                        工作自动化设置
                    </NavTitle>
                    <NavList className={classnames(style.list, 'mcds-text__size-13', {'mcds-filter__close': this.state.automation})}>
                        <NavItem>
                            <Link to="/setup/workflow" activeClassName="mcds-is-active" className="mcds-tab__item mcds-p__l-20">
                                工作流设置
                            </Link>
                        </NavItem>
                        <NavItem>
                            <Link to="/setup/vetting" activeClassName="mcds-is-active" className="mcds-tab__item mcds-p__l-20">
                                审批设置
                            </Link>
                        </NavItem>
                    </NavList>
                </NavList>
            </Navigation>
        );
    }

    render() {
        let props = _.assign({}, this.props);
        delete props.children;
        return (
            <div className={style.main}>
                <div className={`${style.left} mcds-divider__right`}>
                    {this.renderNav()}
                </div>
                <div className={style.right}>
                    {this.props.children && React.cloneElement(this.props.children, props)}
                </div>
            </div>
        );
    }
}
