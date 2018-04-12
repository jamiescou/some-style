import React, { Component } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

import {
    Input,
    Popover,
    PopoverBody,
    PopoverTrigger,
    InputRequird
} from 'carbon';
import FieldType from '../base-components/_field';
import CheckboxComponent from '../base-components/_checkbox';

let style = require('styles/modules/setup/object.scss');

export default class BuildAutonumber extends Component {
    constructor(){
        super();
        this.state = {
            numberFormat: '',
            startNumber: ''
        };
        this.getValue = this.getValue.bind(this);
    }
    getValue(){
        return this.state;
    }
    // 设置编号格式和起始编号
    // Todo 字段不确定
    handleInputText(type, val){
        this.setState({
            [type]: val
        });
    }
    // 渲染字段类型
    renderFieldType(){
        let {schema, curSchema} = this.props;
        return (
            <div className="mcds-layout__item-12">
                <FieldType className="mcds-layout__item-6 mcds-m__b-20 mcds-p__r-15" schema={schema} curSchema={curSchema} onTypeChange={this.props.onTypeChange} />
                <div className="mcds-layout__item-12">
                    <div className="mcds-layout__item-6 mcds-p__r-15">
                        <Input value={this.state.numberFormat} label={label} onChange={this.handleInputText.bind(this, 'numberFormat')} />
                    </div>
                    <div className="mcds-layout__item-6 mcds-p__l-15">
                        <InputRequird value={this.state.startNumber} onChange={this.handleInputText.bind(this, 'startNumber')} label="起始编号" />
                    </div>
                </div>
            </div>
        );
    }
    render(){
        return (
            <div className="mcds-layout__column mcds-p__t-20 mcds-p__l-40 mcds-p__r-40 mcds-p__b-40">
                {this.renderFieldType()}
                <div className="mcds-layout__item-12 mcds-m__t-20">
                    <div className={classnames('mcds-m__t-5 clearfix', style['create-choose__checkbox'])}>
                        <CheckboxComponent ref="getIndex" type="index" />
                        <CheckboxComponent ref="getSearch" type="searchable" />
                    </div>
                </div>
            </div>
        );
    }
}

BuildAutonumber.propTypes = {
    schema: PropTypes.object,
    curSchema: PropTypes.object,
    onTypeChange: PropTypes.func
};

// 字段基础属性 的 popover组件
let PopoverDemoThemeInfo = props => (
    <Popover theme="info" className={classnames(props.className)}>
        <PopoverBody>
            <span>示例：{'A-{0000}'} 。<a href="javascript:;">这是什么？</a></span>
        </PopoverBody>
    </Popover>
);
let label = (<span>
    编号格式
    <PopoverTrigger triggerBy="click" placement={'right'} overlay={<PopoverDemoThemeInfo />}>
        <span className={classnames('mcds-icon mcds-filter__inline-block mcds-icon__info-solid-14 mcds-filter__logic-icon mcds-p__l-5', style['margin-top__2'])} />
    </PopoverTrigger>
</span>);
PopoverDemoThemeInfo.propTypes = {
    className: PropTypes.string
};

