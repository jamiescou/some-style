import PropTypes from 'prop-types';
import React, { Component } from 'react';

import BuildChoose from './components/type-components/_chooseType';
import BuildMaster from './components/type-components/_masterType';
import BuildLookup from './components/type-components/_lookupType';
import BuildSummary from './components/type-components/_summaryType';
import BuildDefault from './components/type-components/_defaultType';
import BuildCheckbox from './components/type-components/_checkboxType';
import BuildHierarchy from './components/type-components/_hierarchyType';
import BuildCalculated from './components/type-components/_calculatedType';
import BuildAutonumber from './components/type-components/_autonumberType';

// 字段类型与字段属性对照表

export default class BuildObjectField extends Component {
    static propTypes = {
        schema: PropTypes.object,
        onTypeChange: PropTypes.func,
        curSchema: PropTypes.object
    };
    constructor(){
        super();
        this.state = {};
        this.getValue = this.getValue.bind(this);
    }

    getValue(){
        let { curSchema } = this.props;
        return this.refs[curSchema.type].getValue();
    }

    // 生成字段属性组件
    renderFieldProps(){
        let {schema, curSchema} = this.props;
        // schema curSchema 只负责渲染
        switch (curSchema.type){
        case 'url' :
        case 'address' :
        case 'datetime' :
        case 'currency' :
        case 'percent' :
        case 'phone' :
        case 'email' :
        case 'text' :
        case 'textarea' :
        case 'longtext' :
        case 'richtext' :
        case 'file' :
        case 'geolocation' :
        case 'integer' :
        case 'double' :
            return <BuildDefault ref={curSchema.type} schema={schema} onTypeChange={this.props.onTypeChange} curSchema={curSchema} />;
        case 'checkbox' :
            return <BuildCheckbox ref={curSchema.type} schema={schema} onTypeChange={this.props.onTypeChange} curSchema={curSchema} />;
        case 'master' :
            return <BuildMaster ref={curSchema.type} schema={schema} onTypeChange={this.props.onTypeChange} curSchema={curSchema} />;
        case 'lookup' :
            return <BuildLookup ref={curSchema.type} schema={schema} onTypeChange={this.props.onTypeChange} curSchema={curSchema} />;
        case 'hierarchy' :
            return <BuildHierarchy ref={curSchema.type} schema={schema} onTypeChange={this.props.onTypeChange} curSchema={curSchema} />;
        case 'summary' :
            return <BuildSummary ref={curSchema.type} schema={schema} onTypeChange={this.props.onTypeChange} curSchema={curSchema} />;
        case 'calculated' :
            return <BuildCalculated ref={curSchema.type} schema={schema} onTypeChange={this.props.onTypeChange} curSchema={curSchema} />;
        case 'autonumber' :
            return <BuildAutonumber ref={curSchema.type} schema={schema} onTypeChange={this.props.onTypeChange} curSchema={curSchema} />;
        case 'picklist' :
        case 'mpicklist' :
        case 'combox' :
            return <BuildChoose ref={curSchema.type} schema={schema} onTypeChange={this.props.onTypeChange} curSchema={curSchema} />;
        default :
            throw new Error(`No matches found the ${curSchema.type} about the object create field`);
        }
    }
    render() {
        return (
            <div>
                {this.renderFieldProps()}
            </div>
        );
    }
}
