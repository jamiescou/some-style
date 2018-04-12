import React, { Component } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import {
    Select,
    Button,
    TextArea,
    Navigation,
    NavList,
    NavItem
} from 'carbon';
let style = require('styles/modules/setup/object.scss');
/* let operatorObject = {
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
}; */
export default class Editor extends Component {
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

    renderFieidCondition(){
        if (this.props.type === 'calculated'){
            return (
                <div className="mcds-layout__item-12">
                    <div className="mcds-layout__item-6 mcds-p__r-20">
                        <Select label="插入字段">
                            <option>字段类型1</option>
                            <option>字段类型2</option>
                        </Select>
                    </div>
                    <div className="mcds-layout__item-6 mcds-p__r-20">
                        <Select label="插入运算符">
                            <option>字段</option>
                            <option>字段</option>
                        </Select>
                    </div>
                </div>
            );
        }
        return (
            <div className="mcds-layout__item-12">
                <div className="mcds-layout__item-4 mcds-p__r-20">
                    <Select label="选择字段类型">
                        <option>字段类型1</option>
                        <option>字段类型2</option>
                    </Select>
                </div>
                <div className="mcds-layout__item-4 mcds-p__r-20">
                    <Select label="插入字段">
                        <option>字段</option>
                        <option>字段</option>
                    </Select>
                </div>
                <div className="mcds-layout__item-4 mcds-p__r-20">
                    <Select label="插入运算符">
                        <option>运算符</option>
                    </Select>
                </div>
            </div>
        );
    }

    render(){
        return (
            <div className={classnames('mcds-layout__column mcds-p__t-20 mcds-p__l-30 mcds-p__b-30 mcds-p__r-30', style['create-editor'])}>
                <div className="mcds-layout__item-8">
                    {this.renderFieidCondition()}
                    {/* 文本域 */}
                    <div className="mcds-layout__item-12 mcds-p__r-20 mcds-p__t-20">
                        <TextArea className={classnames(style['create-textarea'])} />
                    </div>
                    <div className={classnames('mcds-layout__item-12 mcds-m__t-20 mcds-p__r-20', style['check-relative'])}>
                        <Button className="mcds-button__neutral">
                            检查语法
                        </Button>
                        <span className={classnames('mcds-text__size-12 mcds-text__weak', style['check-text'])}>
                            使用 公式语法： 例如， 双引号中的文本: "您好", 数字: 25, 小数形式的百分比: 0.10, 日期表达式: Today() + 7
                        </span>
                    </div>
                </div>
                <div className="mcds-layout__item-4 mcds-p__l-10">
                    <Select label="函数">
                        <option>运算符</option>
                    </Select>
                    <Navigation className={classnames('mcds-m__t-20', style['create-func'])}>
                        <NavList>
                            <NavItem className="mcds-is-active">ABS</NavItem>
                            <NavItem>AND</NavItem>
                            <NavItem>BEGINS</NavItem>
                            <NavItem>BLANKVALUE</NavItem>
                            <NavItem>BR</NavItem>
                            <NavItem>CASE</NavItem>
                        </NavList>
                    </Navigation>
                    <div>
                        <div className={classnames('mcds-layout__item-12 mcds-m__t-20 mcds-p__r-20', style['check-relative'])}>
                            <Button className="mcds-button__neutral mcds-p__l-10 mcds-p__r-10">
                                插入所选函数
                            </Button>
                            <span className={classnames('mcds-text__size-12 mcds-text__weak', style['insert-func'])}>
                                检查是否所有参数均为真，如果所有参数均为真则返回 TRUE
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
Editor.propTypes = {
    type: PropTypes.string
};
