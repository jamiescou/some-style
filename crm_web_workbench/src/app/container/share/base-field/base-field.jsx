/**
 * 用来做展示
 */

import _ from 'lodash';
import { isImmutable } from 'immutable';
import React, { Component } from 'react';
import PropTypes from 'prop-types';


import Components from './flavor/index';

const isAvailable = param => {
    let isUnavailable =  _.isNull(param) || _.isUndefined(param);
    return !isUnavailable;
};

export default class BaseContext extends Component {
    constructor() {
        super();
    }

    formatValue() {
        let keys = ['schema', 'value', 'data', 'objName'];
        let props = this.props;
        keys.forEach(v => {
            if (isImmutable(props[v])) {
                this[v] = props[v].toJS();
            } else if (isAvailable(props[v])) {
                this[v] = props[v];
            }
        });
    }
    buildField(value, schema, data, objName) {
        this.formatValue();
        let types = ['calculated', 'summary'];
        let { type, readable } = this.schema;
        let result = null;
        if (!readable) {
            return result;
        }
        if (this[`extend_${type}`]) {
            return this[`extend_${type}`](
                value,
                schema,
                data,
                objName
            );
        }

        if (types.indexOf(type) !== -1) {
            let { related_type } = this.schema;
            if (related_type && Components[related_type] && typeof Components[related_type] === 'function') {
                result = this.renderField(related_type);
            }
        } else {
            result = this.renderField(type);
        }
        return result;
    }

    renderField(type) {
        let C = Components[type];
        if (!C) {
            return this.value;
        }

        let ComponentType = Object.getPrototypeOf(C);

        // react 有状态组件 元素
        if (ComponentType === Component) {
            return <C value={this.value} schema={this.schema} data={this.data} objName={this.objName} />;
        }
        return C(this.value, this.schema, this.data, this.objName);
    }

    render() {
        let { value, schema, data, objName } = this.props;
        return <span className="base-field__wrap">{this.buildField(value, schema, data, objName)}</span>;
    }
}

BaseContext.propTypes = {
    value: PropTypes.any, // 字段值
    schema: PropTypes.object.isRequired, // 字段schema描述
    objName: objNamePropCheck, // 对象的name 当schema.type=file的时候必传
    data: dataPropCheck // 对象的record 当schema.type=file的时候必传
};

function dataPropCheck(props, propName, componentName) {
    let error = false;
    let specialTypes = ['file'];
    let needFields = ['id', 'version', 'name'];
    let schema = isImmutable(props.schema) ? props.schema.toJS() : props.schema;
    let data = isImmutable(props.data) ? props.data.toJS() : props.data;
    if (!schema || !schema.type) {
        error = true;
    }
    if (!error && specialTypes.indexOf(schema.type) !== -1) {
        if (!data) {
            error = true;
        }
        if (!error && data) {
            needFields.forEach(v => {
                if (!data.hasOwnProperty(v)) {
                    error = true;
                }
            });
        }
    }
    if (error) {
        return new Error(
            `Invalid prop ${propName} supplied to ${componentName} Validation failed, must hav ${needFields}`
        );
    }
}

function objNamePropCheck(props, propName, componentName) {
    let error = false;
    let specialTypes = ['file'];
    let objName = props.objName;
    // let needFields = ['id', 'version', 'name'];
    let schema = isImmutable(props.schema) ? props.schema.toJS() : props.schema;
    if (!objName && specialTypes.indexOf(schema.type) !== -1) {
        error = true;
    }

    if (error) {
        return new Error(
            `Invalid prop ${propName} supplied to ${componentName} Validation failed, 
            if schema.type in list [${specialTypes}] the props must have objName`
        );
    }
}
