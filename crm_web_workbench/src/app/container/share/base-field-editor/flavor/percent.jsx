import _ from 'lodash';
import math from 'mathjs';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

import {
    FixedInput
} from 'carbon';

export default class BaseText extends Component {
    constructor(props) {
        super(props);
    }
    handleOnChange(param) {
        let { onChange } = this.props;
        let value = param;
        if (param && param.target) {
            value = param.target.value;
        }
        value = _.toNumber(value) ? math.eval(value / 100) : 0;
        onChange(value);
    }
    buildField() {
        let { schema, value, error = false } = this.props;
        if (_.isNumber(value)) {
            value = math.round(value * 100, 2);
        } else {
            value = 0;
        }
        return (
            <FixedInput
                error={error}
                placeholder={`请输入${schema.display_name}`}
                value={value}
                onChange={::this.handleOnChange}
                right="%" />
        );
    }
    render() {
        return this.buildField();
    }
}

BaseText.propTypes = {
    schema: PropTypes.object,
    onChange: PropTypes.func,
    value: PropTypes.any,
    error: PropTypes.bool
};
