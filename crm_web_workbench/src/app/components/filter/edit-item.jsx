import _ from 'lodash';
import I from 'immutable';
import classnames from 'classnames';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import BaseEditor from 'container/share/base-field-editor';
import { formatValueBySchema } from 'utils/format-value';

import { Select } from 'carbon';
// 暂时先这么处理
const ADDRESS_DATA = ['北京市', '天津市', '河北省', '山西省', '内蒙古自治区', '辽宁省', '吉林省', '黑龙江省', '上海市', '江苏省', '浙江省', '安徽省', '福建省', '江西省', '山东省', '广东省', '广西壮族自治区', '海南省', '河南省', '湖北省', '湖南省', '重庆市', '四川省', '贵州省', '云南省', '西藏自治区', '陕西省', '甘肃省', '青海省', '宁夏回族自治区', '新疆维吾尔族自治区', '香港特别行政区', '澳门特别行政区', '台湾省'];
// 文本 字符串 电话号码
let type_text = {
    STARTSWITH: {
        value: 'STARTSWITH',
        display_name: '起始字符'
    }, // 起始字符
    CONTAINS: {
        value: 'CONTAINS',
        display_name: '包含'
    }, // 包含
    NOTCONTAINS: {
        value: 'NOTCONTAINS',
        display_name: '不包含'
    }, // 不包含
    EQUALS: {
        value: '==',
        display_name: '等于'
    }, // 等于
    NOT_EQUAL: {
        value: '!=',
        display_name: '不等于'
    }// 不等于
};
// 数字类型
let type_num = {
    EQUALS: {
        value: '==',
        display_name: '等于'
    }, // 等于
    NOT_EQUAL: {
        value: '!=',
        display_name: '不等于'
    }, // 不等于
    LESS_THAN: {
        value: '<',
        display_name: '小于'
    }, // 小于
    GREATER_THAN: {
        value: '>',
        display_name: '大于'
    }, // 大于
    LESS_OR_EQUAL: {
        value: '<=',
        display_name: '小于等于'
    }, // 小于等于
    GREATER_OR_EQUAL: {
        value: '>=',
        display_name: '大于等于'
    } // 大于等于
};
// 单选类型 外键类型 复选框
let type_key = {
    EQUALS: {
        value: '==',
        display_name: '等于'
    }, // 等于
    NOT_EQUAL: {
        value: '!=',
        display_name: '不等于'
    } // 不等于
};
// 日期时间类型
let type_time = {
    INRANGE: {
        value: 'INRANGE',
        display_name: '等于(范围)'
    }, // 等于(范围)
    EQUALS: {
        value: '==',
        display_name: '等于'
    }, // 等于
    NOT_EQUAL: {
        value: '!=',
        display_name: '不等于'
    }, // 不等于
    LESS_THAN: {
        value: '<',
        display_name: '小于'
    }, // 小于
    GREATER_THAN: {
        value: '>',
        display_name: '大于'
    }, // 大于
    LESS_OR_EQUAL: {
        value: '<=',
        display_name: '小于等于'
    }, // 小于等于
    GREATER_OR_EQUAL: {
        value: '>=',
        display_name: '大于等于'
    } // 大于等于
};
let operatorObject = type_text;

// 所有类型
/*  let operatorObject = {
    STARTSWITH: {
        value: 'STARTSWITH',
        display_name: '起始字符'
    }, // 起始字符
    CONTAINS: {
        value: 'CONTAINS',
        display_name: '包含'
    }, // 包含
    NOTCONTAINS: {
        value: 'NOTCONTAINS',
        display_name: '不包含'
    }, // 不包含
    INRANGE: {
        value: 'INRANGE',
        display_name: '等于(范围)'
    }, // 等于(范围)
    EQUALS: {
        value: '==',
        display_name: '等于'
    }, // 等于
    NOT_EQUAL: {
        value: '!=',
        display_name: '不等于'
    }, // 不等于
    LESS_THAN: {
        value: '<',
        display_name: '小于'
    }, // 小于
    GREATER_THAN: {
        value: '>',
        display_name: '大于'
    }, // 大于
    LESS_OR_EQUAL: {
        value: '<=',
        display_name: '小于等于'
    }, // 小于等于
    GREATER_OR_EQUAL: {
        value: '>=',
        display_name: '大于等于'
    } // 大于等于
};
*/

