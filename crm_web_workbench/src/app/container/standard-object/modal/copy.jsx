/* eslint-disable */

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import _ from 'lodash';
import I from 'immutable';
import {connect} from 'react-redux';
import classnames from 'classnames';

import {bindActionCreators} from 'redux';
import FieldEditor from './field-editor';
import { validation } from 'utils/validate-value';
import ErrorNotify from 'container/share/error/error-notify';
import { fetchSchema } from 'redux/reducers/standard-object/schema';
import { fetchObjConfig } from 'redux/reducers/standard-object/layout';

// import style from 'styles/modules/standard-object/require-style.scss';
import style from 'styles/modules/standard-object/index.scss';

import BaseEditor, { BuildFieldDependency } from '../../share/base-field-editor';
import { formatValueBySchema, filterFormatValueByScheme } from 'utils/format-value';
import { fetchOneRequest, updateDataRequest } from 'requests/common/standard-object';
import { spliteArrayPerTwo, checkField, filterWriteAble } from '../../standard-object/build-field';
import DetailField from '../base-field';

import { approval, resetApprovalParam } from '../../__base/approval';

import { fetchFields } from 'redux/reducers/vetting/listview';

import {
    ModalTrigger,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFoot,
    Button,
    Checkbox,
    Radio,
    Select,
    Table
} from 'carbon';

class CopyDataModal extends Component {
    static propTypes = {
        // 预合并id列表
        // combineList: PropTypes.array.isRequired,

        // 预合并id
        idArray: PropTypes.array.isRequired,

        // 对象名称
        objName: PropTypes.string.isRequired,

        // This handler is called each create data success
        success: PropTypes.func,

        // This handler is called each create data fail
        fail: PropTypes.func,

        // 触发元素
        trigger: PropTypes.element.isRequired,

        // 非必填,如果没有字段排序,内部默认遍历所有schema.writeable = true的所有列
        order: PropTypes.array,

        // This handler is called each create data success
        success: PropTypes.func,

        // This handler is called each create data fail
        fail: PropTypes.func,

        // 以上接口是必须严格传递,

        // 以下接口是redux层相关

        // schema接口是为了数据的缓存 ,更加方便才引入进来.从store上获取不用传
        schema: PropTypes.object,

        // e.t
        objConfig: PropTypes.object,
        fetchSchema: PropTypes.func,
        active: PropTypes.bool,
        updateModalInfo: PropTypes.func,
        fetchObjConfig: PropTypes.func,

        // 这两个是预览卡控制modal的
        onCloseModal: PropTypes.func,
        onOpenModal: PropTypes.func
    };
    constructor(props){
        super(props);
        this.state = {
            disabled: false, // 确认按钮的disable状态
            loading: true, // 加载标识位
            errorMessages: [], // 后端校验标识位, 该标识位.每次发送请求之前,需要清空
            value: '', // 存放更新对象的oldValue,每次点击button会触发获取的请求
            requirList: [], // 必填字段的报错数组容器,每次提交数组前,前端默认检查是否有必填字段.未传入数据
            valueArr: [] // 传入多个字段的数据组成的数据，
        };
    }
    componentWillMount(){

    }
   
