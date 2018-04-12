import React, { Component } from 'react';
import { Link } from 'react-router';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import { createObjectField } from 'redux/reducers/setup/object';
import _ from 'lodash';
import {
    Input,
    Popover,
    PopoverBody,
    PopoverTrigger,
    TextArea,
    Button
} from 'carbon';

import BuildObjectField from './build-object-field';
let style = require('styles/modules/setup/object.scss');
let schema = {
    url: {
        display_name: 'URL',
        type: 'url',
        opts: {
            nullable: '必填',
            searchable: '字段值可被搜索',
            index: '为字段添加索引',
            unique: '字段值唯一'
        }
    },
    address: {
        display_name: '地址',
        type: 'address',
        opts: {
            nullable: '必填',
            searchable: '字段值可被搜索',
            index: '为字段添加索引',
            unique: '字段值唯一'
        }
    },
    datetime: {
        display_name: '日期时间',
        type: 'datetime',
        opts: {
            nullable: '必填',
            index: '为字段添加索引',
            unique: '字段值唯一'
        }
    },
    currency: {
        display_name: '货币',
        type: 'currency',
        opts: {
            nullable: '必填',
            index: '为字段添加索引',
            unique: '字段值唯一'
        }
    },
    percent: {
        display_name: '百分比',
        type: 'percent',
        opts: {
            nullable: '必填',
            index: '为字段添加索引',
            unique: '字段值唯一'
        }
    },
    phone: {
        display_name: '电话',
        type: 'phone',
        opts: {
            nullable: '必填',
            searchable: '字段值可被搜索',
            index: '为字段添加索引',
            unique: '字段值唯一'
        }
    },
    email: {
        display_name: '邮箱',
        type: 'email',
        opts: {
            nullable: '必填',
            searchable: '字段值可被搜索',
            index: '为字段添加索引',
            unique: '字段值唯一'
        }
    },
    text: {
        display_name: '文本',
        type: 'text',
        opts: {
            nullable: '必填',
            searchable: '字段值可被搜索',
            index: '为字段添加索引',
            unique: '字段值唯一'
        }
    },
    textarea: {
        display_name: '文本区',
        type: 'textarea',
        opts: {
            nullable: '必填',
            searchable: '字段值可被搜索',
            index: '为字段添加索引'
        }
    },
    longtext: {
        display_name: '长文本',
        type: 'longtext',
        opts: {
            nullable: '必填',
            searchable: '字段值可被搜索'
        }
    },
    richtext: {
        display_name: '富文本',
        type: 'richtext',
        opts: {
            nullable: '必填',
            searchable: '字段值可被搜索'
        }
    },
    file: {
        display_name: '文件',
        type: 'file',
        opts: {
            nullable: '必填',
            searchable: '字段值可被搜索',
            index: '为字段添加索引'
        }
    },
    geolocation: {
        display_name: '地理位置',
        type: 'geolocation',
        opts: {
            nullable: '必填',
            searchable: '字段值可被搜索',
            index: '为字段添加索引'
        }
    },
    integer: {
        display_name: '整数',
        type: 'integer',
        opts: {
            nullable: '必填',
            index: '为字段添加索引',
            unique: '字段值唯一'
        }
    },
    double: {
        display_name: '数字',
        type: 'double',
        opts: {
            nullable: '必填',
            index: '为字段添加索引',
            unique: '字段值唯一'
        }
    },
    checkbox: {
        display_name: '复选框',
        type: 'checkbox'
    },
    master: {
        display_name: '父子关系',
        type: 'master'
    },
    lookup: {
        display_name: '查找关系',
        type: 'lookup'
    },
    hierarchy: {
        display_name: '层级关系',
        type: 'hierarchy'
    },
    summary: {
        display_name: '累计汇总',
        type: 'summary'
    },
    calculated: {
        display_name: '公式',
        type: 'calculated'
    },
    autonumber: {
        display_name: '自动编号',
        type: 'autonumber'
    },
    picklist: {
        display_name: '单选',
        type: 'picklist',
        opts: {
            nullable: '必填',
            searchable: '字段值可被搜索',
            index: '为字段添加索引',
            default_value: '将第一个选项做为默认值'
        }
    },
    mpicklist: {
        display_name: '多选',
        type: 'mpicklist',
        opts: {
            nullable: '必填',
            searchable: '字段值可被搜索',
            default_value: '将第一个选项做为默认值'
        }
    },
    combox: {
        display_name: 'Combox',
        type: 'combox',
        opts: {
            nullable: '必填',
            searchable: '字段值可被搜索',
            index: '为字段添加索引',
            default_value: '将第一个选项做为默认值'
        }
    }
};
// 将第一个选项设为默认值
// 必填
// 字段值可被搜索
// 为字段添加索引
// 字段值唯一

