import classnames from 'classnames';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

import {
    Checkbox
} from 'carbon';

let style = require('styles/modules/setup/object.scss');
// 渲染的映射信息
let mapInfo = {
    nullable: '是否必填',
    searchable: '字段值可被搜索',
    index: '为字段添加索引',
    unique: '字段值唯一',
    default_value: '将第一个选项做为默认值'
};

export default class CheckboxComponent extends Component {
    static propTypes = {
        type: PropTypes.string,
        className: PropTypes.string
    }
    constructor(props){
        super(props);
        this.state = {
            [this.props.type]: false
        };
        this.getValue = this.getValue.bind(this);
    }
    getValue(){
        let state = this.state;
        // 清除为false的字段
        if (state[this.props.type]){
            return this.state;
        }
        return {};
    }
    // checkbox数据改变时的处理函数
    handleCheckboxData(val){
        let newVal = val;
        if (this.props.type === 'nullable') {
            newVal = !newVal;
        }
        this.setState({
            [this.props.type]: newVal
        });
    }
    render(){
        let { className, type } = this.props;
        return <Checkbox checked={this.state[type]} className={classnames(className, style['create-position__checkbox'])} label={mapInfo[type]} onChange={this.handleCheckboxData.bind(this)} />;
    }
}
