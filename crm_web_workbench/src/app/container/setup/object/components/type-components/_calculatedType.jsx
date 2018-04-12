import _ from 'lodash';
import React, {Component} from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

// import FilterCondition from '../base-container/_filterCondition';
import Editor from '../base-components/_editor';
import FieldType from '../base-components/_field';
import CheckboxComponent from '../base-components/_checkbox';
let style = require('styles/modules/setup/object.scss');
import {
    Select,
    Popover,
    PopoverBody,
    PopoverTrigger,
    Radio
} from 'carbon';

export default class BuildCalculated extends Component {
    static propTypes = {}
    constructor(){
        super();
        this.state = {
        };
        this.getValue = this.getValue.bind(this);
    }
    getValue(){
        let index = this.refs.getIndex.getValue();
        // Todo: 视为0或者空白的 暂用
        let formulaTreatBlankAs = this.state;
        let mergeData = _.merge({}, index, formulaTreatBlankAs);
        return mergeData;
    }

    // 视为零或者空白 字段表示目前还没有 formulaTreatBlankAs 暂用这个
    // Todo
    handleChooseRadio(type){
        this.setState({
            formulaTreatBlankAs: type
        });
    }
    // 渲染字段类型
    renderFieldType(){
        let {schema, curSchema} = this.props;
        return (
            <div className="mcds-layout__item-12">
                <FieldType className="mcds-layout__item-6 mcds-p__r-15" schema={schema} curSchema={curSchema} onTypeChange={this.props.onTypeChange} />
                <div className="mcds-layout__item-6 mcds-p__l-15">
                    {requiredLabel('选择公式返回类型')}
                    <Select className="mcds-m__t-5" >
                        <option>URL</option>
                        <option>累计汇总</option>
                    </Select>
                </div>
            </div>
        );
    }
    // 渲染公式编辑器
    renderEditor(){
        return (
            <div className="mcds-layout__item-12">
                <div className={classnames('clearfix mcds-text__size-12 mcds-m__t-20 mcds-m__b-5 ', style['text-color'])}>
                    <span className="pull-left"><i className={classnames('mcds-p__r-5', style['required-color'])}>*</i>公式编辑器</span>
                    <a href="https://www.meiqia.com" className="pull-right mcds-text__link mcds-cursor__pointer" >
                        点击查看示例
                    </a>
                </div>
                <Editor type="calculated" />
                <div className="mcds-m__t-20 mcds-m__b-10">
                    <span className={classnames('mcds-text__size-12', style['text-color'])}>空白字段处理</span>
                    <PopoverTrigger triggerBy="click" placement={'right'} overlay={<PopoverDemoThemeInfo />}>
                        <span className={classnames('mcds-icon mcds-filter__inline-block mcds-icon__info-solid-14 mcds-filter__logic-icon mcds-p__l-5', style['margin-top__2'])} />
                    </PopoverTrigger>
                </div>
                <div className={classnames('mcds-m__t-5 clearfix', style['create-type__checkbox'])}>
                    <Radio className="mcds-m__r-31" label="视为零" name="regard" onChange={this.handleChooseRadio.bind(this, 'Zero')} />
                    <Radio label="视为空白" name="regard" onChange={this.handleChooseRadio.bind(this, 'Blank')} />
                    <CheckboxComponent ref="getIndex" type="index" />
                </div>
            </div>
        );
    }

    render(){
        return (
            <div>
                <div className="mcds-layout__column mcds-p__t-20 mcds-p__l-40 mcds-p__r-40 mcds-p__b-30">
                    {this.renderFieldType()}
                    {this.renderEditor()}
                </div>
            </div>
        );
    }
}

BuildCalculated.propTypes = {
    schema: PropTypes.object,
    curSchema: PropTypes.object,
    onTypeChange: PropTypes.func
};

let PopoverDemoThemeInfo = props => (
    <Popover theme="info" className={classnames(props.className)}>
        <PopoverBody>
            暂时没看到在哪里
        </PopoverBody>
    </Popover>
);

PopoverDemoThemeInfo.propTypes = {
    className: PropTypes.string
};
let requiredLabel = (text) => (
    <span className={classnames('mcds-text__size-12', style['text-color'])}><i className={classnames('mcds-p__r-5', style['required-color'])}>*</i>{text}</span>
);
