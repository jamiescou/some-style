import React, { Component } from 'react';
import PropTypes from 'prop-types';

import _ from 'lodash';

import LookupFilter from '../base-components/_lookupFilter';
import Cascade from '../base-components/_cascade';
import FieldType from '../base-components/_field';


export default class BuildHierarchy extends Component {
    static propTypes = {
        schema: PropTypes.object,
        curSchema: PropTypes.object,
        onTypeChange: PropTypes.func
    };
    constructor(){
        super();
        this.state = {
        };
        this.getValue = this.getValue.bind(this);
    }
    getValue(){
        let hierarchy = this.refs.hierarchy.getValue();
        let cascade = this.refs.cascade.getValue();
        let mergeData = _.merge({}, hierarchy, cascade);
        return mergeData;
    }
    // 渲染字段类型
    renderFieldType(){
        let {schema, curSchema} = this.props;
        return (
            <div className="mcds-layout__item-12">
                <FieldType className="mcds-layout__item-6 mcds-p__r-15" schema={schema} curSchema={curSchema} onTypeChange={this.props.onTypeChange} />
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
                <LookupFilter ref="hierarchy" />
            </div>
        );
    }
}
