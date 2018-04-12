import React, { Component } from 'react';
import PropTypes from 'prop-types';

import style from 'styles/modules/setting/setting.scss';
import BaseEditor from 'container/share/base-field-editor';
import BaseField from 'container/standard-object/base-field';
import classnames from 'classnames';

const calculateAuthority = (schema) => {
    let authority = 0;
    const Readable = 4;
    const Writable = 2;
    let readable = schema.get('readable') || false;
    let writable = schema.get('writable') || false;
    if (readable) {
        authority += Readable;
    }

    if (writable) {
        authority += Writable;
    }

    return authority;
};
export default class SettingEditor extends Component {
    static propTypes = {
        type: PropTypes.string,
        value: PropTypes.string,
        status: PropTypes.oneOf(['edit', 'common']),
        schema: PropTypes.object
    };
    constructor(props) {
        super(props);
        this.state = {value: props.value};
        this.getValue = this.getValue.bind(this);
    }
    getValue() {
        return this.refs.editor.getValue();
    }
    // componentWillReceiveProps(nextProps) {
    //     let data = nextProps.data.toJS();
    //     if (!_.isEqual(this.props.data.toJS(), data)) {
    //         return true;
    //     }
    //     return true;
    // }

    //    componentWillMount() {
    //        this.props.fetchSchema('User');
    //    }
    renderReadOnlyItem() {
        let { schema, value, status} = this.props;
        let className = status === 'edit' ? ' no-border' : '';
        let context = new BaseField({
            schema: schema.toJS(),
            value: value
        }).render();
        return (
            <div className={`mcds-input__container ${style.input} ${className}`}>
                <label className="mcds-label">{schema.get('display_name')}</label>
                <div className={`mcds-bottom__line mcds-text__line-32 mcds-p__l-12 mcds-p__r-12 mcds-text__base ${style['input-group__body']}`}>
                    {context}
                </div>
            </div>
        );
    }
    renderEditItem() {
        let {schema, type, value} = this.props;
        let required = !schema.get('nullable');
        let label = schema.get('display_name');
        let requirdLabel = (name) => {
            return (
                <label className="mcds-label">
                    <span className={style.required}>*</span>
                    {name}
                </label>
            );
        };
        let labelDom = required ? requirdLabel(label) : <label className="mcds-label">{label}</label>;
        return (
            <div className={style.input} >
                {labelDom}
                <div className={classnames(style['input-group__body'], {[style['translateY-12']]: ['Manager', 'BirthDate', 'EntryDate'].indexOf(type) >= 0 })}>
                    <BaseEditor
                        ref="editor"
                        schema={schema}
                        value={value} />
                </div>
            </div>
        );
    }
    render() {
        let { schema, value, status } = this.props;
        let authority = calculateAuthority(schema);
        let EditItemComponent = '';
        // 无任何权限
        if (authority === 0) {
            // EditItemComponent =  React.DOM.noscript();;
            EditItemComponent = (schema.get('display_name') || schema.get('name')) + ':' + value;
        }

        // 可读
        if (authority === 4) {
            EditItemComponent = this.renderReadOnlyItem();
        }


        // 可读可写
        if (authority === 6) {
            EditItemComponent = status === 'common' ? this.renderReadOnlyItem() : this.renderEditItem();
        }


        return (
            <div className="edit-item">
                {EditItemComponent}
            </div>
        );
    }
}
