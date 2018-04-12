import React, { Component } from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import classnames from 'classnames';
import { Link } from 'react-router';

let style = require('styles/modules/setup/object.scss');
import {
    Button,
    InputSearch,
    Table,
    Th,
    DropDownTrigger,
    ButtonSmallIcon,
    DropDown,
    DropDownList,
    DropDownItem
} from 'carbon';
@connect(
    null,
    dispatch => bindActionCreators({}, dispatch)
)
export default class ObjectList extends Component {
    static propTypes = {
    };
    constructor(){
        super();
    }
    renderPageHeader(){
        return (
            <div className={classnames('mcds-pageheader', style['index-relative'])}>
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
                                </div>
                                <div className="mcds-text__line-28 mcds-pageheader__title">
                                    对象设置
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mcds-pageheader__header-right">
                        <InputSearch className={classnames(style['search-object'])} placeholder="在页面搜索" search="left" />
                        <Link to="/setup/object/create">
                            <Button className={classnames(style['create-object'], 'mcds-button__neutral', 'mcds-button mcds-button__item')}>
                                <i className={classnames('mcds-icon__left mcds-icon__add-line-20', style['create-icon'])} />
                                新建对象
                            </Button>
                        </Link>
                    </div>
                </div>
                <div className="mcds-grid mcds-pageheader__footer mcds-m__t-30">
                    <div className="mcds-pageheader__footer-left">
                        <ul className="mcds-list__horizontal mcds-text__weak mcds-text__size-12">
                            <li className="mcds-list__item">6个设置项</li>
                            <li className="mcds-list__item mcds-p__l-7 mcds-p__r-7">•</li>
                            <li className="mcds-list__item">排序方式为修改时间</li>
                        </ul>
                    </div>
                </div>
            </div>
        );
    }
    renderTable(){
        return (
            <Table className="mcds-table__striped">
                <thead>
                    <tr className="mcds-text-title__caps">
                        <th className="mcds-table__truncate mcds-p__l-20">
                            对象名称
                        </th>
                        <th className="mcds-table__truncate">
                            创建人
                        </th>
                        <th className="mcds-table__truncate">
                            创建时间
                        </th>
                        <th className="mcds-table__truncate">
                            上次修改人
                        </th>
                        <Th className="mcds-table__truncate" icon="mcds-icon__arrow-solid-14">
                            上次修改时间
                        </Th>
                        <th />
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="mcds-p__l-20">
                            <span className="mcds-table__truncate" title="设置项">
                                <Link to="/setup/object/detail/test">
                                    客户
                                </Link>
                            </span>
                        </td>
                        <td>
                            <span className="mcds-table__truncate" title="创建人">
                                Belle Franklin
                            </span>
                        </td>
                        <td>
                            <span className="mcds-table__truncate" title="创建时间">
                                08/15/2017
                            </span>
                        </td>
                        <td>
                            <span className="mcds-table__truncate" title="上次修改人">
                                Belle Franklin
                            </span>
                        </td>
                        <td>
                            <span className="mcds-table__truncate" title="上次修改时间">
                                08/15/2017
                            </span>
                        </td>
                        <td>
                            <div>
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
        );
    }
    render() {
        return (
            <div>
                {this.renderPageHeader()}
                <div className={classnames('mcds-m__t-20 mcds-m__l-20 mcds-m__r-20', style['bg-white'])}>
                    {this.renderTable()}
                </div>
            </div>
        );
    }
}