class CreateObjectFieldComponent extends Component {
    static propTypes = {
    };
    constructor(){
        super();
        this.state = {
            fieldType: {
                display_name: '文本',
                type: 'text',
                opts: {
                    nullable: '必填',
                    searchable: '字段值可被搜索',
                    index: '为字段添加索引',
                    unique: '字段值唯一'
                }
            },
            fieldInfo: {}
        };
    }
    // fieldType => 字段类型判断
    handleFieldType(val){
        this.setState({
            fieldType: val
        });
    }
    // 设置字段基础信息
    handleFieldInfo(type, val){
        this.setState({
            fieldInfo: {
                ...this.state.fieldInfo,
                [type]: val
            }
        });
    }
    // 字段类型改变时清除data中的部分数据
    handleCleanData(){
        let data = this.state.data;
        let newData = _.pick(data, 'display_name', 'name', 'description', 'help_text');
        this.setState({
            data: newData
        });
    }
    // 提交新建字段的信息
    _commit(){
        // let { objName } = this.props.params;
        // let fieldInfo = this.state.fieldInfo;
        // let childComponentData = this.refs.createField.getValue();
        // let display_name = this.state.fieldInfo.display_name;
        // let type = this.state.fieldType.type;
        // let fetchData = _.merge({}, childComponentData, fieldInfo, {display_name}, {type});

        // console.log('发送数据', fetchData);
        /* this.props.createObjectField(objName, fetchData).then((res) => {
            browserHistory.push({pathname: '/setup/object/detail/test/field-setting/fieldName'})
        });*/
    }
    renderPageHeader(){
        return (
            <div className={classnames('mcds-pageheader', style['create-field__header'])}>
                <div className="mcds-grid mcds-pageheader__header">
                    <div className="mcds-pageheader__header-left">
                        <div className="mcds-media">
                            <div className="mcds-m__r-30 mcds-p__t-6">
                                <div className={classnames('mcds-pageheader__header-left-icon mcds-p__t-4 mcds-p__l-4', style['bg-gray'])} >
                                    <span className={classnames('mcds-text__size-24 mcds-icon__settings-solid-24', style['color-white'])} />
                                </div>
                            </div>
                            <div className="mcds-media__body">
                                <div className="mcds-pageheader__header-left-text mcds-text__size-13">
                                    <Link to="/setup">
                                        设置首页
                                    </Link>
                                    <i className={classnames('mcds-icon__arrow-line-20 mcds-text__size-13 mcds-icon__rotate-270 mcds-m__l-5 mcds-m__r-5', style['detail-icon'])} />
                                    <Link to="/setup/object">
                                        对象设置
                                    </Link>
                                    <i className={classnames('mcds-icon__arrow-line-20 mcds-text__size-13 mcds-icon__rotate-270 mcds-m__l-5 mcds-m__r-5', style['detail-icon'])} />
                                    <Link to="/setup/object/1">
                                        客户
                                    </Link>
                                </div>
                                <div className="mcds-text__line-28 mcds-pageheader__title">
                                    新建自定义字段
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    // 字段基础信息
    renderFieldInfo(){
        return (
            <div>
                <div className={classnames('mcds-p__t-15 mcds-p__b-15 mcds-p__l-20 mcds-text__size-16', style['font-weight__300'], style['border-b__shadow'])}>
                    字段基础信息
                </div>
                <div className="mcds-layout__column mcds-m__t-20 mcds-m__l-40 mcds-m__r-40 mcds-p__b-30">
                    <div className="mcds-layout__item-6 mcds-p__r-15 mcds-m__b-20">
                        <Input label={labelInfo('字段显示名称', '该名称将展示在用户界面')} onChange={this.handleFieldInfo.bind(this, 'display_name')} />
                    </div>
                    <div className="mcds-layout__item-6 mcds-p__l-15 mcds-m__b-20">
                        <Input label={labelInfo('字段名称', '该名称将用于内部程序，不可更改')} onChange={this.handleFieldInfo.bind(this, 'name')} />
                    </div>
                    <div className="mcds-layout__item-6  mcds-p__r-15">
                        <TextArea label="描述" name="textarea" placeholder="描述" onChange={this.handleFieldInfo.bind(this, 'description')} />
                    </div>
                    <div className="mcds-layout__item-6 mcds-p__l-15">
                        <TextArea label="帮助文本" name="textarea" placeholder="帮助文本" onChange={this.handleFieldInfo.bind(this, 'help_text')} />
                    </div>
                </div>
            </div>
        );
    }
    // 字段属性
    renderFieldProps(){
        return (
            <div>
                <div className={classnames('mcds-p__t-15 mcds-p__b-15 mcds-p__l-20 mcds-text__size-16', style['font-weight__300'], style['border-b__shadow'])}>
                    字段属性
                </div>
                <BuildObjectField ref="createField" schema={schema} curSchema={this.state.fieldType} onTypeChange={::this.handleFieldType} />
            </div>
        );
    }
    render() {
        return (
            <div>
                {this.renderPageHeader()}
                <div className={classnames('mcds-m__l-20 mcds-m__t-20 mcds-m__r-20', style['create-content'], style['bg-white'])}>
                    {this.renderFieldInfo()}
                    {this.renderFieldProps()}
                    <div className={classnames('mcds-text__center mcds-p__t-12 mcds-p__b-12', style['border-b__shadow'], style['color-save'])}>
                        <Button className="mcds-button__neutral mcds-m__r-12">
                            取消
                        </Button>
                        <Button className="mcds-button__brand" onClick={this._commit.bind(this)}>
                            保存并继续
                        </Button>
                    </div>
                </div>
            </div>
        );
    }
}

let PopoverDemoThemeInfo = props => (
    <Popover theme="info" className={classnames(props.className)}>
        <PopoverBody>
            {props.value}
        </PopoverBody>
    </Popover>
);
// 字段基础属性 的 popover组件

let labelInfo = (val, popoverInfo) => (
    <span>
        <i className={classnames('mcds-p__r-5', style['required-color'])}>*</i>{val}
        <PopoverTrigger triggerBy="click" placement={'right'} overlay={<PopoverDemoThemeInfo value={popoverInfo} />}>
            <span className={classnames('mcds-icon mcds-filter__inline-block mcds-icon__info-solid-14 mcds-filter__logic-icon mcds-p__l-5', style['margin-top__2'])} />
        </PopoverTrigger>
    </span>
);
PopoverDemoThemeInfo.propTypes = {
    className: PropTypes.string,
    value: PropTypes.string
};

export default connect(
    null,
    dispatch => bindActionCreators({
        createObjectField
    }, dispatch)
)(CreateObjectFieldComponent);

