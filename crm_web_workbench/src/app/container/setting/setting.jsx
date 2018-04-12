/**
 * [个人设置入口]
 */
import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';

import { Link } from 'react-router';

import {
    Navigation,
    NavTitle,
    NavList,
    NavItem
} from 'carbon';

import style from 'styles/modules/setting/setting.scss';

export default class Setting extends React.Component {
    static propTypes = {
        children: PropTypes.any
    };

    renderNav() {
        // Todo: 这里不用 nav 组件 ,目前是搭个结构省事,需要自己写一套样式
        return (
            <Navigation>
                <NavTitle className="mcds-m__l-17 mcds-text__line-16 mcds-text__size-20">
                    个人设置
                </NavTitle>
                <NavList className={`${style.list} mcds-text__size-13`}>
                    <NavItem>
                        <Link to="/setting/personal-info" activeClassName="mcds-is-active" className="mcds-tab__item mcds-p__l-20">
                            基本信息
                        </Link>
                    </NavItem>
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