export default class EditConditionItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            expressions: props.expressions
        };
    }
    componentWillMount(){
        let expressions = this.state.expressions;
        let { schema, index } = this.props;
        let field = expressions.getIn([index, 'field']);
        let fieldType = schema.getIn([field, 'type']);
        if (fieldType === 'address') {
            expressions = expressions.setIn([index, 'type'], 'address');
            this.setState({
                expressions
            });
        }
    }
    componentDidMount() {
        this.mounted = true;
    }

    componentWillUnmount() {
        this.mounted = false;
    }
    buildOptions() {
        let {schema, index} = this.props;
        let curSchema = this.state.expressions.getIn([index, 'field']);
        schema.map((val) => {
            if (val.get('name') === curSchema){
                switch (val.get('type')) {
                case 'text' :
                case 'textarea' :
                case 'longtext' :
                case 'richtext' :
                case 'email' :
                case 'phone' :
                case 'url' :
                case 'address' :
                case 'file' :
                case 'autonumber':
                    // 文本类
                    operatorObject = type_text;
                    break;
                case 'integer' :
                case 'double' :
                case 'summary' :
                case 'currency' :
                case 'calculated' :
                case 'percent' :
                    // 数字类
                    operatorObject = type_num;
                    break;
                case 'picklist' :
                case 'mpicklist' :
                case 'combox' :
                case 'checkbox' :
                case 'object_id' :
                case 'lookup' :
                case 'master' :
                case 'hierarchy' :
                case 'external_id' :
                    // 单选多选 外键
                    operatorObject = type_key;
                    break;
                case 'datetime' :
                    // 日期时间
                    operatorObject = type_time;
                    break;
                default :
                    operatorObject = type_text;
                }
            }
        });
        let opts = [];
        _.map(operatorObject, v => {
            opts.push(<option key={v.value} value={v.value}>{v.display_name}</option>);
        });
        return opts;
    }
    // 筛选字段
    changeState(val, index) {
        let expressions = this.state.expressions;
        if (val.name === expressions.getIn([index, 'field'])) { return; }
        expressions = expressions.setIn([index, 'field'], val.name);
        expressions = expressions.setIn([index, 'type'], val.type);
        expressions = expressions.setIn([index, 'operator'], '');
        expressions = expressions.setIn([index, 'display_name'], this.props.schema.getIn([val.name, 'display_name']) || this.props.schema.getIn([val.name, 'name']));
        expressions = expressions.setIn([index, 'operands'], ['']);
        if (this.mounted) {
            this.setState({
                expressions: expressions
            }, () => {
                this.props.onChange(I.fromJS({
                    expressions: expressions
                }));
                this.props.onChangeHeader();
                if (this.props.onPositionHeader) {
                    this.props.onPositionHeader('saveFilter');
                }
            });
        }
    }
    // 运算符
    changeOperator(val, index) {
        let expressions = this.state.expressions;
        if (val === expressions.getIn([index, 'operator'])) { return; }
        if (operatorObject[val]) {
            expressions = expressions.setIn([index, 'operator'], operatorObject[val].value);
        } else {
            for (let key in operatorObject) {
                if (operatorObject[key].value === val) {
                    expressions = expressions.setIn([index, 'operator'], operatorObject[key].value);
                }
            }
        }
        let operator = expressions.getIn([index, 'operator']);
        let operands = expressions.getIn([index, 'operands']);
        operands = operands.toArray ? operands.toArray()[0] : operands[0];
        if (operator === 'INRANGE') {
            expressions = expressions.setIn([index, 'operands'], [operands, '']);
        } else {
            expressions = expressions.setIn([index, 'operands'], [operands]);
        }
        this.setState({
            expressions: expressions
        }, () => {
            this.props.onChange(I.fromJS({
                expressions: expressions
            }));
            this.props.onChangeHeader();
            if (this.props.onPositionHeader) {
                this.props.onPositionHeader('saveFilter');
            }
        });
    }
    // 字段的值
    changeOperatorName(index, timeIndex, val){
        let { schema } = this.props;
        let expressions = this.state.expressions;
        let operandsArr = expressions.getIn([index, 'operands']);
        let curSchema = expressions.getIn([index, 'field']);
        let operatorName = expressions.getIn([index, 'operator']);
        if (operatorName === 'INRANGE'){
            operandsArr[timeIndex] = formatValueBySchema(val, schema.get(curSchema));
            expressions = expressions.setIn([index, 'operands'], operandsArr);
        } else {
            operandsArr = [];
            schema.map( v => {
                if (v.get('name') === curSchema){
                    switch (v.get('type')) {
                    case 'text' :
                    case 'textarea' :
                    case 'email' :
                    case 'phone' :
                    case 'url' :
                    case 'picklist' :
                    case 'checkbox' :
                    case 'object_id' :
                    case 'longtext' :
                    case 'richtext' :
                    case 'mpicklist' :
                    case 'combox' :
                    case 'autonumber' :
                    case 'lookup' :
                    case 'external_id' :
                    case 'master' :
                    case 'hierarchy' :
                        // 目前这些加单引号
                        operandsArr[0] = "'" + formatValueBySchema(val, v) + "'";
                        break;
                    case 'address':
                        // 目前这些加单引号
                        operandsArr[0] = "'" + val + "'";
                        break;
                    case 'datetime' :
                        operandsArr[0] = formatValueBySchema(val, v);
                        break;
                    default :
                        operandsArr[0] = formatValueBySchema(val, v);
                    }
                }
            });
            expressions = expressions.setIn([index, 'operands'], operandsArr);
        }
        this.setState({
            expressions: expressions
        }, () => {
            this.props.onChangeHeader();
            if (this.props.onPositionHeader) {
                this.props.onPositionHeader('saveFilter');
            }
            this.props.onChange(I.fromJS({expressions: expressions}));
        });
    }

    operatorValue(val) {
        let result = null;
        for (let key in operatorObject) {
            if (operatorObject[key].value === val) {
                result = operatorObject[key].display_name;
            }
        }
        return result;
    }
    // 渲染字段的值
    renderOperatorName(){
        let {index, schema} = this.props;
        let expressions = this.state.expressions;
        let operands =  expressions.getIn([index, 'operands']);
        let field = expressions.getIn([index, 'field']);
        let operator = expressions.getIn([index, 'operator']);
        let fieldType = schema.getIn([field, 'type']);
        operands = operands.toArray ? operands.toArray() : operands;
        return _.map(operands, (val, key) => {
            let newValue = val;
            if (_.isString(newValue)) {
                newValue = newValue.replace(/'/g, '');
            }
            if (fieldType === 'address') {
                // 对地址的特殊处理
                return (
                    <Select
                        className="mcds-m__b-10"
                        key={field + operator}
                        value={newValue || '请选择'}
                        onChange={this.changeOperatorName.bind(this, index, null)} >
                        {
                            ADDRESS_DATA.map((v, k) => {
                                return <option key={k} value={v}>{v}</option>;
                            })
                        }
                    </Select>
                );
            }
            return (<div className={classnames('mcds-text__line-33', {'mcds-m__t-5': key === 1})} key={field + operator + key}>
                <BaseEditor
                    onChange={this.changeOperatorName.bind(this, index, key)}
                    schema={schema.get(this.state.expressions.getIn([index, 'field']))}
                    value={newValue} />
            </div>);
        });
    }
    render() {
        let {index, schema, close} = this.props;
        let fieldOptions = [];
        schema.toArray().map((v) => {
            if (['currency'].indexOf(v.get('type')) !== -1){
                return null;
            }
            fieldOptions.push(
                <option key={v.get('name')} value={{name: v.get('name'), type: v.get('type')}}>
                    {v.get('display_name') || v.get('name')}
                </option>
            );
        });
        return (
            <div className="mcds-filter__field" ref={ (node) => { this.node = node; } }>
                <i className="mcds-icon__close-line-20 mcds-filter__icon-close mcds-text__size-14" onClick={close} />
                <div className="mcds-p__l-12 mcds-p__t-13 mcds-p__r-15">
                    <div className="mcds-layout__column mcds-m__t-20">
                        <div className="mcds-layout__item-12">
                            <Select
                                className="mcds-m__b-10"
                                label="字段"
                                value={this.state.expressions.getIn([index, 'display_name'])}
                                onChange={ (val) => { ::this.changeState(val, index); } }>
                                {
                                    fieldOptions
                                }
                            </Select>
                            <Select
                                className="mcds-m__b-10"
                                label="运算符"
                                value={this.state.expressions.getIn([index, 'operator']) ? (::this.operatorValue(this.state.expressions.getIn([index, 'operator']))) : '请选择'}
                                onChange={ (val) => { ::this.changeOperator(val, index); } }>
                                {::this.buildOptions()}
                            </Select>
                            <div className="mcds-input__container">
                                <label className="mcds-label">{ this.state.expressions.getIn([index, 'display_name'])}</label>
                                {this.renderOperatorName()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

EditConditionItem.propTypes = {
    expressions: PropTypes.object,
    index: PropTypes.number,
    close: PropTypes.func,
    schema: PropTypes.object,
    onChange: PropTypes.func,
    onPositionHeader: PropTypes.func,
    onChangeHeader: PropTypes.func
};

