import React, { Component } from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import classnames from 'classnames';

let style = require('styles/modules/setup/personal.scss');

import {
    Th,
    Table,
    Button,
    ButtonSmallIcon,
    InputSearch,
    DropDownTrigger,
    DropDown,
    DropDownList,
    DropDownItem
} from 'carbon';

@connect(
    null,
    dispatch => bindActionCreators({}, dispatch)
)
export default class Personal extends Component {
    static propTypes = {
    };
    constructor(){
        super();
        this.state = {
            showjurisdiction: false,
            showgroup: false
        };
    }

    isShowGurisdiction(){
        this.setState({
            showjurisdiction: !this.state.showjurisdiction
        });
    }

    isShowGroup(){
        this.setState({
            showgroup: !this.state.showgroup
        });
    }

    showJurisdictionItem(){
        return (
            <div className={classnames(style['background-fff'], 'mcds-m__t-1 mcds-p__b-40')}>
                <Table className="mcds-table-fixed__layout">
                    <thead>
                        <tr>
                            <Th className="mcds-is__sortable" icon="mcds-icon__arrow-solid-14">
                                权限维度
                            </Th>
                            <Th className="mcds-is__sortable">
                                权限情况
                            </Th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                角色
                            </td>
                            <td>
                                销售总监
                            </td>
                            <td className="mcds-cell__shrink">
                                <DropDownTrigger autoCloseTag="close" target="self" placement="bottom-left">
                                    <ButtonSmallIcon icon="mcds-icon__triangle-solid-14" className="mcds-m__r-20" />
                                    <DropDown className="mcds-dropdown__min-no mcds-m__t-8">
                                        <DropDownList>
                                            <DropDownItem className="close">编辑</DropDownItem>
                                            <DropDownItem className="close">删除</DropDownItem>
                                        </DropDownList>
                                    </DropDown>
                                </DropDownTrigger>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                主权限
                            </td>
                            <td>
                                系统管理员
                            </td>
                            <td className="mcds-cell__shrink">
                                <DropDownTrigger autoCloseTag="close" target="self" placement="bottom-left">
                                    <ButtonSmallIcon icon="mcds-icon__triangle-solid-14" className="mcds-m__r-20" />
                                    <DropDown className="mcds-dropdown__min-no mcds-m__t-8">
                                        <DropDownList>
                                            <DropDownItem className="close">编辑</DropDownItem>
                                            <DropDownItem className="close">删除</DropDownItem>
                                        </DropDownList>
                                    </DropDown>
                                </DropDownTrigger>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                附权限
                            </td>
                            <td>
                                CTI 功能,短信通知功能,创建审批权限
                            </td>
                            <td className="mcds-cell__shrink">
                                <DropDownTrigger autoCloseTag="close" target="self" placement="bottom-left">
                                    <ButtonSmallIcon icon="mcds-icon__triangle-solid-14" className="mcds-m__r-20" />
                                    <DropDown className="mcds-dropdown__min-no mcds-m__t-8">
                                        <DropDownList>
                                            <DropDownItem className="close">编辑</DropDownItem>
                                            <DropDownItem className="close">删除</DropDownItem>
                                        </DropDownList>
                                    </DropDown>
                                </DropDownTrigger>
                            </td>
                        </tr>
                    </tbody>
                </Table>
            </div>
        );
    }

