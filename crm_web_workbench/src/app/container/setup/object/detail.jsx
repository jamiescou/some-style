import React, { Component } from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import classnames from 'classnames';
import { Link } from 'react-router';
import {
    InputSearch,
    Button,
    Navigation,
    NavList,
    NavItem,
    Table,
    DropDownTrigger,
    ButtonSmallIcon,
    DropDown,
    DropDownList,
    DropDownItem
} from 'carbon';


let style = require('styles/modules/setup/object.scss');
@connect(
    null,
    dispatch => bindActionCreators({}, dispatch)
)
export default class ObjectDetail extends Component {
    static propTypes = {
    };
    constructor(){
        super();
        this.state = {
            field: false
        };
    }
    handleField(){
        this.setState({
            field: !this.state.field
        });
    }
    renderPageHeader(){
        return (
            <div className={classnames('mcds-pageheader', style['detail-relative'])}>
                <div className="mcds-grid mcds-pageheader__header">
                    <div className="mcds-pageheader__header-left">
                        <div className="mcds-media">
                            <div className="mcds-m__r-30 mcds-p__t-6">
                                <div className={classnames('mcds-pageheader__header-left-icon mcds-p__t-4 mcds-p__l-4', style['bg-gray'])} >
                                    <span className={classnames('mcds-text__size-24 mcds-icon__settings-solid-24', style['color-white'])} />
                                </div>
                            </div>
                            <div className="mcds-media__body">
                                <div className="mcds-pageheader__header-left-text mcds-text__size-13">
                                    <Link to="/setup">
                                        设置首页
                                    </Link>
                                    <i className={classnames('mcds-icon__arrow-line-20 mcds-text__size-13 mcds-icon__rotate-270 mcds-m__l-5 mcds-m__r-5', style['detail-icon'])} />
                                    <Link to="/setup/object">
                                        对象设置
                                    </Link>
                                </div>
                                <div className="mcds-text__line-28 mcds-pageheader__title">
                                    客户
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mcds-pageheader__header-right">
                        <InputSearch className={classnames(style['object-search'])} placeholder="在页面搜索" search="left" />
                    </div>
                </div>
                <div className="mcds-grid mcds-pageheader__footer mcds-m__t-30">
                    <Navigation>
                        <NavList className={classnames('clearfix', style['detail-list'])}>
                            <NavItem>
                                <a href="">
                                    字段和关系
                                    <span className={classnames('mcds-m__l-5', style['text-color'])}>(24)
                                    </span>
                                </a>
                            </NavItem>
                            <NavItem>
                                <a href="">验证规则</a>
                            </NavItem>
                            <NavItem>
                                <a href="">列表布局配置</a>
                            </NavItem>
                            <NavItem>
                                <a href="">
                                    详细页布局配置
                                    <span className={classnames('mcds-m__l-5', style['text-color'])}>(2)</span>
                                </a>
                            </NavItem>
                            <NavItem>
                                <a href="">
                                    其他
                                </a>
                            </NavItem>
                            <NavItem>
                                <a href="">
                                    相关查找筛选器
                                    <span className={classnames('mcds-m__l-5', style['text-color'])}>(4)</span>
                                </a>
                            </NavItem>
                            <NavItem>
                                <a href="">
                                    记录类型
                                </a>
                            </NavItem>
                        </NavList>
                    </Navigation>
                </div>
            </div>
        );
    }
    // 字段和关系项
    renderField(){
        return (
            <div>
                <div className={classnames('clearfix mcds-p__l-20 mcds-p__r-20 mcds-text__size-16', style['detail-field'])}>
                    <div className="pull-left mcds-cursor__pointer" onClick={::this.handleField}>
                        <i className={classnames('mcds-icon__arrow-line-20 mcds-text__size-16 mcds-m__l-5 mcds-m__r-5', {'mcds-icon__rotate-270': this.state.field})} />
                        字段和关系
                    </div>
                    <Link to="/setup/object/detail/test/field">
                        <Button className={classnames('mcds-m__t-16 mcds-button__neutral pull-right', style['font-weight__400'])}>
                            新建字段
                        </Button>
                    </Link>
                </div>
                <div className={classnames({hide: this.state.field}, 'mcds-p__b-40', style['bg-white'])}>
                    <Table className="mcds-table mcds-table__bordered">
                        <thead>
                            <tr className="mcds-text-title__caps ">
                                <th className="mcds-table__truncate mcds-p__l-20">
                                    字段标签
                                </th>
                                <th className="mcds-table__truncate">
                                    字段名
                                </th>
                                <th className="mcds-table__truncate">
                                    数据类型
                                </th>
                                <th className="mcds-table__truncate">
                                    控制字段
                                </th>
                                <th>
                                    已索引
                                </th>
                                <th />
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="mcds-p__l-20">
                                    <span className="mcds-table__truncate" title="字段标签">
                                        电子邮件
                                    </span>
                                </td>
                                <td>
                                    <span className="mcds-table__truncate" title="字段名">
                                        Email
                                    </span>
                                </td>
                                <td>
                                    <span className="mcds-table__truncate" title="数据类型">
                                        电子邮件
                                    </span>
                                </td>
                                <td>
                                    <span className="mcds-table__truncate" title="控制字段">
                                        无
                                    </span>
                                </td>
                                <td>
                                    <span className="mcds-table__truncate" title="已索引">
                                        是
                                    </span>
                                </td>
                                <td>
                                    <div className="">
                                        <DropDownTrigger autoCloseTag="close" target="self" placement="bottom-left" synchWidth={false} >
                                            <ButtonSmallIcon icon="mcds-icon__triangle-solid-14" />
                                            <DropDown className="mcds-dropdown__min-no">
                                                <DropDownList>
                                                    <DropDownItem>
                                                        编辑
                                                    </DropDownItem>
                                                    <DropDownItem>
                                                        删除
                                                    </DropDownItem>
                                                </DropDownList>
                                            </DropDown>
                                        </DropDownTrigger>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </Table>
                </div>
            </div>
        );
    }

    /*
        // 验证规则
        renderValidateRule(){

        }
        // 列表布局配置
        renderListLayout(){}
        // 详细页布局配置
        renderDetailLayout(){

        }
        测试插入字段的模态窗
        <FilterModal active={true} onClose={ () => {this.setState({active: false}); }} />
    */
    render() {
        return (
            <div>
                {this.renderPageHeader()}
                <div className="mcds-m__t-20 mcds-m__r-20 mcds-m__b-20 mcds-m__l-20">
                    {this.renderField()}
                </div>
            </div>
        );
    }
}
