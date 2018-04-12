import React, { Component } from 'react';
import PropTypes from 'prop-types';

import classnames from 'classnames';
import _ from 'lodash';
import {
    Checkbox,
    Input
} from 'carbon';
import Editor from '../base-components/_editor';
import FieldType from '../base-components/_field';
let style = require('styles/modules/setup/object.scss');
export default class BuildDefault extends Component {
    static propTypes = {
        schema: PropTypes.object,
        curSchema: PropTypes.object,
        onTypeChange: PropTypes.func
    };
    constructor(){
        super();
        this.state = {
            editor: false,
            data: {}
        };
        this.getValue = this.getValue.bind(this);
    }
    /* componentWillMount(){
        console.log('componentWillMount', this.props);
    }
    componentWillUpdate(){
        console.log('componentWillUpdate', this.props, 'state', this.state);
    }
    componentWillReceiveProps(nextProps){
        console.log('componentWillReceiveProps', nextProps);
    }*/
    getValue(){
        return this.state.data;
    }
    // editor: 公式编辑器开关
    handleEditor(){
        this.setState({
            editor: !this.state.editor
        });
    }
    // checkbox数据改变时的处理函数
    handleCheckboxData(type, _val){
        // nullable为false时表示必填
        let val = _val;
        if (type === 'nullable') {
            val = !val;
        }
        if (val) {
            this.setState({
                data: {
                    ...this.state.data,
                    [type]: val
                }
            });
        } else {
            let data = this.state.data;
            delete data[type];
            this.setState({
                data
            });
        }
    }

    // 渲染字段信息
    renderFieldInfo(){
        let { opts } = this.props.curSchema;
        return (
            <div className={classnames('mcds-layout__item-12 mcds-m__t-20 clearfix', style['create-checkbox'])}>
                {
                    _.map(opts, (val, key) => {
                        return <Checkbox key={key} label={val} onChange={this.handleCheckboxData.bind(this, key)} />;
                    })
                }
            </div>
        );
    }
    // 渲染公式编辑器
    renderFormulaEditor(){
        if (!this.state.editor) {
            return (
                <div className="mcds-layout__item-6 mcds-p__t-20">
                    <div className="clearfix mcds-m__b-5">
                        <span className="pull-left">默认值</span>
                        <span className="pull-right mcds-text__link mcds-cursor__pointer" onClick={::this.handleEditor}>打开公式编辑器</span>
                    </div>
                    <Input value="不拉不拉" />
                </div>
            );
        }
        return (
            <div className="mcds-layout__item-12 mcds-p__t-20">
                <div className="clearfix mcds-m__b-5">
                    <span className="pull-left">默认值</span>
                    <span className="pull-right mcds-text__link mcds-cursor__pointer" onClick={::this.handleEditor}>关闭公式编辑器</span>
                </div>
                <Editor type="default" />
            </div>
        );
    }

    render(){
        let {schema, curSchema} = this.props;
        return (
            <div className="mcds-layout__column mcds-p__t-20 mcds-p__l-40 mcds-p__r-40 mcds-p__b-40">
                <FieldType className="mcds-layout__item-6" schema={schema} curSchema={curSchema} onTypeChange={this.props.onTypeChange} />
                {this.renderFieldInfo()}
                {this.renderFormulaEditor()}
            </div>
        );
    }
}