    showGroupItem(){
        return (
            <div className={classnames(style['background-fff'], 'mcds-m__t-1 mcds-p__b-40')}>
                <Table className="mcds-table-fixed__layout">
                    <thead>
                        <tr>
                            <Th className="mcds-is__sortable" icon="mcds-icon__arrow-solid-14">
                            小组名
                            </Th>
                            <Th className="mcds-is__sortable">
                            创建人
                            </Th>
                            <Th className="mcds-is__sortable">
                            共享给上级角色
                            </Th>
                            <Th className="mcds-is__sortable">
                            说明
                            </Th>
                            <Th className="mcds-is__sortable" />
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                产品
                            </td>
                            <td>
                                Bettie Pierce,08/15/2017
                            </td>
                            <td>
                                是
                            </td>
                            <td>
                                Make Money Online Through Advertising
                            </td>
                            <td className="mcds-cell__shrink">
                                <DropDownTrigger autoCloseTag="close" target="self" placement="bottom-left">
                                    <ButtonSmallIcon icon="mcds-icon__triangle-solid-14" className="mcds-m__r-20" />
                                    <DropDown className="mcds-dropdown__min-no mcds-m__t-8">
                                        <DropDownList>
                                            <DropDownItem className="close">编辑</DropDownItem>
                                            <DropDownItem className="close">删除</DropDownItem>
                                        </DropDownList>
                                    </DropDown>
                                </DropDownTrigger>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                设计
                            </td>
                            <td>
                                Bettie Pierce,08/15/2017
                            </td>
                            <td>
                                是
                            </td>
                            <td />
                            <td className="mcds-cell__shrink">
                                <DropDownTrigger autoCloseTag="close" target="self" placement="bottom-left">
                                    <ButtonSmallIcon icon="mcds-icon__triangle-solid-14" className="mcds-m__r-20" />
                                    <DropDown className="mcds-dropdown__min-no mcds-m__t-8">
                                        <DropDownList>
                                            <DropDownItem className="close">编辑</DropDownItem>
                                            <DropDownItem className="close">删除</DropDownItem>
                                        </DropDownList>
                                    </DropDown>
                                </DropDownTrigger>
                            </td>
                        </tr>
                        <tr>
                            <td>
                            售前
                            </td>
                            <td>
                            Bettie Pierce,08/15/2017
                            </td>
                            <td>
                            否
                            </td>
                            <td>
                            Influencing The Influencer
                            </td>
                            <td className="mcds-cell__shrink">
                                <DropDownTrigger autoCloseTag="close" target="self" placement="bottom-left">
                                    <ButtonSmallIcon icon="mcds-icon__triangle-solid-14" className="mcds-m__r-20" />
                                    <DropDown className="mcds-dropdown__min-no mcds-m__t-8">
                                        <DropDownList>
                                            <DropDownItem className="close">编辑</DropDownItem>
                                            <DropDownItem className="close">删除</DropDownItem>
                                        </DropDownList>
                                    </DropDown>
                                </DropDownTrigger>
                            </td>
                        </tr>
                    </tbody>
                </Table>
            </div>
        );
    }

