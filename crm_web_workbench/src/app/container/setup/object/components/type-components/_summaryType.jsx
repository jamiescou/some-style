import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import _ from 'lodash';
import {
    Select,
    Radio
} from 'carbon';
import FilterCondition from '../base-components/_filterCondition';
import FieldType from '../base-components/_field';
import CheckboxComponent from '../base-components/_checkbox';

let style = require('styles/modules/setup/object.scss');
// 运算符类型
let summaryType = {
    COUNT: 'COUNT',
    SUM: 'SUM',
    MIN: 'MIN',
    MAX: 'MAX',
    AVG: 'AVG'
};
/* 百分比、货币、数量 percent currency
百分比、货币、数量以及日期 datetime*/
// let summaryField = {
//     percent: {
//         display_name: '百分比',
//         value: 'percent'
//     },
//     total: {
//         display_name: '货币',
//         value: 'currency'
//     },
//     currency: {
//         display_name: '货币',
//         value: 'currency'
//     },
//     datetime: {
//         display_name: '日期',
//         value: 'datetime'
//     }
// };
export default class BuildSummary extends Component {
    static propTypes = {
        schema: PropTypes.object,
        curSchema: PropTypes.object,
        onTypeChange: PropTypes.func
    };
    constructor(){
        super();
        this.state = {
            filterCondition: true,
            useFilter: 'yes',
            disabled: true,
            summaryType: '',
            summaryField: ''
        };
        this.getValue = this.getValue.bind(this);
    }
    getValue(){
        let index = this.refs.getIndex.getValue();
        // let expression = this.structField();
        return _.merge({}, index);
    }
    // 构建汇总的表达式字段
    structField(){

    }
    handleFilterCondition(){
        this.setState({
            filterCondition: !this.state.filterCondition
        });
    }
    // 切换使不使用
    handleUseFilter(type){
        this.setState({
            useFilter: type
        });
    }
    // 选择汇总类型
    handleSummaryType(val){
        switch (val){
        case 'SUM' :
            this.setState();
            break;
        case 'MIN' :
        case 'MAX' :
        case 'AVG' :
            this.setState();
            break;
        default :
            this.setState({
                disabled: true,
                summaryField: ''
            });
        }
    }
    // 渲染字段类型
    renderFieldType(){
        let {schema, curSchema} = this.props;
        // Todo: 待做 字段类型的依赖关系
        return (
            <div className="mcds-layout__item-12">
                <FieldType className="mcds-layout__item-6 mcds-p__r-15 mcds-p__t-1" schema={schema} curSchema={curSchema} onTypeChange={this.props.onTypeChange} />
                <div className="mcds-layout__item-6 mcds-p__l-15">
                    {requiredLabel('选择汇总对象')}
                    <Select value={this.state.object_name ? this.state.object_name : '请选择'} className="mcds-m__t-5">
                        <option value="URL">URL</option>
                    </Select>
                </div>

                <div className="mcds-layout__item-6 mcds-p__r-15 mcds-m__t-20">
                    {requiredLabel('选择汇总类型')}
                    <Select onChange={::this.handleSummaryType} value={this.state.object_name ? this.state.object_name : '请选择'} className="mcds-m__t-5">
                        {
                            _.map(summaryType, (val, key) => {
                                return <option key={key} value={val}>{val}</option>;
                            })
                        }
                    </Select>
                </div>

                <div className="mcds-layout__item-6 mcds-p__l-15 mcds-m__t-20">
                    {requiredLabel('选择汇总字段')}
                    <Select disabled={this.state.disabled} value={this.state.object_name ? this.state.object_name : '请选择'} className="mcds-m__t-5">
                        <option value="URL">URL</option>
                        <option value="Checkbox">Checkbox</option>
                    </Select>
                </div>
                <div className="mcds-layout__item-6">
                    <CheckboxComponent className="mcds-m__t-20" ref="getIndex" type="index" />
                </div>
            </div>
        );
    }
    renderFilterCondition(){
        if (this.state.filterCondition){
            return (
                <div className={classnames('mcds-p__t-20 mcds-p__l-40 mcds-p__r-40', {'mcds-p__b-30': this.state.useFilter === 'yes'})}>
                    <div className="clearfix mcds-m__b-20">
                        <Radio checked={this.state.useFilter === 'no'} className="mcds-m__r-31 pull-left" label="不使用" name="useFilter" onChange={this.handleUseFilter.bind(this, 'no')} />
                        <Radio checked={this.state.useFilter === 'yes'} className="pull-left" label="使用" name="useFilter" onChange={this.handleUseFilter.bind(this, 'yes')} />
                    </div>
                    {
                        this.state.useFilter === 'yes' ? <FilterCondition type="filterCondition" /> : ''
                    }
                </div>
            );
        }
    }
    render(){
        return (
            <div>
                <div className="mcds-layout__column mcds-p__t-20 mcds-p__l-40 mcds-p__r-40 mcds-p__b-30">
                    {this.renderFieldType()}
                </div>
                <div className={classnames('mcds-p__t-15 mcds-p__b-15 mcds-p__l-16 mcds-text__size-16', style['font-weight__300'], style['border-b__shadow'])} onClick={::this.handleFilterCondition}>
                    <i className={classnames('mcds-icon__arrow-line-20 mcds-text__size-16 mcds-m__l-5 mcds-m__r-5', {'mcds-icon__rotate-270': !this.state.filterCondition})} />
                    筛选条件
                </div>
                {this.renderFilterCondition()}
            </div>
        );
    }
}

let requiredLabel = (text) => (
    <span className={classnames('mcds-text__size-12', style['text-color'])}><i className={classnames('mcds-p__r-5', style['required-color'])}>*</i>{text}</span>
);
