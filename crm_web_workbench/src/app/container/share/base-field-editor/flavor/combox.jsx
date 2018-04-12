import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

import { buildDependenField } from '../util';

import {
    ComboxSelect
} from 'carbon';

export default class BaseCombox extends Component {
    constructor(props) {
        super(props);
    }

    buildField() {
        let { placeholder, schema, onChange, value, relatedValue, error = false } = this.props;
        let { options = {} } = schema;
        let disabled = false;
        options = buildDependenField(options, relatedValue);

        let selectOptions = _.map(options, v => <option value={v} key={v}>{v}</option>);
        if (selectOptions && selectOptions.length === 0) {
            disabled = true;
            placeholder = '请先选择依赖字段';
        }
        return (
            <ComboxSelect error={error} disabled={disabled} placeholder={placeholder} value={value} onChange={onChange}>
                {selectOptions}
            </ComboxSelect>
        );
    }

    render() {
        return this.buildField();
    }
}

BaseCombox.propTypes = {
    schema: PropTypes.object,
    onChange: PropTypes.func,
    relatedValue: PropTypes.any,
    value: PropTypes.any,
    error: PropTypes.bool,
    placeholder: PropTypes.string
};

