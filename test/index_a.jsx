import React, { Component } from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import { Link } from 'react-router';

import {
    DropDown,
    DropDownList,
    DropDownItem,
    Table,
    DropDownTrigger,
    DropDownItemHeader,
    ButtonSmallIcon,
    Navigation,
    NavTitle,
    NavList,
    NavItem
} from 'carbon';

import style from 'styles/modules/global-search/index.scss';

@connect(
    null,
    dispatch => bindActionCreators({}, dispatch)
)
export default class Search extends Component {
    static propTypes = {
    };

    renderNav() {
        return (
            <Navigation>
                <NavTitle id="folder-header">
                    搜索结果
                </NavTitle>
                <NavList>
                    <NavItem id="entity-header" className="mcds-is-active">客户<span className="mcds-m__l-10">(100)</span></NavItem>
                    <NavItem id="entity-header">Created by Me<span className="mcds-m__l-10">(100)</span></NavItem>
                    <NavItem id="entity-header">Private Reports<span className="mcds-m__l-10">(100)</span></NavItem>
                    <NavItem id="entity-header">Public Reports<span className="mcds-m__l-10">(100)</span></NavItem>
                    <NavItem id="entity-header">All Reports<span className="mcds-m__l-10">(100)</span></NavItem>
                </NavList>
            </Navigation>
        );
    }

    _renderHeader() {
        return (
            <div className={style.header}>
                <div className="mcds-text__base mcds-text__size-20">客户</div>
                <div className="mcds-text__weak mcds-text__size-12">100 条结果</div>
            </div>
        );
    }

    renderTable() {
        let row = (
            <tr>
                <td>
                    <div className="mcds-truncate" title="客户名称">
                        <Link>北京美洽网络科技有限公司</Link>
                    </div>
                </td>
                <td>
                    <div className="mcds-truncate" title="状态">22</div>
                </td>
                <td>
                    <div className="mcds-truncate" title="客户所有人">22</div>
                </td>
                <td>
                    <div className="mcds-truncate" title="客户级别">22</div>
                </td>
                <td>
                    <div className="mcds-truncate" title="省份">22</div>
                </td>
                <td>
                    <div className="mcds-truncate" title="电话">22</div>
                </td>
                <td>
                    <div className="mcds-layout__column" title="创建日期">
                        <span className="mcds-layout__item mcds-layout__left">2016-12-12</span>
                        <DropDownTrigger>
                            <ButtonSmallIcon icon="mcds-icon__triangle-solid-14" />
                            <DropDown className="">
                                <DropDownList>
                                    <DropDownItemHeader >操作</DropDownItemHeader>
                                    <DropDownItem>
                                        修改
                                    </DropDownItem>
                                    <DropDownItem>
                                        删除
                                    </DropDownItem>
                                    <DropDownItem>
                                        置顶
                                    </DropDownItem>
                                </DropDownList>
                            </DropDown>
                        </DropDownTrigger>
                    </div>
                </td>
            </tr>
        );
        return (
            <Table className="mcds-table__striped">
                <thead>
                    <tr className="mcds-text-title__caps">
                        <th className="mcds-truncate">
                        客户名称
                        </th>
                        <th className="mcds-truncate">
                        状态
                        </th>
                        <th className="mcds-truncate">
                        客户所有人
                        </th>
                        <th className="mcds-truncate">
                        客户级别
                        </th>
                        <th className="mcds-truncate">
                        省份
                        </th>
                        <th className="mcds-truncate">
                        电话
                        </th>
                        <th className="mcds-truncate">
                        创建日期
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {row}
                    {row}
                    {row}
                    {row}
                    {row}
                    {row}
                    {row}
                </tbody>
            </Table>
        );
    }
    render() {
        return (
            <div className="mcds-layout__column" style={{height: '100%'}}>
                <div className={`mcds-layout__item mcds-layout__item-3 mcds-divider__right ${style.navigation}`}>
                    {this.renderNav()}
                </div>
                <div className="mcds-layout__item mcds-layout__item-9">
                    {this._renderHeader()}
                    {this.renderTable()}
                </div>
            </div>
        );
    }
}
