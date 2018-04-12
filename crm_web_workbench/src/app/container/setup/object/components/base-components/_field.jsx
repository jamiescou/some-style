import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

import { Select } from 'carbon';
export default class FieldType extends Component {
    constructor(){
        super();
    }
    handleFieldType(value){
        this.props.onTypeChange(value);
    }
    render(){
        let {className, schema, curSchema} = this.props;
        return (
            <div className={className}>
                <Select label="字段类型" value={curSchema ? curSchema.display_name : null } onChange={this.handleFieldType.bind(this)}>
                    {
                        _.map(schema, (val, key) => {
                            return <option key={key} value={val}>{val.display_name}</option>;
                        })
                    }
                </Select>
            </div>
        );
    }
}

FieldType.propTypes = {
    className: PropTypes.string,
    schema: PropTypes.object,
    curSchema: PropTypes.object,
    onTypeChange: PropTypes.func
};

