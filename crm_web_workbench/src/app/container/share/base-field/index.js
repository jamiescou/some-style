import React, { Component } from 'react';
import { isImmutable } from 'immutable';
import Components from './flavor/index';

class BaseField {
    // let { value, schema, data, objName } = this.props;
    /**
     * 基本字段的渲染生成方法
     * @param {*} value 
     * @param {*} schema 
     * @param {*} data 
     * @param {*} objName 
     */
    constructor({value, schema, data, objName}) {
        this.schema = schema || {};
        this.value = value || '';
        this.data = data || {};
        this.objName = objName;
        this.formatValue();
        // 初始化渲染各种类型的字段
        this.render_types_field = this.renderField.bind(this);
    }

    // 格式化数据.统一使用对象处理
    formatValue() {
        let keys = ['schema', 'value', 'data'];
        keys.forEach(v => {
            if (isImmutable(this[v])) {
                this[v] = this[v].toJS();
            }
        });
    }
    buildSpecial(type) {
        let types = ['calculated', 'summary'];
        let result = null;
        if (types.indexOf(type) !== -1) {
            if (!this.value) {
                result = '';
            }
            let { related_type } = this.schema;
            if (related_type && Components[related_type] && typeof Components[related_type] === 'function') {
                result = this.renderField(related_type);
            }
            return result;
        }
    }

    buildField() {
        let { type, readable } = this.schema;
        if (!readable) {
            return null;
        }

        if (this[`extend_${type}`]) {
            return this[`extend_${type}`]({
                value: this.value,
                schema: this.schema,
                data: this.data,
                objName: this.objName
            });
        }

        let specila = this.buildSpecial(type);
        if (specila) {
            return specila;
        }

        return this.renderField(type);
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
        return this.buildField();
    }
}

export default BaseField;


