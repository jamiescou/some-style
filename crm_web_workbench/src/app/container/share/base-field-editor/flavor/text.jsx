import React, { Component } from 'react';
import { commonPtys } from '../util';
import {
    Input
} from 'carbon';

export default class BaseText extends Component {
    static propTypes = {
        ...commonPtys
    }
    constructor(props) {
        super(props);
    }

    buildField() {
        let { placeholder, onChange, value, active, error = false } = this.props;
        if (!value) {
            value = '';
        }
        return (
            <Input
                error={error}
                value={value}
                active={active}
                onChange={onChange}
                placeholder={placeholder} />
        );
    }

    render() {
        return this.buildField();
    }
}
