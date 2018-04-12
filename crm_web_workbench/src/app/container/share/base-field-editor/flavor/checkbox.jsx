import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
    Checkbox
} from 'carbon';

export default class BaseCheckBox extends Component {
    constructor(props) {
        super(props);
    }
    formatStringValue(value) {
        let val = value;
        if (typeof val !== 'string') {
            return value;
        }
        val = val.toLowerCase();
        if (val === 'true') {
            val = true;
        } else {
            val = false;
        }
        return val;
    }
    buildField() {
        let { onChange, value, error = false } = this.props;
        value = this.formatStringValue(value);
        return <Checkbox error={error} onChange={onChange} checked={Boolean(value)} />;
    }

    render() {
        return this.buildField();
    }
}
BaseCheckBox.propTypes = {
    onChange: PropTypes.func,
    value: PropTypes.any,
    error: PropTypes.bool
};

