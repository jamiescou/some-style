/*
 * @author: hanxu 
 * @date: 2017-09-08 10:15:55 
 * @last modified by: hanxu 
 * @last modified time: 2017-09-08 10:15:55 
 * @description: 用来合并数据,由二条及二条以上的数据,新建一条并删除原数据
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import _ from 'lodash';
import I from 'immutable';
import {connect} from 'react-redux';
// import classnames from 'classnames';

import {bindActionCreators} from 'redux';
// import FieldEditor from './field-editor';
// import { validation } from 'utils/validate-value';
import ErrorNotify from 'container/share/error/error-notify';
import { fetchSchema } from 'redux/reducers/standard-object/schema';
import { fetchObjConfig } from 'redux/reducers/standard-object/layout';
import { fetchRelatedDataListByIds } from 'redux/reducers/standard-object/related-object/data';
import { mergeData, combinedata } from 'redux/reducers/standard-object/listview/list';

import style from 'styles/modules/standard-object/index.scss';

import BaseEditor, { BuildFieldDependency } from '../../share/base-field-editor';
import { formatValueBySchema, filterFormatValueByScheme } from 'utils/format-value';
import { checkmergeData } from 'requests/common/standard-object';
import { checkField, filterWriteAble } from '../../standard-object/build-field';
import DetailField from '../base-field';

// import { approval, resetApprovalParam } from '../../__base/approval';

import { fetchFields } from 'redux/reducers/vetting/listview';

import {
    ModalTrigger,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFoot,
    Button,
    Checkbox,
    // Radio,
    // Select,
    Table,
    Loading,
    notify
} from 'carbon';

class DataMergeModal extends Component {
    static propTypes = {
        // 预合并id
        idArray: PropTypes.array.isRequired,

        // 对象名称
        objName: PropTypes.string.isRequired,

        // // This handler is called each create data success
        // success: PropTypes.func,

        // // This handler is called each create data fail
        // fail: PropTypes.func,

        // 触发元素
        trigger: PropTypes.element.isRequired,

        // 检查是否可以合并
        checkmergeData: PropTypes.func,

        // schema接口是为了数据的缓存 ,更加方便才引入进来.从store上获取不用传
        schema: PropTypes.object,

        relatedObject: PropTypes.object,
        // e.t
        objConfig: PropTypes.object,
        fetchSchema: PropTypes.func,
        active: PropTypes.bool,
        updateModalInfo: PropTypes.func,
        fetchObjConfig: PropTypes.func,
        // fetchOneRequest: PropTypes.func,
        fetchRelatedDataListByIds: PropTypes.func,
        mergeData: PropTypes.func,
        combinedata: PropTypes.func,
        // 这两个是预览卡控制modal的
        onCloseModal: PropTypes.func,
        onOpenModal: PropTypes.func
    };
    constructor(props){
        super(props);
        this.state = {
            loading: true, // 加载标识位
            errorMessages: [], // 后端校验标识位, 该标识位.每次发送请求之前,需要清空
            requirList: [], // 必填字段的报错数组容器,每次提交数组前,前端默认检查是否有必填字段.未传入数据
            valueArr: [], // 传入多个字段的数据组成的数据,
            onlyConflict: false,
            deleteIds: [],
            curIndex: 0,
            checked: {},
            value: {}
        };
        this.handleOnlyConflict = this.handleOnlyConflict.bind(this);
        this.handleSubmitClick = this.handleSubmitClick.bind(this);
    }
    componentDidMount(){
        let { objName, idArray, fetchRelatedDataListByIds } = this.props;
        fetchRelatedDataListByIds(objName, idArray).then(() => {}, (error)=> { ErrorNotify(error) })
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.idArray !== this.props.idArray) {
            this.initData(nextProps.idArray);
        }
    }
    async initData(idArray = this.props.idArray) {
        this.setState({
            loading: true
        });
        let { objName, relatedObject, objConfig } = this.props;
        let { curIndex, checked, value } = this.state;
        let valueArr = [];
        let schema = this.getSchemaData();
        Promise.all([
            this.props.fetchSchema(objName),
            this.props.fetchObjConfig(objName),
            this.props.fetchFields(objName, idArray),
            this.props.fetchRelatedDataListByIds(objName, idArray)
        ]).then(() => {
            this.Depend = BuildFieldDependency(BaseEditor, objConfig.get(objName));
            let dataList = relatedObject.get(objName);
            idArray.forEach((id)=>{
                let data = dataList.get(id);
                valueArr.push(data);
            });            
            schema.map(v=>{
                let name = v.get('name');
                checked[name] = curIndex;
                value[name] = valueArr[curIndex].get(name);
            });

            this.setState({
                valueArr: valueArr,
                loading: false,
                checked,
                value
            });
        }, () => {
            this.setState({
                loading: false
            });
        });
    }
    // 确认提交 按钮
    handleSubmitClick() {
        let { objName, idArray, mergeData } = this.props;
        // let { deleteIds } = this.state;
        let deleteIds = [];
        this.setState({
            loading: false,
            errorMessages: []
        });
        let schema = this.getSchemaData();
        let params = {};
        _.map(schema, v => {
            let name = v.get('name');
            // console.log('name', this.refs[name], this.refs[name].getValue());
            let tmpVal = this.refs[name].getValue();
            params[name] = formatValueBySchema(tmpVal, v);
        });
        let newParams = filterFormatValueByScheme(params, schema);
        let optional = {
            merge_ids: idArray,
            delete_ids: deleteIds
        };
        checkmergeData(idArray, deleteIds, objName).then(
            (res) => {
                if (res.body.permission.runnable) {
                    mergeData(objName, newParams, optional).then(
                        () => {
                            combinedata(objName, newParams, optional);
                            notify.add('合并成功');
                        }, errorMsg => {
                            ErrorNotify(errorMsg);
                        });
                }
            }, errorMsg => {
                ErrorNotify(errorMsg);
            });
    }

    // 取消按钮 逻辑
    handleCancleClick() {
        this.resetState();
    }
    // 根据order的有无对schema进行处理
    getSchemaData() {
        let { objName, fields } = this.props;
        let schema = this.props.schema.get(objName);
        // 过滤掉正在审批的字段
        if (fields && fields.get('FieldList')) {
            let keys = fields.get('FieldList').map(item => { return item.split('.')[0]; });
            keys = [...new Set(keys)];
            schema = schema.deleteAll(keys);
        }
        let result = [];
        let orderSchema = this.props.order;
        if (!_.isEmpty(orderSchema)) {
            // 按用户传来的order来展示
            _.map(orderSchema, val => {
                if (schema.get(val) && schema.getIn([val, 'writable'])) {
                    result.push(schema.get(val));
                }
            });
            return result;
        }
        // 用户未传入order参数时
        schema = filterWriteAble(schema);
        schema = checkField(schema);
        return schema;
    }
    changeOneData(type, data, index) {
        let { checked, value } = this.state;
        checked[type] = index;
        value[type] = data;
        // this.refs[type].setDependValue(data);
        // console.log('type', this.refs[type].getValue())
        this.refs[type].setValue(data);
        this.setState({
            checked,
            value
        });
    }
    changeObject(i) {
        let { valueArr } = this.state;
        let schema = this.getSchemaData();
        this.setState({
            curIndex: i
        });
        schema.map(v=>{
            let type = v.get('name');
            let data = valueArr[i].get(type);
            this.changeOneData(type, data, i);
        });
    }
    handleDeleteId(id, checked) {
        let { deleteIds } = this.state;
        if (checked) {
            deleteIds.push(id);
        } else {
            let i = deleteIds.indexOf(id);
            deleteIds.splice(i, 1)
        }
        this.setState({
            deleteIds
        })
    }
    renderModalThead() {
        let { idArray } = this.props;
        let { curIndex } = this.state;
        let ths = idArray.map((id, i) =>{
            return (<th
                key={i} className="mcds-truncate mcds-cursor__pointer" onClick={this.changeObject.bind(this, i)}>
                <input
                    type="radio"
                    checked={curIndex === i} />
                <span className="mcds-m__l-7">全选</span>
            </th>);
        });
        return (
            <thead>
                <th className="mcds-truncate">字段</th>
                {ths}
                <th className="mcds-truncate">新建字段</th>
            </thead>
        );
    }
    renderModalTbady() {
        let schema = this.getSchemaData();
        let items = _.map(schema, v => this._baseTr(v));
        if (this.state.loading) {
            return this.loading();
        }
        return items;
    }
    renderDeleteTd() {
        let { idArray } = this.props;
        let { deleteIds } = this.state;
        let deleteTds = idArray.map((id, i) =>{
            return (<td key={i} className="mcds-truncate">
                <Checkbox
                    className="mcds-checkbox__font-12"
                    onChange={this.handleDeleteId.bind(this, id)}
                    label="合并之后删除记录"
                    checked={ deleteIds.indexOf(id)>=0 } />
            </td>);
        });
        return (
            <tr className="mcds-text-title__caps">
                <td className="mcds-truncate" />
                {deleteTds}
                <td className="mcds-truncate" />
            </tr>
        );
    }
    _baseTr(item) {
        let { objName } = this.props;
        let { valueArr, onlyConflict, curIndex, checked, value } = this.state;
        let type = item.get('name');
        let schema = this.props.schema.get(objName);
        let Depend = this.Depend;
        if (valueArr.length === 0) {
            return this.loading();
        }
        valueArr.map(val=>{
            if (!I.isImmutable(val)){
                return this.loading();
            }
        });
        // 判断多个数据是否有冲突，用第一个数据和后面的对比
        let isEqual = true;
        let firstValue = valueArr[0].get(type);
        let tds = valueArr.map((val, i) => {
            if (!I.isImmutable(val)) {
                return this.loading();
            }
            if (i !== 0 ) {
                if (!_.isEqual(firstValue, val.get(type))){
                    isEqual = false;
                }
            }
            let context = new DetailField({
                schema: schema.get(type),
                value: val.get(type),
                objName
            }).render();
            return (
                <td
                    key={i}
                    className="mcds-truncate mcds-cursor__pointer"
                    onClick={this.changeOneData.bind(this, type, val.get(type), i)}>
                    <input
                        type="radio"
                        checked={ checked[type] === i } />
                    <span className="mcds-m__l-7" style={{display: 'inline-block'}}>{context}</span>
                </td>
            );
        });
        let classNameNoConflict = null;
        if (onlyConflict) {
            classNameNoConflict = 'hide';
        }
        let classNameConflict = isEqual ? classNameNoConflict : style['merge-modal__conflict-tr'];
        return (
            <tr key={type} className={`mcds-text-title__caps ${classNameConflict}`}>
                <td className="mcds-truncate">{item.get('display_name')}</td>
                {tds}
                <td className="mcds-truncate">
                    <div style={{width: 300}}>
                        <BaseEditor ref={type} schema={schema.get(type)} value={valueArr[curIndex].get(type)} />
                    </div>
                </td>
            </tr>
        );
    }
    renderTrigger() {
        let newOnClick = () => {
            this.initData();
            // 这个是预览卡的操作      
            if (this.props.onOpenModal) {
                this.props.onOpenModal();
            }
        };
        return React.cloneElement(this.props.trigger, { onClick: newOnClick});
    }

    resetState(){
        this.setState({
            loading: true,
            errorMessages: [],
            requirList: [],
            valueArr: [],
            onlyConflict: false,
            deleteIds: [],
            curIndex: 0
        });
    }
    resetButtonDisabled() {
        setTimeout(() => {
            this.setState({
                disabled: false
            });
        }, 300);
    }
    handleOnlyConflict() {
        let { onlyConflict } = this.state;
        this.setState({
            onlyConflict: !onlyConflict
        });
    }
    loading() {
        return (
            <div key="loading" id={style.moreLoading}>
                <Loading theme="logo" model="small" />
            </div>
        );
    }
    render() {
        let { idArray, objName } = this.props;
        let { onlyConflict } = this.state;
        let schema = this.props.schema.get(objName);
        return (
            <ModalTrigger>
                { this.renderTrigger() }
                <Modal className="mcds-modal__auto">
                    <ModalHeader>
                        <i className="mcds-modal__close mcds-icon__close-line-20 close" />
                        <p className="mcds-modal__title">
                            数据合并
                        </p>
                    </ModalHeader>
                    <ModalBody className="mcds-p__l-0 mcds-p__r-0" style={{height: '500px'}}>
                        <div className="mcds-layout__column mcds-p__l-20 mcds-p__r-20">
                            <div className="mcds-layout__item-6">
                                <p>{idArray.length}个对象待合并</p>
                            </div>
                            <div className="mcds-layout__item-6">
                                <div className="mcds-layout__column mcds-layout__right">
                                    <Checkbox
                                        className="mcds-checkbox__font-12"
                                        label="仅显示冲突字段"
                                        name="onlyConflict"
                                        onChange={this.handleOnlyConflict} checked={onlyConflict} />
                                </div>
                            </div>
                        </div>
                        <Table className="mcds-table-col__bordered mcds-m__t-20 mcds-m__b-20">
                            {this.renderModalThead()}
                            {
                                schema && schema.size ? this.renderModalTbady() : null
                            }
                            {/* this.renderDeleteTd() */}
                        </Table>
                    </ModalBody>
                    <ModalFoot>
                        <div className="mcds-layout__column">
                            <div className="mcds-layout__column mcds-layout__item-6 mcds-layout__right">
                                <Button className="mcds-button__neutral mcds-btn__right close">
                                    取消
                                </Button>
                                <Button className="mcds-button__brand close" onClick={this.handleSubmitClick}>
                                    确认合并
                                </Button>
                            </div>
                        </div>
                    </ModalFoot>
                </Modal>
            </ModalTrigger>
        );
    }
}

const approvalPtys = {
    curObjName: PropTypes.string,
    objId: PropTypes.string,
    fromPage: PropTypes.string,
    param: PropTypes.object,
    info: PropTypes.object,
    fields: PropTypes.object,
    fetchFields: PropTypes.func
};

// 审批相关属性
DataMergeModal.propTypes = {
    ...approvalPtys
};

export default connect(
    state => ({
        schema: state.getIn(['standardObject', 'schema']),
        param: state.getIn(['vetting', 'listview', 'param']), // 审批页面的信息，取来是为了用action区分弹update的modal还是create的modal
        fields: state.getIn(['vetting', 'listview', 'fields']),
        info: state.getIn(['vetting', 'listview', 'info']),
        objConfig: state.getIn(['standardObject', 'layout', 'objConfig']),
        relatedObject: state.getIn(['standardObject', 'relatedObject'])
    }),
    dispatch => bindActionCreators({ fetchSchema, fetchFields, fetchObjConfig, fetchRelatedDataListByIds, mergeData, combinedata }, dispatch)
)(DataMergeModal);
