import React, { Component } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import _ from 'lodash';
import {
    Checkbox,
    TextArea,
    Popover,
    PopoverBody,
    PopoverTrigger
} from 'carbon';
import FieldType from '../base-components/_field';

let style = require('styles/modules/setup/object.scss');

export default class BuildChooseType extends Component {
    static propTypes = {
        schema: PropTypes.object,
        curSchema: PropTypes.object,
        onTypeChange: PropTypes.func
    };
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
    // checkbox数据改变时的处理函数
    handleCheckboxData(type, _val){
        // nullable为false时表示必填
        let val = _val;
        if (type === 'nullable'){
            val = !val;
        }
        if (val) {
            this.setState({
                data: {
                    ...this.state.data,
                    [type]: val
                }
            }, ( )=> {
                console.log('true', this.state);
            });
        } else {
            let data = this.state.data;
            delete data[type];
            this.setState({
                data
            }, () => {
                console.log('false', this.state);
            });
        }
    }
    // 选项的文本域设置
    // Todo
    handleOption(val){
        this.setState({
            data: {
                ...this.state.data,
                option: val
            }
        });
    }

    // 渲染字段类型
    renderFieldType(){
        let {schema, curSchema} = this.props;
        return (
            <div className="mcds-layout__item-12">
                <FieldType className="mcds-layout__item-6 mcds-m__b-20 mcds-p__r-15" schema={schema} curSchema={curSchema} onTypeChange={this.props.onTypeChange} />
                <div className="mcds-layout__item-12">
                    <span className={classnames('mcds-text__size-12', style['text-color'])}>
                        <span className={classnames('mcds-text__size-12', style['text-color'])}>
                            选项
                            <PopoverTrigger triggerBy="click" placement={'right'} overlay={<PopoverDemoThemeInfo />}>
                                <span className={classnames('mcds-icon mcds-filter__inline-block mcds-icon__info-solid-14 mcds-filter__logic-icon mcds-p__l-5', style['margin-top__2'])} />
                            </PopoverTrigger>
                        </span>
                        <TextArea className="mcds-m__t-5" onChange={::this.handleOption} />
                    </span>
                </div>
            </div>
        );
    }
    // 渲染多选按钮
    renderCheckbox(){
        let {opts} = this.props.curSchema;
        return (
            <div className={classnames('mcds-m__t-5 clearfix', style['create-choose__checkbox'])}>
                {
                    _.map(opts, (val, key) => {
                        return <Checkbox className={classnames(style['create-position__checkbox'])} key={key} label={val} onChange={this.handleCheckboxData.bind(this, key)} />;
                    })
                }
            </div>
        );
    }
    render(){
        return (
            <div className="mcds-layout__column mcds-p__t-20 mcds-p__l-40 mcds-p__r-40 mcds-p__b-40">
                {this.renderFieldType()}
                <div className="mcds-layout__item-12 mcds-m__t-20">
                    <span className={classnames('mcds-text__size-12', style['text-color'])}>默认值</span>
                    {this.renderCheckbox()}
                </div>
            </div>
        );
    }
}

// 字段基础属性 的 popover组件


let PopoverDemoThemeInfo = props => (
    <Popover theme="info" className={classnames(props.className)}>
        <PopoverBody>
            输入值，每个值单独排一行。
        </PopoverBody>
    </Popover>
);

PopoverDemoThemeInfo.propTypes = {
    className: PropTypes.string
};
