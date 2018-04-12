import _ from 'lodash';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {
    InputSearch,
    Select,
    Input,
    Popover,
    PopoverBody,
    PopoverTrigger
} from 'carbon';

let style = require('styles/modules/setup/object.scss');

// 运算符的类型
let operatorObject = {
    STARTSWITH: {
        value: 'STARTSWITH',
        display_name: '起始字符'
    }, // 起始字符
    CONTAINS: {
        value: 'CONTAINS',
        display_name: '包含'
    }, // 包含
    NOTCONTAINS: {
        value: 'NOTCONTAINS',
        display_name: '不包含'
    }, // 不包含
    INRANGE: {
        value: 'INRANGE',
        display_name: '等于(范围)'
    }, // 等于(范围)
    EQUALS: {
        value: '==',
        display_name: '等于'
    }, // 等于
    NOT_EQUAL: {
        value: '!=',
        display_name: '不等于'
    }, // 不等于
    LESS_THAN: {
        value: '<',
        display_name: '小于'
    }, // 小于
    GREATER_THAN: {
        value: '>',
        display_name: '大于'
    }, // 大于
    LESS_OR_EQUAL: {
        value: '<=',
        display_name: '小于等于'
    }, // 小于等于
    GREATER_OR_EQUAL: {
        value: '>=',
        display_name: '大于等于'
    } // 大于等于
};

export default class FilterCondition extends Component {
    static propTypes = {
        type: PropTypes.string
    }
    constructor(){
        super();
        this.state = {
            data: {}
        };
        this.getValue = this.getValue.bind(this);
    }
    getValue(){
        return this.state.data;
    }
    // 生成运算符的options
    buildOptions(){
        let opts = [];
        _.map(operatorObject, v => {
            opts.push(<option key={v.value} value={v.value}>{v.display_name}</option>);
        });
        return opts;
    }

    // 运算符 => 页面展示
    operatorValue(val) {
        let result = null;
        for (let key in operatorObject) {
            if (operatorObject[key].value === val) {
                result = operatorObject[key].display_name;
            }
        }
        return result;
    }

    // 渲染运算符操作
    renderOperator(){
        return (
            <div className={classnames(this.props.type === 'lookupFilter' ? `mcds-p__r-20 ${style['filter-form__w-2']}` : 'mcds-p__r-30 mcds-layout__item-4' )}>
                <Select label="运算符" >
                    {::this.buildOptions()}
                </Select>
            </div>
        );
    }
    // 渲染筛选条件
    renderFilterCondition(){
        if (this.props.type === 'lookupFilter'){
            return (
                <div className={classnames('mcds-m__b-10 clearfix', style['filter-form__w'])}>
                    {_.map()}
                    <div className={classnames('mcds-p__r-20', style['filter-form__w-3'])}>
                        <InputSearch label="字段" placeholder="搜索" search="right" />
                    </div>
                    {this.renderOperator()}
                    <div className={classnames('mcds-p__r-20', style['filter-form__w-2'])}>
                        <Select label="值 / 字段" >
                            <option>值</option>
                            <option>字段</option>
                        </Select>
                    </div>
                    <div className={classnames('mcds-p__t-23 mcds-p__r-20', style['filter-form__w-3'])}>
                        <Input />
                    </div>
                </div>
            );
        }
        return (
            <div className={classnames('mcds-m__b-10 clearfix')}>
                <div className={classnames('mcds-p__r-30 mcds-layout__item-4')}>
                    <InputSearch label="字段" placeholder="搜索" search="right" />
                </div>
                {this.renderOperator()}
                <div className={classnames('mcds-p__r-30 mcds-layout__item-4')}>
                    <Input label="值" />
                </div>
            </div>
        );
    }
    render(){
        return (
            <div>
                <span className={classnames('mcds-text__size-12', style['text-color'])}>
                    {this.props.type === 'lookupFilter' ? '过滤条件' : '筛选条件'}
                </span>
                <div className={classnames('mcds-m__t-5', style['create-filter'])}>
                    <div>
                        <div className={classnames('mcds-p__t-20 mcds-p__l-30 mcds-p__b-20', {'mcds-p__r-10': this.props.type === 'lookupFilter'})}>
                            {this.renderFilterCondition()}
                            <div className={classnames('mcds-p__t-10 clearfix', this.props.type === 'lookupFilter' ? 'mcds-p__r-20' : ' mcds-p__r-30')}>
                                <a href="javascript:;" className="pull-left">添加筛选条件</a>
                                <a href="javascript:;" className="pull-right">全部清除</a>
                            </div>
                        </div>
                        <div className={classnames('mcds-p__t-20 mcds-p__b-40 mcds-p__l-30 mcds-p__r-30', style['create-shadow__t'])}>
                            <a href="javascript:;">添加筛选逻辑</a>
                            <PopoverTrigger triggerBy="click" placement={'right'} overlay={<PopoverDemoThemeInfo />}>
                                <span className={classnames('mcds-icon mcds-filter__inline-block mcds-icon__info-solid-14 mcds-filter__logic-icon mcds-p__l-5', style['margin-top__2'])} />
                            </PopoverTrigger>
                            <div className="mcds-m__t-5">
                                <Input placeholder="添加筛选逻辑" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

let PopoverDemoThemeInfo = props => (
    <Popover theme="info" className={classnames(props.className)}>
        <PopoverBody>
            若为必填，则用户必须输入与筛选器条件匹配的值。
        </PopoverBody>
    </Popover>
);
PopoverDemoThemeInfo.propTypes = {
    className: PropTypes.string
};

