import classnames from 'classnames';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

let style = require('styles/modules/setup/object.scss');
import {
    Button,
    Checkbox,
    FlexTable
} from 'carbon';

export default class AddPageLayout extends Component {
    constructor(){
        super();
    }
    handleState(){
        this.props.onCommit('add-custom-list');
    }
    renderTable(){
        return (
            <FlexTable className={classnames('mcds-text mcds-table__striped', style['field-setting__flex-table'])}>
                <div className={classnames('mcds-table__title mcds-p__l-20', style['flex-table__header'])}>
                    <div className="mcds-flex2">
                        页面布局名
                    </div>
                    <div className="mcds-flex2">
                        <Checkbox className={classnames(style['create-position__checkbox'])} label="全选" />
                    </div>
                </div>
                <div className={classnames('mcds-table__content mcds-p__l-20', style['flex-table__contain'])}>
                    <div className="mcds-flex2">
                        Account（Marketing）Layout
                    </div>
                    <div className="mcds-flex2">
                        <Checkbox className={classnames(style['create-position__checkbox'])} label="使用" />
                    </div>
                </div>
                <div className={classnames('mcds-table__content mcds-p__l-20', style['flex-table__contain'])}>
                    <div className="mcds-flex2">
                        Account（Marketing）Layout
                    </div>
                    <div className="mcds-flex2">
                        <Checkbox className={classnames(style['create-position__checkbox'])} label="使用" />
                    </div>
                </div>
                <div className={classnames('mcds-table__content mcds-p__l-20', style['flex-table__contain'])}>
                    <div className="mcds-flex2">
                        Account（Marketing）Layout
                    </div>
                    <div className="mcds-flex2">
                        <Checkbox className={classnames(style['create-position__checkbox'])} label="使用" />
                    </div>
                </div>
            </FlexTable>
        );
    }

    render(){
        return (
            <div className={classnames('mcds-m__l-20 mcds-m__t-20 mcds-m__r-20', style['create-content'], style['bg-white'])}>
                <div className={classnames('mcds-p__t-15 mcds-p__b-15 mcds-p__l-20 mcds-text__size-16', style['font-weight__300'], style['border-b__shadow'])}>
                    添加到页面布局
                </div>
                <div className="mcds-p__t-20 mcds-p__l-40 mcds-p__r-40 mcds-p__b-30">
                    <div className={classnames('mcds-m__b-10', style['field-setting__text-color'])}>
                        * 将字段添加到页面布局，则可在页面布局使用该字段。
                    </div>
                    {this.renderTable()}
                </div>
                <div className={classnames('mcds-text__center mcds-p__t-12 mcds-p__b-12', style['border-b__shadow'], style['color-save'])}>
                    <Button className="mcds-button__neutral mcds-m__r-12">
                        取消
                    </Button>
                    <Button className="mcds-button__brand" onClick={::this.handleState}>
                        保存
                    </Button>
                </div>
            </div>
        );
    }
}
AddPageLayout.propTypes = {
    onCommit: PropTypes.func
};
