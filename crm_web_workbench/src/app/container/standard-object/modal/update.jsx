/*
 * @author: hanxu 
 * @date: 2017-09-08 10:14:06 
 * @last modified by: hanxu 
 * @last modified time: 2017-09-08 10:14:06 
 * @description: 更新标准对象的数据,数据无依赖
 */

import _ from 'lodash';
import I from 'immutable';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import classnames from 'classnames';
import React, { Component } from 'react';

import {bindActionCreators} from 'redux';
import FieldEditor from './field-editor';
import { validation } from 'utils/validate-value';
import ErrorNotify from 'container/share/error/error-notify';
import { fetchSchema } from 'redux/reducers/standard-object/schema';
import { fetchObjConfig } from 'redux/reducers/standard-object/layout';

import style from 'styles/modules/standard-object/require-style.scss';
import BaseEditor, { BuildFieldDependency } from '../../share/base-field-editor';
import { formatValueBySchema, filterFormatValueByScheme } from 'utils/format-value';
import { fetchOneRequest, updateDataRequest } from 'requests/common/standard-object';
import { spliteArrayPerTwo, checkField, filterWriteAble } from '../../standard-object/build-field';

import { approval, resetApprovalParam } from '../../__base/approval';

import { fetchFields } from 'redux/reducers/vetting/listview';

import {
    Modal,
    ModalTrigger,
    ModalHeader,
    ModalBody,
    ModalFoot,
    Button,
    notify,
    Loading
} from 'carbon';

class UpdateModal extends Component {

