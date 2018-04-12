import React, { Component } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

let style = require('styles/modules/setup/object.scss');
import {
    Button,
    Input,
    Popover,
    PopoverBody,
    PopoverTrigger,
    Checkbox,
    FlexTable
} from 'carbon';

export default class AddCustomList extends Component {
    constructor(){
        super();
    }
    handleState(){
        // this.props.onCommit('add-custom-list');
        // 这个页面应该跳转到别处了
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
                        <Checkbox className={classnames(style['create-position__checkbox'])} label="添加" />
                    </div>
                </div>
                <div className={classnames('mcds-table__content mcds-p__l-20', style['flex-table__contain'])}>
                    <div className="mcds-flex2">
                        Account（Marketing）Layout
                    </div>
                    <div className="mcds-flex2">
                        <Checkbox className={classnames(style['create-position__checkbox'])} label="添加" />
                    </div>
                </div>
            </FlexTable>
        );
    }
    renderListLabel(){
        return (
            <div className="mcds-layout__column">
                <span className={classnames('mcds-text__size-12 mcds-layout__item-12 mcds-m__b-5', style['text-color'])}>
                    相关列表标签
                    <PopoverTrigger triggerBy="click" placement={'right'} overlay={<PopoverDemoThemeInfo />}>
                        <span className={classnames('mcds-icon mcds-filter__inline-block mcds-icon__info-solid-14 mcds-filter__logic-icon mcds-p__l-5', style['margin-top__2'])} />
                    </PopoverTrigger>
                </span>
                <Input className="mcds-layout__item-6 mcds-m__b-20" />
            </div>
        );
    }
    render(){
        return (
            <div className={classnames('mcds-m__l-20 mcds-m__t-20 mcds-m__r-20', style['create-content'], style['bg-white'])}>
                <div className={classnames('mcds-p__t-15 mcds-p__b-15 mcds-p__l-20 mcds-text__size-16', style['font-weight__300'], style['border-b__shadow'])}>
                    添加自定义相关列表
                </div>
                <div className="mcds-p__t-20 mcds-p__l-40 mcds-p__r-40 mcds-p__b-30">
                    {this.renderListLabel()}
                    <div className={classnames('mcds-m__b-10', style['field-setting__text-color'])}>
                        * 若添加至页面布局，则该对象将以相关列表的形式展现。
                    </div>
                    {this.renderTable()}
                </div>
                <div className={classnames('mcds-text__center mcds-p__t-12 mcds-p__b-12', style['border-b__shadow'], style['color-save'])}>
                    <Button className="mcds-button__neutral mcds-m__r-12">
                        取消
                    </Button>
                    <Button className="mcds-button__brand" onClick={this.handleState.bind(this)}>
                        保存
                    </Button>
                </div>
            </div>
        );
    }
}

let PopoverDemoThemeInfo = props => (
    <Popover theme="info" className={classnames(props.className)}>
        <PopoverBody>
            这是啥我不知道
        </PopoverBody>
    </Popover>
);
PopoverDemoThemeInfo.propTypes = {
    className: PropTypes.string
};
