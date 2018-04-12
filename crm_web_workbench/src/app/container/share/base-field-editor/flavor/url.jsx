import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { commonPtys } from '../util';
import {
    Input
} from 'carbon';

export default class BaseText extends Component {
    static propTypes = {
        ...commonPtys
    };

    constructor(props) {
        super(props);
    }

    buildField() {
        let { onChange, value, error = false, active } = this.props;
        return (
            <Input
                active={active}
                error={error}
                value={value}
                onChange={onChange}
                placeholder="http://xxx.xx" />
        );
    }

    render() {
        return this.buildField();
    }
}
BaseText.propTypes = {
    onChange: PropTypes.func,
    value: PropTypes.any,
    error: PropTypes.bool,
    active: PropTypes.bool
};


