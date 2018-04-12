import React, { Component } from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { browserHistory } from 'react-router';
import {
    Button,
    TextArea,
    Input,
    Popover,
    PopoverBody,
    PopoverTrigger,
    Select,
    notify
} from 'carbon';
import { createObject, addColumn } from 'redux/reducers/setup/object';

let style = require('styles/modules/setup/object.scss');

let dataType = {
    text: '文本',
    autonumber: '自动编号'
};
class CreateObject extends Component {
    static propTypes = {
        createObject: PropTypes.func,
        addColumn: PropTypes.func
    };
    constructor(){
        super();
        this.state = {
            obj: {
                display_name: '',
                description: ''
            },
            objName: '',
            column: {
                name: 'name',
                display_name: '',
                type: null

            }
        };
    }
    // 修改对象展示名称
    handleDisplayName(val){
        this.setState({
            obj: {
                ...this.state.obj,
                display_name: val
            }
        });
    }
    // 修改发送时的objName
    handleObjName(val){
        this.setState({
            objName: val
        });
    }
    // 修改对象描述
    handleDescription(val){
        this.setState({
            obj: {
                ...this.state.obj,
                description: val
            }
        });
    }
    // 修改数据类型
    handleDataType(val){
        this.setState({
            column: {
                ...this.state.column,
                type: val
            }
        });
    }
    // 修改记录名
    handleRecordName(val){
        this.setState({
            column: {
                ...this.state.column,
                display_name: val
            }
        });
    }
    // 清除页面数据
    handleCleanData(){
        this.setState({
            obj: {
                display_name: '',
                description: ''
            },
            objName: '',
            column: {
                name: 'name',
                display_name: '',
                type: null

            }
        });
    }
    // 保存
    handleSave(flag){
        // flag: true 保存并继续新建 false: 保存并跳转到列表
        let objName = this.state.objName;
        let param = this.state.obj;
        let column = this.state.column;
        this.props.createObject(objName, param).then(() => {
            this.props.addColumn(objName, column).then(() => {
                if (flag) {
                    notify.add({message: '创建成功', theme: 'success'});
                    this.handleCleanData();
                } else {
                    browserHistory.push({ pathname: '/setup/object'});
                }
            });
        });
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
                                </div>
                                <div className="mcds-text__line-28 mcds-pageheader__title">
                                    新建对象
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
                    自定义对象信息
                </div>
                <div className="mcds-layout__column mcds-m__t-20 mcds-m__l-40 mcds-m__r-40 mcds-p__b-30">
                    <div className="mcds-layout__item-6 mcds-p__r-15 mcds-m__b-20">
                        <Input value={this.state.obj.display_name} label={labelInfo('对象展示名称', '这个我没看到啊')} onChange={this.handleDisplayName.bind(this)} />
                    </div>
                    <div className="mcds-layout__item-6 mcds-p__l-15 mcds-m__b-20">
                        <Input value={this.state.objName} label={labelInfo('对象名', '这个我也没看到在哪里啊, 晓慧没给说啊')} onChange={this.handleObjName.bind(this)} />
                    </div>
                    <div className="mcds-layout__item-6  mcds-p__r-15">
                        <TextArea value={this.state.obj.description} label="描述" name="textarea" placeholder="描述" onChange={this.handleDescription.bind(this)} />
                    </div>
                </div>
            </div>
        );
    }
    // 记录名称和格式
    renderRecordName(){
        return (
            <div>
                <div className={classnames('mcds-p__t-15 mcds-p__b-15 mcds-p__l-20 mcds-text__size-16', style['font-weight__300'], style['border-b__shadow'])}>
                    记录名称和格式
                </div>
                <div className="mcds-layout__column mcds-m__t-20 mcds-m__l-40 mcds-m__r-40 mcds-p__b-40">
                    <div className="mcds-layout__item-6 mcds-p__r-15 mcds-m__b-20">
                        <Input value={this.state.column.display_name} label={labelInfo('记录名', '例如：客户的记录名称是“客户名称”，对于个案，记录名称是“个案编号”。')} onChange={::this.handleRecordName} />
                    </div>
                    <div className="mcds-layout__item-6 mcds-p__l-15 mcds-m__b-20">
                        <span className={classnames('mcds-text__size-12', style['text-color'])}><i className={classnames('mcds-p__r-5', style['required-color'])}>*</i>数据类型</span>
                        <Select value={dataType[this.state.column.type]} className="mcds-m__t-5" onChange={::this.handleDataType}>
                            <option value="text">文本</option>
                            <option value="autonumber">自动编号</option>
                        </Select>
                    </div>
                    <div className="mcds-layout__item-6 mcds-layout__offset-6  mcds-p__l-15 mcds-m__b-20">
                        <Input label={labelInfo('显示格式', '我都不知道啊', true)} />
                    </div>
                    <div className="mcds-layout__item-6 mcds-layout__offset-6  mcds-p__l-15">
                        <Input label={<span className={classnames('mcds-text__size-12', style['text-color'])}><i className={classnames('mcds-p__r-5', style['required-color'])}>*</i>开始编号</span>} />
                    </div>
                </div>
            </div>
        );
    }

    render(){
        return (
            <div>
                {this.renderPageHeader()}
                <div className={classnames('mcds-m__l-20 mcds-m__t-20 mcds-m__r-20', style['create-content'], style['bg-white'])}>
                    {this.renderFieldInfo()}
                    {this.renderRecordName()}
                    <div className={classnames('mcds-text__center mcds-p__t-12 mcds-p__b-12', style['border-b__shadow'], style['color-save'])}>
                        <Button className="mcds-button__neutral mcds-m__r-12">
                            取消
                        </Button>
                        <Button className="mcds-button__neutral mcds-m__r-12" onClick={this.handleSave.bind(this, false)}>
                            保存
                        </Button>
                        <Button className="mcds-button__brand" onClick={this.handleSave.bind(this, true)}>
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
let labelInfo = (val, popoverInfo, bool) => (
    <span>
        {bool ? '' : <i className={classnames('mcds-p__r-5', style['required-color'])}>*</i>}{val}
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
        createObject,
        addColumn
    }, dispatch)
)(CreateObject);
