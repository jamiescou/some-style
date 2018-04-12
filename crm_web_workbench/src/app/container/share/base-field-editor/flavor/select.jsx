import React, { Component } from 'react';
import { commonPtys } from '../util';
import _ from 'lodash';
import { Select } from 'carbon';

import { buildDependenField } from '../util';

export default class BaseSelect extends Component {
    static propTypes = {
        ...commonPtys
    }

    constructor(props) {
        super(props);
    }

    buildField() {
        let { onChange, schema, value, relatedValue, error = false, active } = this.props;
        let { options } = schema;
        let disabled = false;
        options = buildDependenField(options, relatedValue);
        let selectOptions = _.map(options, v => <option error={error} value={v} key={v}>{v}</option> );
        if (selectOptions && selectOptions.length ===0) {
            disabled = true;
        }
        value = options.indexOf(value) === -1 ? undefined : value;
        return (
            <Select active={active} error={error} disabled={disabled} value={value} onChange={onChange}>
                <option value={-1} key={-1}>请选择</option>
                {selectOptions}
            </Select>
        );
    }

    render() {
        return this.buildField();
    }
}
