import _ from 'lodash';
import I from 'immutable';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import {connect} from 'react-redux';
import React, { Component } from 'react';
import {bindActionCreators} from 'redux';

import FieldEditor from './field-editor';
import { validation } from 'utils/validate-value';
import { fetchSchema } from 'redux/reducers/standard-object/schema';
import { fetchObjConfig } from 'redux/reducers/standard-object/layout';
import { createDataRequest } from 'requests/common/standard-object';
import style from 'styles/modules/standard-object/require-style.scss';
import BaseEditor, { BuildFieldDependency } from '../../share/base-field-editor';
import { formatValueBySchema, filterFormatValueByScheme } from 'utils/format-value';
import { spliteArrayPerTwo, checkField, filterWriteAble } from '../../standard-object/build-field';

import ErrorNotify from 'container/share/error/error-notify';

import {
    Modal,
    ModalTrigger,
    ModalHeader,
    ModalBody,
    ModalFoot,
    Button,
    Loading,
    notify
} from 'carbon';

import { approval, resetApprovalParam } from '../../__base/approval';

class CreateModal extends Component {
    static propTypes = {
        // standardObject Name
        // e.g. "Leads"
        objName: PropTypes.string.isRequired,

        // call create modal with some default;
        // template {fieldName: fieldValule}
        // e.g. {name:'MyName', ...}
        defaultValue: PropTypes.object,

        // 排序 !!!!废弃!!!不要再使用
        // 非必填,如果没有字段排序,内部默认遍历所有schema.writeable = true的所有列
        order: PropTypes.array,
        // This handler is called each create data success
        success: PropTypes.func,

        // This handler is called each create data fail
        fail: PropTypes.func,

        // 触发区域
        trigger: PropTypes.element.isRequired,
        // 以下接口是redux层相关
        // schema接口是为了数据的缓存 ,更加方便才引入进来.从store上获取不用传
        schema: PropTypes.object,
        fetchSchema: PropTypes.func,
        fetchObjConfig: PropTypes.func,
        // 这两个是预览卡控制modal的
        onCloseModal: PropTypes.func,
        onOpenModal: PropTypes.func
    };
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            requirList: [], // 存放必填字段的数组
            errorMessages: [], // 后端校验标识位, 该标识位.每次发送请求之前,需要清空
            disabled: false // 防止多次提交
        };
        this.Depend = BuildFieldDependency(BaseEditor, {});
    }

    closeModal() {
        if (this.refs.handleClose && this.refs.handleClose.click) {
            this.refs.handleClose.click();
        }
    }
    /**
     * [获取在新建modal中, 可用于遍历的schema]
     * @return {Immutable array} [可用schema]
     */
    getOrderSchema() {
        // objConfig
        let { objName, objConfig, order } = this.props;
        let schema = this.props.schema.get(objName);
        let layoutCreateOrder = objConfig.getIn([objName, 'create_order']);
  
        // 返回的结果
        let resultSchema = [];

        // 所有必填字段的schema集合
        let requiredField = [];

        // 优先使用 objConfig 上的config
        let orderSchema = order;

        // 使用 对象单独的配置
        if (layoutCreateOrder && layoutCreateOrder.size !== 0) {
            orderSchema = layoutCreateOrder.toJS();
        }
 
        if (!_.isEmpty(orderSchema)) {
            _.map(orderSchema, val => {
                if (schema.get(val) && schema.getIn([val, 'writable'])) {
                    resultSchema.push(schema.get(val));
                }
            });
            // 如果用户未传入必填字段的处理
            // 获取schema中所有的必填字段
            schema.map((v) => {
                if (!v.get('nullable') && v.get('writable')) {
                    requiredField.push(v);
                }
            });
            _.map(requiredField, val => {
                if (_.indexOf(orderSchema, val.get('name')) === -1) {
                    resultSchema.push(val);
                }
            });
            return resultSchema;
        }

        return ;
    }
    handleSubmitClick() {
        let schema = this.getSchemaData();
        let { objName, curObjName, objId, fromPage } = this.props;

        let params = {};
        let objects = [];
        _.map(schema, v => {
            let tmpVal = this.refs[v.get('name')].getValue();
            params[v.get('name')] = formatValueBySchema(tmpVal, v);
        });

        let newParams = filterFormatValueByScheme(params, schema);

        objects.push(newParams);

        let validList = validation(schema, newParams);
        if (_.isArray(validList) && validList.length > 0) {
            this.setState({
                requirList: validList
            });
        } else {
            this.setState({
                disabled: true
            });
            // 选择审批页面需要的参数
            let paramObj = {objName: objName, curObjName: curObjName, objId: objId, page: fromPage, action: 'create'};

            // 请求失败code为103133是需要审批
            let sendCreatData = createDataRequest(objName, objects);
            sendCreatData().then((response) => {
                this.closeModal();
                this.props.success(objName, response);
                // 这个是预览卡的操作
                if (this.props.onCloseModal) {
                    this.props.onCloseModal();
                }
                notify.add('操作成功');
                this.resetState();
            }, errorMsg => {
                if (errorMsg.code === 103133) {
                    approval('create', paramObj, newParams);
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
        return (
            <div className="mcds-layout__column mcds-m__b-20" key={listIndex}>
                {column}
            </div>
        );
    }

    _buildDependItem(item) {
        let name = I.isImmutable(item) ? item.get('name') : item.name;

        let defaultValue = this.props.defaultValue;
        let { param, info, objName } = this.props;

        // 判断从选择审批页面返回后modal需要的值
        if (info && param && info.objName === objName && info.action === 'create') {
            defaultValue = this.props.param[name] || '';
        } else {
            defaultValue = I.isImmutable(defaultValue) ? defaultValue.get(name) : defaultValue.name;
            defaultValue = defaultValue || '';
        }
        let { errorMessages }  = this.state;
        let errorMsg = '';
        let Depend = this.Depend;
        let requirList = this.state.requirList;
        requirList.forEach(v => {
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
                errorMsg={errorMsg}
                schema={item}
                value={defaultValue || ''}
                Editor={Depend} />
        );
    }
    // 根据order的有无对schema进行处理

    getSchemaData(){
        let { objName } = this.props;
        let schema = this.props.schema.get(objName);
        let orderSchema = this.getOrderSchema();

        if (orderSchema) {
            return orderSchema;
        }

        // 通过 getOrderSchema未得到有效的参数
        schema = filterWriteAble(schema);
        schema = checkField(schema);
        return schema;
    }
    renderModalDataItem(){
        let schema = this.getSchemaData();
        let items = _.map(schema, v => this._buildDependItem(v));
        let fieldsList = spliteArrayPerTwo(items); // 定义在数组中
        return fieldsList.map((fieldsColumn, listIndex) => this._renderColumn(fieldsColumn, listIndex));
    }
    renderModalBody(){
        let { objName } = this.props;
        if (this.state.loading) {
            return this.loading();
        }
        let schema = this.props.schema.get(objName);
        // 判断是否获取到schema的数据
        if (schema && schema.size) {
            return (
                <ModalBody style={{height: '100%'}}>
                    {this.renderModalDataItem()}
                </ModalBody>
            );
        }
        // 应该逻辑到不了这里.为了避免不可预料的问题还是加上这一块.
        return <div>no schema please check</div>;
    }

    // 取消按钮 逻辑
    handleCancleClick() {
        this.resetState();
        resetApprovalParam('create');
        // 这个是预览卡的操作
        if (this.props.onCloseModal) {
            this.props.onCloseModal();
        }
    }

    // 重置state
    resetState(){
        this.setState({
            requirList: [],
            errorMessages: []
        });
    }

    // 重置按钮的点击
    resetButtonDisabled() {
        setTimeout(() => {
            this.setState({
                disabled: false
            });
        }, 300);
    }
    // 
    initData() {
        let { objName } = this.props;
        this.setState({loading: true});
        Promise.all([
            this.props.fetchObjConfig(objName),
            this.props.fetchSchema(objName)
        ]).then(() => {
            let { objConfig } = this.props;
            this.Depend = BuildFieldDependency(BaseEditor, objConfig.get(objName));
            this.setState({
                loading: false
            });
        }, () => {
            this.setState({
                loading: false
            });
        });
    }
    renderTriggerButton() {
        let newOnClick = () => {
            this.initData();
            this.resetButtonDisabled();
            // 这个是预览卡的操作      
            if (this.props.onOpenModal) {
                this.props.onOpenModal();
            }
        };
        return React.cloneElement(this.props.trigger, { onClick: newOnClick});
    }
    loading() {
        return (
            <div>
                <Loading theme="logo" model="small" />
            </div>
        );
    }
    render() {

        return (
            <ModalTrigger>
                {this.renderTriggerButton()}
                <Modal className={`mcds-modal__w-820 ${style.modal_content}`} ref="modal" >
                    <ModalHeader>
                        <i className="mcds-modal__close mcds-icon__close-line-20 close" onClick={::this.handleCancleClick} />
                        <p className="mcds-modal__title">
                            新建
                        </p>
                    </ModalHeader>
                    {this.renderModalBody()}
                    <ModalFoot>
                        <span ref="handleClose" className="close" />
                        <div className="mcds-layout__column mcds-layout__right">
                            <span ref="handleClose" className="close" />
                            <Button className="mcds-button__neutral mcds-btn__right close" onClick={this.handleCancleClick.bind(this)}>
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

CreateModal.contextTypes = {
    router: PropTypes.object.isRequired
};

CreateModal.defaultProps = {
    success: () => {},
    fail: () => {},
    defaultValue: I.fromJS({}),
    order: []
};


const approvalPtys = {
    curObjName: PropTypes.string,
    objId: PropTypes.string,
    fromPage: PropTypes.string,
    param: PropTypes.object,
    info: PropTypes.object
};

// 审批相关属性
CreateModal.propTypes = {
    ...approvalPtys
};

export default connect(
    state => ({
        schema: state.getIn(['standardObject', 'schema']),
        objConfig: state.getIn(['standardObject', 'layout', 'objConfig']),
        param: state.getIn(['vetting', 'listview', 'param']), // 审批页面的信息，取来是为了用action区分弹update的modal还是create的modal
        info: state.getIn(['vetting', 'listview', 'info'])
    }),
    dispatch => bindActionCreators({ fetchSchema, fetchObjConfig }, dispatch)
)(CreateModal);
