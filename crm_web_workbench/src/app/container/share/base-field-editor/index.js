/**
 * 用来做编辑状态
 */

import { isImmutable } from 'immutable';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DependFields from './dependency-field';

import Editors from './flavor';

const AllType = [
    'address',
    'calculated',
    'checkbox',
    'combox',
    'currency',
    'date',
    'datetime',
    'double',
    'email',
    'external_id',
    'file',
    'hierarchy',
    'integer',
    'longtext',
    'lookup',
    'map',
    'master',
    'mpicklist',
    'object_id',
    'percent',
    'phone',
    'picklist',
    'richtext',
    'summary',
    'text',
    'time',
    'enterpriseinfo',
    'textarea',
    'url'
];

const DependTypes = ['picklist', 'combox', 'mpicklist'];

export default class BaseEditor extends Component {
    static propTypes = {
        // typeof ['immutable', 'object'],
        schema: PropTypes.object.isRequired,

        // 初始值
        value: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
            PropTypes.object
        ]),
        active: PropTypes.bool,

        // 依赖关联字段的value值,只有picklist/mpicklist几个字段使用
        relatedValue: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number
        ]),

        // error 状态
        error: PropTypes.bool,

        // handleOnchangle
        onChange: PropTypes.func,

        // 工商信息查询回填方法
        EnterpriseInfoBackReset: PropTypes.func,
        // 提示文本
        placeholder: PropTypes.string
    };
    constructor(props) {
        super(props);
        let { schema } = this.props;
        schema = this.transferValue(schema);

        let defaultValue = schema.default_value ? schema.default_value.value : null;

        this.state = {
            value: this.transferValue(props.value ? props.value : defaultValue)
        };
        this.allType = AllType;
        this.getValue = this.getValue.bind(this);
        this.setValue = this.setValue.bind(this);

        this.schema = this.transferValue(schema);

    }

    // todo 让我想想这块的更新 .应该怎么做
    componentWillReceiveProps() {
        // let { value } = nextProps;
        // let newValue = null;
        // if (_.isObject(value)) {

        // }
        // if (_.isString(value)) {
        //     if (_.trim(value)) {
        //         newValue = _.trim(value);
        //     }
        // }
        // if (newValue !== this.state.value) {
        //     this.setState({value: newValue})
        // }
    }
    getValue() {
        return this.state.value;
    }

    setValue(value) {
        this.setState({value});
    }

    transferValue(value) {
        let result;
        if (isImmutable(value)) {
            result = value.toJS();
        } else {
            result = value;
        }
        return result;
    }

    handleOnChange(value) {
        let { onChange } = this.props;
        this.setState({
            value
        }, onChange(value));
    }

    renderTypesField() {
        let { schema, relatedValue = '', error, active, placeholder, EnterpriseInfoBackReset } = this.props;
        let { value } = this.state;

        schema = this.transferValue(schema);
        value = this.transferValue(value);
        if (AllType.indexOf(schema.type) === -1) {
            // throw new ReferenceError(`the schema.type: ${schema.type} not in pre setting`);
            return <div />;
        }
        let options = {
            active,
            schema,
            type: schema.type,
            error: error,
            value: value || '',
            EnterpriseInfoBackReset,
            placeholder: placeholder || schema.display_name || schema.name,
            onChange: this.handleOnChange.bind(this)
        };
        if (DependTypes.indexOf(schema.type) !== -1) {
            options.relatedValue = relatedValue;
        }
        let C = Editors[schema.type];

        // 测试时用注释掉的这块代码，即当display_name==='客户名称'时，启用工商信息查询组件
        // 临时测试方案，后期以哪种方式来标识用这个组件，待确定后再改
        // if (schema.display_name === '客户名称') {
        //     console.log('这里是测试字段，用工商信息查询组件替换');
        //     C = Editors.enterpriseinfo;
        // }

        let extendFieldMethod = this[schema.type];

        if (extendFieldMethod && typeof extendFieldMethod === 'function') {
            return extendFieldMethod.call(this, options);
        }

        // 如果没有预设值对应的方法,以text方法处理
        if (!C) {
            C = Editors.text;
        }

        return <C {...options} />;

    }

    render() {
        return this.renderTypesField();
    }
}

BaseEditor.defaultProps = {
    onChange: () => {}
};



export const BuildFieldDependency = DependFields;


