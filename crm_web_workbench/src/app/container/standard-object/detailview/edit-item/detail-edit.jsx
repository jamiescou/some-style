import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import DetailField from '../base-field';
import BuildEditors from 'container/share/base-field-editor';


import style from 'styles/modules/standard-object/index.scss';
/**
 * 计算权限值
 * @param  {[type]} schema [description]
 * @return {[type]}        [4 可读 2 可写 0 不可读不可编辑 相加]
 */
const calculateAuthority = (schema) => {
    let authority = 0;
    const Readable = 4;
    const Writable = 2;
    let readable = schema.readable || false;
    let writable = schema.writable || false;
    if (readable) {
        authority += Readable;
    }

    if (writable) {
        authority += Writable;
    }

    return authority;
};


export default class EditItem extends Component {
    static propTypes = {
        // status "edit" || "common"
        status: PropTypes.string,
        value: PropTypes.any,
        className: PropTypes.string,
        schema: PropTypes.object,
        onEditClick: PropTypes.func,
        checkPermission: PropTypes.bool,
        objName: PropTypes.string,
        data: PropTypes.object,
        onChange: PropTypes.func,
        error: PropTypes.bool,
        active: PropTypes.bool,
        relatedValue: PropTypes.string
    };

    constructor(props){
        super(props);

        this.getValue = this.getValue.bind(this);
    }

    getValue() {
        return this.refs.editItem.getValue();
    }

    renderReadOnlyItem() {
        let { schema, value, status, objName, data} = this.props;
        let className = status === 'edit' ? ' no-border' : '';
        let context;
        context = new DetailField({
            schema,
            value,
            objName,
            data,
            needDetailPopover: true
        }).render();

        return (
            <div className={`mcds-input__container ${className}`}>
                <label className="mcds-label">{schema.display_name}</label>
                <div className="mcds-bottom__line mcds-text__line-33 mcds-p__l-12 mcds-text__base">
                    {context}
                </div>
            </div>
        );
    }

    _renderEditAndReadItemTypes() {
        let { schema, value, onChange, relatedValue, error, active} = this.props;
        let others = {};
        if (relatedValue) {
            others.relatedValue = relatedValue;
        }
        // (schema.get('type') === 'percent') && (value *= 100);
        let resuired = schema.nullable ? null : <span className="mcds-span__required">*</span>;
        return (
            <div className="mcds-input__container">
                {resuired}
                <label className="mcds-label">{schema.display_name}</label>
                <div className="mcds-text__line-33">
                    <BuildEditors
                        active={active} error={error} ref="editItem" schema={schema} value={value}
                        {...others} onChange={onChange} />
                </div>
            </div>
        );
    }

    renderEditAndReadItem() {
        let { status = 'common', onEditClick, checkPermission } = this.props;
        let editOrShowArea = status === 'common' ? this.renderReadOnlyItem() : this._renderEditAndReadItemTypes();
        return (
            <div>
                { editOrShowArea }
                <div onClick={onEditClick} className={classnames(`mcds-icon__container mcds-icon__container-noborder mcds-cursor__pointer ${style['edit-item__right-icon']}`, {hide: status === 'edit'})}>
                    {checkPermission ? <span className="mcds-icon__edit-line-20 mcds-icon__hover mcds-icon__size-20" /> : null }
                </div>
            </div>
        );
    }


    render() {
        let { schema, value } = this.props;
        let authority = calculateAuthority(schema);
        let className = this.props.className ? this.props.className : '';
        let EditItemComponent = '';
        className += ' ' + style['edit-item'];

        // 无任何权限
        if (authority === 0) {
            // EditItemComponent =  React.DOM.noscript();;
            EditItemComponent = (schema.display_name || schema.name) + ':' + value;
        }

        // 可读
        if (authority === 4) {
            EditItemComponent = this.renderReadOnlyItem();
        }


        // 可读可写
        if (authority === 6) {
            EditItemComponent = this.renderEditAndReadItem();
        }


        return (
            <div className={className}>
                {EditItemComponent}
            </div>
        );
    }
}
