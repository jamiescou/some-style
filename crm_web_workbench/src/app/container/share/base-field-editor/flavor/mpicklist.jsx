import React, { Component } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';

import {
    Cascader,
    Input
} from 'carbon';

import { buildDependenField } from '../util';


export default class BaseMpicklist extends Component {
    constructor(props) {
        super(props);
    }
    handleOnChange(param) {
        let { onChange } = this.props;
        onChange(param.join(';'));
    }
    // 用来校验input的值是否合法
    formatInputValue(options, value) {
        if (!value) {
            return [];
        }
        let valueList = value.split(';');
        for (let i = 0 ;i < valueList.length; i++) {
            if (options.indexOf(valueList[i]) === -1) {
                return '';
            }
        }
        return value;
    }
    buildDisable() {
        // let { schema } = this.props;
        return (
            <div className="mcds-element__container">
                <Input disabled={true} className="mcds-select__disabled" placeholder="请先选择依赖字段" value="" />
            </div>
        );
    }
    buildField() {
        let { schema, value, relatedValue, error = false, active } = this.props;

        let { options } = schema;

        let defaultValue = [];

        let data = [];

        options = buildDependenField(options, relatedValue);

        if (options && options.length === 0) {
            return this.buildDisable();
        }

        data = _.map(options, v => {
            return {name: v, value: v};
        });
        defaultValue = this.formatInputValue(options, value);

        return (
            <Cascader
                error={error}
                data={data}
                placement="right"
                defaultValue={defaultValue}
                onChange={::this.handleOnChange}
                type="multi" >
                <Input active={active} error={error} placeholder={`请选择${schema.display_name}`} value={defaultValue} />
            </Cascader>
        );
    }

    render() {
        return this.buildField();
    }
}

BaseMpicklist.propTypes = {
    schema: PropTypes.object,
    onChange: PropTypes.func,
    relatedValue: PropTypes.any,
    placeholder: PropTypes.string,
    value: PropTypes.any,
    error: PropTypes.bool,
    active: PropTypes.bool
};
