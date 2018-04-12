import React, { Component } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import {
    Select
} from 'carbon';
import LookupFilter from '../base-components/_lookupFilter';
import FieldType from '../base-components/_field';
import Cascade from '../base-components/_cascade';


export default class BuildLookup extends Component {
    static propTypes = {
        schema: PropTypes.object,
        curSchema: PropTypes.object,
        onTypeChange: PropTypes.func
    };
    constructor(){
        super();
        this.state = {
            object_name: ''
        };
        this.getValue = this.getValue.bind(this);
    }
    getValue(){
        // 这里查找关系的字段是object_name 待确定
        let object_name = {object_name: this.state.object_name};
        let lookup = this.refs.lookup.getValue();
        let cascade = this.refs.cascade.getValue();
        let mergeData = _.merge({}, object_name, lookup, cascade);
        return mergeData;
    }
    // 选择父对象
    handleObjectName(val){
        this.setState({
            object_name: val
        });
    }
    // 渲染字段类型
    renderFieldType(){
        let {schema, curSchema} = this.props;
        return (
            <div className="mcds-layout__item-12">
                <FieldType className="mcds-layout__item-6 mcds-p__r-15" schema={schema} curSchema={curSchema} onTypeChange={this.props.onTypeChange} />
                <Select label="选择查找对象" className="mcds-layout__item-6 mcds-p__l-15" value={this.state.object_name ? this.state.object_name : '请选择'} onChange={::this.handleObjectName}>
                    <option value="url1">URL1</option>
                    <option value="url2">URL2</option>
                    <option value="url3">URL3</option>
                </Select>
            </div>
        );
    }
    render(){
        return (
            <div>
                <div className="mcds-layout__column mcds-p__t-20 mcds-p__l-40 mcds-p__r-40 mcds-p__b-30">
                    {this.renderFieldType()}
                    <Cascade ref="cascade" />
                </div>
                <LookupFilter ref="lookup" />
            </div>
        );
    }
}
