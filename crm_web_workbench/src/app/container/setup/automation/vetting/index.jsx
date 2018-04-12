import React, { Component } from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import classnames from 'classnames';
import _ from 'lodash';

import {
    ButtonGroup,
    Button,
    TableResize,
    Th,
    DropDownTrigger,
    DropDown,
    DropDownList,
    DropDownItem,
    ButtonSmallIcon,
    Select
} from 'carbon';

let style = require('styles/modules/setup/vetting.scss');

import { SpecificObject } from './modal/index';

@connect(
    null,
    dispatch => bindActionCreators({}, dispatch)
)
export default class Home extends Component {

    componentDidMount() {
        let table = this.refs.table;
        let body = document.body;
        this._screenHeight(table, body);
        window.addEventListener('resize', _.debounce(() => {
            this._screenHeight(table, body);
        }, 300));
    }

    _screenHeight(elem, body) {
        elem.style.height = (body.clientHeight - 225) + 'px';
    }

    _renderHeader() {
        return (
            <div className="mcds-pageheader">
                <div className="mcds-grid mcds-pageheader__header">
                    <div className="mcds-pageheader__header-left">
                        <div className="mcds-media">
                            <div className="mcds-m__r-30 mcds-p__t-6">
                                <div className={classnames('mcds-pageheader__header-left-icon mcds-p__t-4 mcds-p__l-4', style['bg-gray'])} >
                                    <span className={classnames('mcds-text__size-24 mcds-icon__settings-solid-24', style['color-white'])} />
                                </div>
                            </div>
                            <div className="mcds-media__body">
                                <span className="mcds-pageheader__header-left-text">设置首页</span>
                                <div className="mcds-pageheader__title">
                                    审批设置
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mcds-pageheader__header-right">
                        <ButtonGroup>
                            <SpecificObject trigger={<Button className="mcds-button__item"><span className="mcds-icon__add-line-20 mcds-stateful__selected mcds-icon__left" />新建模板</Button>} className="mcds-button__item" />
                        </ButtonGroup>
                    </div>
                </div>
                <div className="mcds-pageheader__footer">
                    <div>
                        <label className={classnames('mcds-text__size-12 mcds-text__weak mcds-m__r-10', style['vetting-inline__block'])}>选择审批流的关联对象</label>
                        <Select value="order" className={classnames('mcds-m__t-23', style['vetting-select'], style['vetting-inline__block'])}>
                            <option value="order" className="closed close">
                                订单
                            </option>
                        </Select>
                    </div>
                </div>
            </div>
        );
    }

    _renderTable() {
        return (
            <div ref="table" className={classnames('mcds-m__t-20 mcds-m__l-20 mcds-m__r-20', style['vetting-table'])}>
                <TableResize>
                    <thead>
                        <tr>
                            <Th className="mcds-is__sortable mcds-table__width" icon="mcds-icon__arrow-solid-14">
                                模板名称
                            </Th>
                            <Th className="mcds-is__sortable mcds-table__width">
                                校验条件
                            </Th>
                            <Th className="mcds-is__sortable mcds-table__width">
                                创建人
                            </Th>
                            <Th className="mcds-is__sortable mcds-table__width">
                                最后修改人
                            </Th>
                            <Th className="mcds-is__sortable mcds-table__width">
                                描述
                            </Th>
                            <Th className="mcds-is__sortable mcds-table__width">
                                审批字段
                            </Th>
                            <Th className={classnames('mcds-cell__shrink', style['vetting-table__th-width'])} />

                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="mcds-truncate">金额大于10万审批</td>
                            <td className="mcds-truncate">校验条件</td>
                            <td className="mcds-truncate">创建人</td>
                            <td className="mcds-truncate">最后修改人</td>
                            <td className="mcds-truncate">描述</td>
                            <td className="mcds-truncate">审批字段</td>
                            <td className="mcds-cell__shrink">
                                <div className="mcds-layout__column pull-right">
                                    <DropDownTrigger autoCloseTag="close" target="self" placement="bottom-left" synchWidth={false} >
                                        <ButtonSmallIcon icon="mcds-icon__triangle-solid-14" />
                                        <DropDown className="mcds-dropdown__min-no">
                                            <DropDownList>
                                                <DropDownItem className="close">编辑</DropDownItem>
                                                <DropDownItem className="close">复制</DropDownItem>
                                                <DropDownItem className="close">删除</DropDownItem>
                                                <DropDownItem className="close">停用</DropDownItem>
                                                <DropDownItem className="close">详情</DropDownItem>
                                            </DropDownList>
                                        </DropDown>
                                    </DropDownTrigger>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td className="mcds-truncate">金额大于10万审批</td>
                            <td className="mcds-truncate">校验条件</td>
                            <td className="mcds-truncate">创建人</td>
                            <td className="mcds-truncate">最后修改人</td>
                            <td className="mcds-truncate">描述</td>
                            <td className="mcds-truncate">审批字段</td>
                            <td className="mcds-cell__shrink">
                                <div className="mcds-layout__column pull-right">
                                    <DropDownTrigger autoCloseTag="close" target="self" placement="bottom-left" synchWidth={false} >
                                        <ButtonSmallIcon icon="mcds-icon__triangle-solid-14" />
                                        <DropDown className="mcds-dropdown__min-no">
                                            <DropDownList>
                                                <DropDownItem className="close">编辑</DropDownItem>
                                                <DropDownItem className="close">复制</DropDownItem>
                                                <DropDownItem className="close">删除</DropDownItem>
                                                <DropDownItem className="close">停用</DropDownItem>
                                                <DropDownItem className="close">详情</DropDownItem>
                                            </DropDownList>
                                        </DropDown>
                                    </DropDownTrigger>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td className="mcds-truncate">金额大于10万审批</td>
                            <td className="mcds-truncate">校验条件</td>
                            <td className="mcds-truncate">创建人</td>
                            <td className="mcds-truncate">最后修改人</td>
                            <td className="mcds-truncate">描述</td>
                            <td className="mcds-truncate">审批字段</td>
                            <td className="mcds-cell__shrink">
                                <div className="mcds-layout__column pull-right">
                                    <DropDownTrigger autoCloseTag="close" target="self" placement="bottom-left" synchWidth={false} >
                                        <ButtonSmallIcon icon="mcds-icon__triangle-solid-14" />
                                        <DropDown className="mcds-dropdown__min-no">
                                            <DropDownList>
                                                <DropDownItem className="close">编辑</DropDownItem>
                                                <DropDownItem className="close">复制</DropDownItem>
                                                <DropDownItem className="close">删除</DropDownItem>
                                                <DropDownItem className="close">停用</DropDownItem>
                                                <DropDownItem className="close">详情</DropDownItem>
                                            </DropDownList>
                                        </DropDown>
                                    </DropDownTrigger>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </TableResize>
            </div>
        );
    }

    render() {
        return (
            <div className="mcds-layout__column">
                <div className="mcds-layout__item-12">
                    {::this._renderHeader()}
                </div>
                <div className="mcds-layout__item-12">
                    {::this._renderTable()}
                </div>
            </div>
        );
    }
}