    static propTypes = {
        // standardObject Name
        // e.g. "Leads"
        objName: PropTypes.string.isRequired,

        // standardObject id
        // e.g. "003bf1572d0354836905ba83aa10b522"
        id: PropTypes.string.isRequired,

        // 排序 !!!!废弃!!!不要再使用
        // 非必填,如果没有字段排序,内部默认遍历所有schema.writeable = true的所有列
        order: PropTypes.array,

        // This handler is called each create data success
        success: PropTypes.func,

        // This handler is called each create data fail
        fail: PropTypes.func,

        // 触发区域
        trigger: PropTypes.element.isRequired,

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
            requirList: [] // 必填字段的报错数组容器,每次提交数组前,前端默认检查是否有必填字段.未传入数据
        };
    }
    componentWillMount(){

    }
    closeModal() {
        let handleClose = this.refs.handleClose;
        if (handleClose && handleClose.click) {
            handleClose.click();
        }
    }

    // 确认提交 按钮
    handleSubmitClick() {
        let { objName, objId, fromPage, curObjName } = this.props;
        this.setState({
            loading: false,
            errorMessages: []
        });
        let value = this.state.value;
        let schema = this.getSchemaData();
        let params = {};
        _.map(schema, v => {
            let tmpVal = this.refs[v.get('name')].getValue();
            params[v.get('name')] = formatValueBySchema(tmpVal, v);
        });
        let newParams = filterFormatValueByScheme(params, schema);

        newParams.version = value.version;

        let validList = validation(schema, newParams);
        if (_.isArray(validList) && validList.length > 0) {
            this.setState({
                requirList: validList
            });
        } else {
            this.setState({
                requirList: [],
                disabled: true
            });
            let id = value.id || this.props.id;
            let paramObj = {
                objName: objName,
                curObjName: curObjName,
                objId: this.props.id,
                curId: objId,
                owner: value.owner,
                page: fromPage,
                action: 'update'
            };
            // 请求失败code为103133是需要审批
            let sendUpdateData = updateDataRequest(objName, id, newParams);
            sendUpdateData().then((response) => {
                this.closeModal();
                this.props.success(objName, id, response);
                // 这个是预览卡的操作
                if (this.props.onCloseModal) {
                    this.props.onCloseModal();
                }
                notify.add('修改成功');
                this.resetState();
            }, errorMsg => {
                // this.closeModal();
                if (errorMsg.code === 103133) {
                    approval('update', paramObj, newParams);
                } else {
                    let { fields } = errorMsg;
                    if (fields) {
                        this.setState({errorMessages: fields});
                    }
                    this.resetButtonDisabled();
                    this.props.fail(errorMsg);
                    ErrorNotify(errorMsg);
                }
            });
        }
    }

    // 取消按钮 逻辑
    handleCancleClick() {
        this.resetState();
        resetApprovalParam('update');
        // 这个是预览卡的操作
        if (this.props.onCloseModal) {
            this.props.onCloseModal();
        }
    }

    _buildDependItem(item) {
        let { value, errorMessages }  = this.state;
        if (!value) { return; }
        let name = I.isImmutable(item) ? item.get('name') : item.name;
        let defaultValue = value[name] || '';
        let Depend = this.Depend;
        let requirList = this.state.requirList;
        let errorMsg = '';
        (requirList).forEach(v => {
            if (item.get('name') === v){
                errorMsg = '该字段为必填字段';
            }
        });
        errorMessages.forEach(v => {
            if (item.get('name') === v.position){
                errorMsg = v.msg;
            }
        });
        return (
            <FieldEditor
                ref={item.get('name')}
                key={value.version}
                errorMsg={errorMsg}
                className=""
                schema={item}
                value={defaultValue}
                Editor={Depend} />

        );
    }
    _renderColumn(fields, listIndex) {
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
        let { objName, fields, objConfig } = this.props;

        let objUpdateOrder = objConfig.getIn([objName, 'update_order']);

        let schema = this.props.schema.get(objName);
        // 过滤掉正在审批的字段
        if (fields && fields.get('FieldList')) {
            let keys = fields.get('FieldList').map(item => { return item.split('.')[0]; });
            keys = [...new Set(keys)];
            schema = schema.deleteAll(keys);
        }
        let result = [];
        let orderSchema = objUpdateOrder || this.props.order;

        if (objUpdateOrder) {
            orderSchema = objUpdateOrder.toJS();
        }
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

    renderModalDataItem() {
        let schema = this.getSchemaData();
        if (schema.length === 0) {
            return (
                <div className="mcds-layout__row mcds-layout__middle mcds-layout__center">
                    <img src="./public/img/img-no-result.svg" />
                    <div className="mcds-text__size-14 mcds-text__weak mcds-m__t-30">哦哦，所有字段都在审批中...</div>
                </div>
            );
        }
        let items = _.map(schema, v => this._buildDependItem(v));
        let fieldsList = spliteArrayPerTwo(items); // 定义在数组中
        return fieldsList.map((fieldsColumn, listIndex) => this._renderColumn(fieldsColumn, listIndex));
    }

    renderModalBody(){
        let { objName, id } = this.props;
        let schema = this.props.schema.get(objName);
        // 判断是否获取到schema的数据
        if (schema && schema.size) {
            return (
                <ModalBody style={{height: '100%'}} key={id}>
                    {this.renderModalDataItem()}
                </ModalBody>
            );
        }
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
        let { objName, id, param } = this.props;
        let getOneData = fetchOneRequest(objName, id);

        Promise.all([
            this.props.fetchSchema(objName),
            this.props.fetchObjConfig(objName),
            this.props.fetchFields(objName, id),
            getOneData()
        ]).then((res) => {
            let { objConfig } = this.props;
            this.Depend = BuildFieldDependency(BaseEditor, objConfig.get(objName));
            this.setState({
                value: param || res[3].body,
                loading: false,
                disabled: false
            }, () => {
                this.forceUpdate();
            });
        });
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
        return (
            <ModalTrigger>
                {this.renderTrigger()}
                <Modal className={`mcds-modal__w-820 ${style.modal_content}`} ref="modal">
                    <ModalHeader>
                        <i className="mcds-modal__close mcds-icon__close-line-20 close" onClick={::this.handleCancleClick} />
                        <p className="mcds-modal__title">
                            编辑
                        </p>
                    </ModalHeader>
                    {this.state.loading ? this.loading() : this.renderModalBody()}
                    <ModalFoot>
                        <span ref="handleClose" className="close" />
                        <div className="mcds-layout__column mcds-layout__right">
                            <span ref="handleClose" className="close" />
                            <Button className="mcds-button__neutral mcds-btn__right close" onClick={::this.handleCancleClick}>
                                取消
                            </Button>
                            <Button disabled={this.state.disabled} className="mcds-button__brand" onClick={::this.handleSubmitClick}>
                                保存
                            </Button>
                        </div>
                    </ModalFoot>
                </Modal>
            </ModalTrigger>
        );
    }
}

UpdateModal.contextTypes = {
    router: PropTypes.object.isRequired
};

UpdateModal.defaultProps = {
    success: () => {},
    fail: () => {}
};

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
UpdateModal.propTypes = {
    ...approvalPtys
};

export default connect(
    state => ({
        schema: state.getIn(['standardObject', 'schema']),
        param: state.getIn(['vetting', 'listview', 'param']), // 审批页面的信息，取来是为了用action区分弹update的modal还是create的modal
        fields: state.getIn(['vetting', 'listview', 'fields']),
        info: state.getIn(['vetting', 'listview', 'info']),
        objConfig: state.getIn(['standardObject', 'layout', 'objConfig'])
    }),
    dispatch => bindActionCreators({ fetchSchema, fetchFields, fetchObjConfig }, dispatch)
)(UpdateModal);
