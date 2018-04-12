import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import {
    TextArea
} from 'carbon';

let style = require('styles/modules/base/base-editor.scss');

export default class BaseLongText extends Component {
    constructor(props) {
        super(props);
        this._onChange = this._onChange.bind(this);
    }

    _onChange(e) {
        let { onChange } = this.props;
        if (e.length <= 131072) {
            onChange(e);
        }
    }

    buildField() {
        let { placeholder, className, value, error = false, active } = this.props;
        if (!value) {
            value = '';
        }
        return (<TextArea
            active={active}
            error={error}
            placeholder={placeholder}
            onChange={::this._onChange}
            className={classnames(className, style['base-editor__textarea'])}
            value={value} />);
    }

    render() {
        return this.buildField();
    }
}

BaseLongText.propTypes = {
    onChange: PropTypes.func,
    placeholder: PropTypes.string,
    className: PropTypes.string,
    value: PropTypes.any,
    error: PropTypes.bool,
    active: PropTypes.bool
};

