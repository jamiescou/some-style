import React, { Component } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import _ from 'lodash';
import {
    Select,
    Radio,
    Popover,
    PopoverBody,
    PopoverTrigger
} from 'carbon';
import FieldType from '../base-components/_field';
import CheckboxComponent from '../base-components/_checkbox';
import LookupFilter from '../base-components/_lookupFilter';
let style = require('styles/modules/setup/object.scss');
export default class BuildMaster extends Component {
    static propTypes = {
        schema: PropTypes.object,
        curSchema: PropTypes.object,
        onTypeChange: PropTypes.func
    };
    constructor(){
        super();
        this.state = {
            shareSetting: 'readable',
            object_name: ''
        };
        this.getValue = this.getValue.bind(this);
    }
    getValue(){
        let shareSetting = {
            [this.state.shareSetting]: true
        };
        let lookupData = this.refs.master.getValue();
        let index = this.refs.getIndex.getValue();
        let object_name = {object_name: this.state.object_name};
        let mergeData = _.merge({}, lookupData, index, object_name, shareSetting);
        return mergeData;
    }

    // 共享设置
    // 目前不缺定可读可写的字段用什么表示 暂用readable writeable表示
    handleShareSetting(type){
        this.setState({
            shareSetting: type
        });
    }
    // 选择父对象
    handleObjectName(val){
        this.setState({
            object_name: val
        });
    }

    // 共享设置
    renderShareSetting(){
        return (
            <div className="mcds-layout__item-12 mcds-m__t-20">
                <span className={classnames('mcds-text__size-12', style['text-color'])}>
                    共享设置
                    <PopoverTrigger triggerBy="click" placement={'right'} overlay={<PopoverDemoThemeInfo value="用户若要为主记录创建子记录，至少需要的权限。" />}>
                        <span className={classnames('mcds-icon mcds-filter__inline-block mcds-icon__info-solid-14 mcds-filter__logic-icon mcds-p__l-5', style['margin-top__2'])} />
                    </PopoverTrigger>
                </span>
                <div className={classnames('clearfix mcds-m__t-5', style['create-share__setting'])}>
                    <div className="clearfix">
                        <Radio checked={this.state.shareSetting === 'readable'} className="pull-left mcds-m__r-27" label="只读" name="readWrite" onChange={this.handleShareSetting.bind(this, 'readable')} />
                        <Radio checked={this.state.shareSetting === 'writeable'} className="pull-left" label="读/写" name="readWrite" onChange={this.handleShareSetting.bind(this, 'writeable')} />
                    </div>
                    <CheckboxComponent className="mcds-m__t-20" ref="getIndex" type="index" />
                </div>
            </div>
        );
    }

    render(){
        let {schema, curSchema} = this.props;
        return (
            <div>
                <div className="mcds-layout__column mcds-p__t-20 mcds-p__l-40 mcds-p__r-40 mcds-p__b-30">
                    <div className="mcds-layout__item-12">
                        <FieldType className="mcds-layout__item-6 mcds-p__r-15" schema={schema} curSchema={curSchema} onTypeChange={this.props.onTypeChange} />

                        <Select value={this.state.object_name ? this.state.object_name : '请选择'} onChange={::this.handleObjectName} className="mcds-layout__item-6 mcds-p__l-15" label="选择父对象">
                            <option value="url1">URL1</option>
                            <option value="url2">URL2</option>
                            <option value="url3">URL3</option>
                        </Select>
                    </div>
                    {this.renderShareSetting()}
                </div>
                <LookupFilter ref="master" />
            </div>
        );
    }
}

let PopoverDemoThemeInfo = props =>
    (<Popover theme="info" className={classnames(props.className)}>
        <PopoverBody>
            {props.value}
        </PopoverBody>
    </Popover>);
PopoverDemoThemeInfo.propTypes = {
    className: PropTypes.string,
    value: PropTypes.string
};