    _renderColumn(fields, listIndex) {
        // console.log('_renderColumn', fields, listIndex)
        let column = _.map(fields, (v, i) => {
            let className = classnames('mcds-layout__item-6', {
                'mcds-p__r-15': i === 0,
                'mcds-p__l-15': i === 1
            });
            return (
                <div className={className} key={i}>
                    {v}
                </div>
            );
        });
        let curClass = null;
        // if (listIndex > 3 && !this.state.show) {
        //     curClass = 'hide';
        // }
        return (
            <div className={classnames('mcds-layout__column mcds-m__b-20', curClass)} key={listIndex}>
                {column}
            </div>
        );
    }
    // 根据order的有无对schema进行处理
    getSchemaData(){
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
    _baseEditor(item) {
        let type = item.get('name');
        let { objName } = this.props;
        let { valueArr, value } = this.state;
        let schema = this.props.schema.get(objName);
        // let { schema, value, data} = this.props;
        let isEqual = true;
        let firstValue = valueArr[0].get(type);
        let tds = valueArr.map((val, i) => {
            if (i !==0 ) {
                if (firstValue !== val.get(type)){
                    isEqual = false;
                }
            }
            let context;
            context = new DetailField({
                schema: schema.get(type),
                value: val.get(type),
                objName
            }).render();
            return (
                <td className="mcds-truncate">
                    <Radio
                        label={<span className="mcds-m__l-7">{context}</span>}
                        name={type} />
                </td>
            )
        })
        console.log('isEqual', isEqual)
        return(
            <tr className="mcds-text-title__caps">
                <td className="mcds-truncate">{item.get('display_name')}</td>
                {tds}
                <td className="mcds-truncate">
                    <BaseEditor ref={type} schema={schema.get(type)} value={value[type]} />
                </td>
            </tr>
        )
    }
    renderModalThead() {
        let { idArray } = this.props;
        let ths = idArray.map((id, i) =>{
            return <th key={i} className="mcds-truncate">线索{i+1}</th>
        })
        return(
            <thead>
                <th className="mcds-truncate">字段</th>
                {ths}
                <th className="mcds-truncate">新建字段</th>
            </thead>
        )
    }
    renderModalTbady() {
        let schema = this.getSchemaData();
        // if (schema.length === 0) {
        //     return (
        //         <div className="mcds-layout__row mcds-layout__middle mcds-layout__center">
        //             <img src="./public/img/img-no-result.svg" />
        //             <div className="mcds-text__size-14 mcds-text__weak mcds-m__t-30">哦哦，所有字段都在审批中...</div>
        //         </div>
        //     );
        // }
        // let items = _.map(schema, v => this._buildDependItem(v));
        let items = _.map(schema, v => this._baseEditor(v));
        // let fieldsList = spliteArrayPerTwo(items); // 定义在数组中
        // return fieldsList.map((fieldsColumn, listIndex) => this._renderColumn(fieldsColumn, listIndex));
        return items;
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

    initData() {
        this.setState({
            loading: true
        });
        let { objName, idArray, dataList } = this.props;
        // let id = idArray[0].get('object_id');
        // let getOneData = fetchOneRequest(objName, id);
        // console.log('dataList', idArray[0].toJS(), dataList)
        let valueArr = [];
        idArray.map((id)=>{
            let index = dataList.findIndex(d => d.get('id') === id.get('object_id'));
            let data = dataList.get(index);
            valueArr.push(data);
        })
        this.setState({
            valueArr
        })
    }

    resetState(){
        this.setState({
            loading: true,
            errorMessages: [],
            value: '',
            requirList: []
        });
    }
    resetButtonDisabled() {
        setTimeout(() => {
            this.setState({
                disabled: false
            });
        }, 300);
    }
    loading() {
        return (
            <div id={style.moreLoading}>
                <Loading theme="logo" model="small" />
            </div>
        );
    }
    render() {
        let { idArray, objName } = this.props;
        let schema = this.props.schema.get(objName);
        return (
            <ModalTrigger>
                { this.renderTrigger() }
                <Modal className="mcds-modal__w-820 mcds-modal__auto">
                    <ModalHeader>
                        <i className="mcds-modal__close mcds-icon__close-line-20 close" />
                        <p className="mcds-modal__title">
                            数据合并
                        </p>
                    </ModalHeader>
                    <ModalBody className="mcds-p__l-0 mcds-p__r-0" style={{height: '500px'}}>
                        <div className="mcds-layout__column mcds-p__l-20 mcds-p__r-20">
                            <div className="mcds-layout__item-6">
                                <p>{idArray.length}个线索对象待合并</p>
                            </div>
                            <div className="mcds-layout__item-6">
                                <div className="mcds-layout__column mcds-layout__right">
                                    <Checkbox id="checkbox1" className="mcds-checkbox__font-12" label="仅显示冲突字段" name="onlyConflict" />
                                </div>
                            </div>
                        </div>
                        <Table className="mcds-table-col__bordered mcds-m__t-20 mcds-m__b-20">
                        {this.renderModalThead()}
                        {
                            schema && schema.size ? this.renderModalTbady() : null
                        }
                        </Table>
                    </ModalBody>
                    <ModalFoot>
                        <div className="mcds-layout__column">
                            <div className="mcds-layout__column mcds-layout__item-6 mcds-layout__right">
                                <Button className="mcds-button__neutral mcds-btn__right close">
                                    取消
                                </Button>
                                <Button className="mcds-button__brand close">
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
CopyDataModal.propTypes = {
    ...approvalPtys
};

export default connect(
    state => ({
        schema: state.getIn(['standardObject', 'schema']),
        param: state.getIn(['vetting', 'listview', 'param']), // 审批页面的信息，取来是为了用action区分弹update的modal还是create的modal
        fields: state.getIn(['vetting', 'listview', 'fields']),
        info: state.getIn(['vetting', 'listview', 'info']),
        objConfig: state.getIn(['standardObject', 'layout', 'objConfig']),
        dataList: state.getIn(['standardObject', 'listview', 'list', 'data'])
    }),
    dispatch => bindActionCreators({ fetchSchema, fetchFields, fetchObjConfig }, dispatch)
)(CopyDataModal);
