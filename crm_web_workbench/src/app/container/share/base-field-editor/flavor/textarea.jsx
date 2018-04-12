import React, { Component } from 'react';
import classnames from 'classnames';
import { commonPtys } from '../util';
import { TextArea } from 'carbon';

let style = require('styles/modules/base/base-editor.scss');

export default class BaseTextArea extends Component {

    static propTypes = {
        ...commonPtys
    };

    constructor(props) {
        super(props);
        this._onChange = this._onChange.bind(this);
    }

    _onChange(e) {
        let { onChange } = this.props;
        if (e.length <= 255) {
            onChange(e);
        }
    }

    buildField() {
        let { placeholder, className, value, error = false } = this.props;
        if (!value) {
            value = '';
        }
        return (
            <TextArea
                error={error}
                placeholder={placeholder}
                onChange={this._onChange.bind(this)}
                className={classnames(className, style['base-editor__textarea'])}
                value={value} />
        );
    }

    render() {
        return this.buildField();
    }
}
