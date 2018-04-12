import _ from 'lodash';
import I from 'immutable';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

import ShowBaseField from './show-base-field';

let operatorObject = {
    STARTSWITH: {
        value: 'STARTSWITH',
        display_name: '起始字符'
    }, // 起始字符
    CONTAINS: {
        value: 'CONTAINS',
        display_name: '包含'
    }, // 包含
    NOTCONTAINS: {
        value: 'NOTCONTAINS',
        display_name: '不包含'
    }, // 不包含
    INRANGE: {
        value: 'INRANGE',
        display_name: '等于(范围)'
    }, // 等于(范围)
    EQUALS: {
        value: '==',
        display_name: '等于'
    }, // 等于
    NOT_EQUAL: {
        value: '!=',
        display_name: '不等于'
    }, // 不等于
    LESS_THAN: {
        value: '<',
        display_name: '小于'
    }, // 小于
    GREATER_THAN: {
        value: '>',
        display_name: '大于'
    }, // 大于
    LESS_OR_EQUAL: {
        value: '<=',
        display_name: '小于等于'
    }, // 小于等于
    GREATER_OR_EQUAL: {
        value: '>=',
        display_name: '大于等于'
    } // 大于等于
};

export default class ConditionItem extends Component {
    constructor(){
        super();
    }

    // 展示面板运算符
    renderOperator(){
        let resultOperator = null;
        let {operator} = this.props;
        for (let key in operatorObject) {
            if (operatorObject[key].value === operator) {
                resultOperator = operatorObject[key].display_name;
            }
        }
        return <div className="mcds-m__t-5 mcds-m__b-5">{resultOperator}</div>;
    }
    // 展示面板字段的值
    renderFieldValue(){
        let {operands, schema, field, operator} = this.props;
        operands = I.isImmutable(operands) ? operands.toArray() : operands;
        return _.map(operands, (val, key) => {
            let newValue = val;
            if (_.isString(newValue)) {
                newValue = newValue.replace(/'/g, '');
            }
            return <ShowBaseField key={key} schema={schema.get(field).toJS()} value={newValue} operator={operator} />;
        });
    }

    render(){
        let { label, close, onClick } = this.props;
        return (
            <div className="mcds-filter__field" onClick={onClick}>
                <i className="mcds-icon__close-line-20 mcds-filter__icon-close mcds-text__size-13" onClick={close} />
                <div className="mcds-p__l-12 mcds-p__t-9 mcds-p__t-13">
                    <p className="mcds-text__weak mcds-text__size-12">{label}</p>
                    <div className="mcds-text__size-13">
                        {this.renderOperator()}
                        {this.renderFieldValue()}
                    </div>
                </div>
            </div>
        );
    }
}

ConditionItem.propTypes = {
    label: PropTypes.string,
    schema: PropTypes.object,
    field: PropTypes.string,
    operator: PropTypes.string,
    operands: PropTypes.any,
    close: PropTypes.func,
    onClick: PropTypes.func
};