    render() {
        return (
            <div>
                <div className="personal-header">
                    <div className="mcds-pageheader mcds-p__b-30">
                        <div className="mcds-grid mcds-pageheader__header">
                            <div className="mcds-pageheader__header-left">
                                <div className="mcds-media">
                                    <div className="mcds-media__figure mcds-p__t-6">
                                        <div className="mcds-pageheader__header-left-icon" />
                                    </div>
                                    <div className="mcds-media__body mcds-m__l-20">
                                        <span className="mcds-pageheader__header-left-text">设置首页 > 用户</span>
                                        <div className="mcds-pageheader__title">
                                            personal name
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="mcds-pageheader__header-right">
                                <InputSearch placeholder="在页面查找" search="left" className={classnames(style['width-240'])} />
                            </div>
                        </div>
                        <div className="mcds-m__t-30">
                            <table className="mcds-table mcds-table-fixed__layout">
                                <thead>
                                    <tr>
                                        <Th className="mcds-is__sortable">
                                            详细信息
                                        </Th>
                                        <Th className="mcds-is__sortable" icon="mcds-icon__triangle-small">
                                            权限情况
                                        </Th>
                                        <Th className="mcds-is__sortable">
                                            所在小组(3)
                                        </Th>
                                        <Th className="mcds-is__sortable">
                                            所在列队(3)
                                        </Th>
                                        <Th className="mcds-is__sortable">
                                            所在海
                                        </Th>
                                        <Th className="mcds-is__sortable">
                                            登录历史
                                        </Th>
                                    </tr>
                                </thead>
                            </table>
                        </div>
                    </div>
                </div>
                <div className="personal-body mcds-p__t-20 mcds-p__l-20 mcds-p__b-20 mcds-p__r-20">
                    <div className={classnames(style.information, 'mcds-m__b-20 mcds-m__t-1 mcds-p__b-40')}>
                        <div className="pull-left mcds-m__l-20 mcds-m__t-20">
                            <i className={classnames('mcds-icon__arrow-line-20 mcds-text__size-20 mcds-icon__rotate-270', style['vertical-middle'])} />
                            <span className={classnames(style['font-style'], 'mcds-text__size-16 mcds-m__l-10')}>详细信息</span>
                        </div>
                        <Button className="mcds-button__neutral pull-right mcds-p__t-2 mcds-p__b-2 mcds-m__t-15 mcds-m__r-20">
                            Button
                        </Button>
                    </div>
                    <div className="mcds-m__b-20">
                        <div className={classnames(style.jurisdiction, '')}>
                            <div
                                className="pull-left mcds-m__l-20 mcds-m__t-20"
                                onClick={::this.isShowGurisdiction}>
                                <i className={classnames(`mcds-icon__arrow-line-20 mcds-text__size-20 ${this.state.showjurisdiction===true ? 'mcds-icon__rotate-0' : 'mcds-icon__rotate-270'}`, style['vertical-middle'])} />
                                <span className={classnames(style['font-style'], 'mcds-text__size-16 mcds-m__l-10')}>权限情况</span>
                            </div>
                            <Button className="mcds-button__neutral pull-right mcds-p__t-2 mcds-p__b-2 mcds-m__t-15 mcds-m__r-20">
                                Button
                            </Button>
                        </div>
                        {this.state.showjurisdiction===true ? this.showJurisdictionItem() : null}
                    </div>
                    <div className="mcds-m__b-20">
                        <div className={classnames(style.jurisdiction, '')}>
                            <div
                                className="pull-left mcds-m__l-20 mcds-m__t-20"
                                onClick={::this.isShowGroup}>
                                <i className={classnames(`mcds-icon__arrow-line-20 mcds-text__size-20 ${this.state.showgroup===true ? 'mcds-icon__rotate-0' : 'mcds-icon__rotate-270'}`, style['vertical-middle'])} />
                                <span className={classnames(style['font-style'], 'mcds-text__size-16 mcds-m__l-10')}>所在小组(3)</span>
                            </div>
                            <Button className="mcds-button__neutral pull-right mcds-p__t-2 mcds-p__b-2 mcds-m__t-15 mcds-m__r-20">
                                Button
                            </Button>
                        </div>
                        {this.state.showgroup===true ? this.showGroupItem() : null}
                    </div>
                    <div className={classnames(style.information, 'mcds-m__b-20 mcds-m__t-1 mcds-p__b-40')}>
                        <div className="pull-left mcds-m__l-20 mcds-m__t-20">
                            <i className={classnames('mcds-icon__arrow-line-20 mcds-text__size-20 mcds-icon__rotate-270', style['vertical-middle'])} />
                            <span className={classnames(style['font-style'], 'mcds-text__size-16 mcds-m__l-10')}>所在列队(3)</span>
                        </div>
                        <Button className="mcds-button__neutral pull-right mcds-p__t-2 mcds-p__b-2 mcds-m__t-15 mcds-m__r-20">
                            Button
                        </Button>
                    </div>
                    <div className={classnames(style.information, 'mcds-m__b-20 mcds-m__t-1 mcds-p__b-40')}>
                        <div className="pull-left mcds-m__l-20 mcds-m__t-20">
                            <i className={classnames('mcds-icon__arrow-line-20 mcds-text__size-20 mcds-icon__rotate-270', style['vertical-middle'])} />
                            <span className={classnames(style['font-style'], 'mcds-text__size-16 mcds-m__l-10')}>所在海</span>
                        </div>
                        <Button className="mcds-button__neutral pull-right mcds-p__t-2 mcds-p__b-2 mcds-m__t-15 mcds-m__r-20">
                            Button
                        </Button>
                    </div>
                    <div className={classnames(style.information, 'mcds-m__b-20 mcds-m__t-1 mcds-p__b-40')}>
                        <div className="pull-left mcds-m__l-20 mcds-m__t-20">
                            <i className={classnames('mcds-icon__arrow-line-20 mcds-text__size-20 mcds-icon__rotate-270', style['vertical-middle'])} />
                            <span className={classnames(style['font-style'], 'mcds-text__size-16 mcds-m__l-10')}>登记记录</span>
                        </div>
                        <Button className="mcds-button__neutral pull-right mcds-p__t-2 mcds-p__b-2 mcds-m__t-15 mcds-m__r-20">
                            Button
                        </Button>
                    </div>
                </div>
            </div>
        );
    }
}
