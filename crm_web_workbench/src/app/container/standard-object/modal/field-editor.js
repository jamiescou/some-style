import PropTypes from 'prop-types';
import React, { Component } from 'react';

import BaseEditor from '../../share/base-field-editor';
import style from 'styles/modules/standard-object/require-style.scss';

export default class FieldEditor extends Component {
    static propTypes = {
        schema: PropTypes.object.isRequired,
        className: PropTypes.string,
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
        errorMsg: PropTypes.string,
        Editor: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);
        this.getValue = this.getValue.bind(this);
    }

    getValue() {
        return this.refs.editor.getValue();
    }

    render(){
        let { schema, value, errorMsg, Editor } = this.props;
        Editor = Editor ? Editor : BaseEditor;
        let resuired = schema.get('nullable') ? null : <span className="mcds-span__required">*</span>;
        let requiredStyle = <span className={`mcds-span__required ${style.requir}`}>{errorMsg}</span>;
        return (
            <div className="mcds-input__container">
                <label className="mcds-label">{resuired}{schema.get('display_name')}</label>
                <Editor
                    ref="editor"
                    error={errorMsg !== ''}
                    className=""
                    schema={schema}
                    value={value} />
                {requiredStyle}
            </div>
        );
    }
}
