/**
 * 做转化线索的modal
 */
import _ from 'lodash';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { isImmutable } from 'immutable';
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { browserHistory } from 'react-router';

import FieldEditor from './field-editor';
import { validation } from 'utils/validate-value';
import { filterWriteAble } from '../build-field';
import { formatValueBySchema } from 'utils/format-value';
import ErrorNotify from 'container/share/error/error-notify';
import { fetchCustomerAction } from 'requests/common/actions';
import { fetchMeta } from 'redux/reducers/standard-object/meta';
import { spliteArrayPerTwo, checkIsSystemField } from '../build-field';
import BaseEditor, { BuildFieldDependency } from '../../share/base-field-editor';

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

import style from 'styles/modules/standard-object/index.scss';
// leads_to_account_and_contact
class ConvertModal extends Component {
    static propTypes = {
        // standardObject Name
        // e.g. "Leads"
        objName: PropTypes.string.isRequired,

        // 当前对象的属性值, 可能是immu
        detail: PropTypes.object.isRequired,

        // 执行的操作名称前缀
        actionName: PropTypes.string.isRequired,

        trigger: PropTypes.element.isRequired,

        actions: PropTypes.object,
        fetchMeta: PropTypes.func,
        meta: PropTypes.object
    };

    constructor() {
        super();
        this.state = {
            info: {}, // 存放相关meta信息
            loading: true, // 加载状态
            error: null, // 错误信息
            data: null,
            title: null, // modal title
            disabled: false,
            requirList: {},
            errorMessages: [] // 后端校验标识位, 该标识位.每次发送请求之前,需要清空
        };
        this.BaseEditor = BuildFieldDependency(BaseEditor);
    }

    componentWillMount() {
        let { actionName, actions, objName } = this.props;
        actionName = `${actionName}_pre`;
        let action = actions.getIn([objName, actionName]);
        let title = action.get('display_name');
        this.setState({
            title
        });
    }

    /**
     * [fillInDate 向pre方法中,填写相关参数]
     * @param  {[object]} param  [pre方法中的param]
     * @param  {[object]} detail [对象的属性 ]
     * @return {[type]}        [description]
     *
     * "datas": {
     *              "Leads": [
     *                   {
     *                       "id": "636d7b94d70081fc2c6dc41d628e138f"
     *                   }
     *               ]
     *          }
     */
    fillInDate(param, detail) {
        let result = {};
        let newDetail = isImmutable(detail) ? detail.toJS() : detail;

        result = {
            datas: {
                Leads: [
                    {
                        id: newDetail.id
                    }
                ]
            }
        };
        return result;
    }
    closeModal() {
        if (this.refs.handleClose && this.refs.handleClose.click) {
            this.refs.handleClose.click();
        }
    }

    handleRequestPre() {
        let { actionName, actions, objName, detail } = this.props;
        actionName = `${actionName}_pre`;
        let action = actions.getIn([objName, actionName]);

        let type = action.get('method');
        let info = action.get('info');
        let metas = info.get('metas');
        this.resetButtonDisabled();
        if (metas) {
            metas.map((v, k) => {
                this.props.fetchMeta(k);
            });
        }

        if (!action) {
            // 这里要做错误处理
            return false;
        }
        let param = action.get('param');

        if (param) {
            param = param.toJS();
        }

        let result = this.fillInDate(param, detail);
        let preRequest = fetchCustomerAction(objName, actionName, type, JSON.stringify(result));
        preRequest().then((res) => {
            let { body } = res;
            let data = body.datas;
            this.setState({data, loading: false, info});
        }, e => {
            console.error('eee', e);
        });
        // console.log("actions.toJS", JSON.stringify(result))
    }

    handleGroupSave(data, objName) {
        let result = [];
        let { info } = this.state;
        let schema = info.getIn(['metas', objName]);

        _.map(data, (item, index) => {
            let tmpResult = {};
            _.map(item, (v, fieldKey) => {
                let target = this.refs[`${objName}_${index}_${fieldKey}`];
                if (target && target.getValue) {
                    tmpResult[fieldKey] = formatValueBySchema(target.getValue(), schema.get(fieldKey));
                }
            });
            result.push(tmpResult);
        });
        return result;
    }
    handleRequestCommit() {
        this.setState({
            loading: false,
            errorMessages: []
        });
        let { data, info } = this.state;
        let { objName, actions, actionName, detail } = this.props;
        detail = isImmutable(detail) ? detail.toJS() : detail;

        let params = {};

        actionName = `${actionName}_commit`;
        let action = actions.getIn([objName, actionName]);
        let type = action.get('method');

        _.map(data, (v, key) => {
            params[key] = this.handleGroupSave(v, key);
        });
        params[objName] = [
            {
                id: detail.id
            }
        ];

        let validList = {};

        // 需要验证的对象数组
        let validObjArray = _.keys(data);
        validObjArray.forEach(v => {
            let schema = info.getIn(['metas', v]);
            schema = filterWriteAble(schema);
            schema = schema.toArray ? schema.toArray() : schema;
            // 验证返回的数组是否有必填字段为空的
            let validArray = validation(schema, params[v][0]);
            if (_.isArray(validArray) && validArray.length > 0) {
                validList[v] = validArray;
            }
        });
        if (!_.isEmpty(validList)) {
            this.setState({
                requirList: validList
            });
        } else {
            let Request = fetchCustomerAction(objName, actionName, type, JSON.stringify({datas: params}));
            this.setState({
                disabled: true
            }, () => {
                Request().then(() => {
                    this.resetState();
                    notify.add('转化成功');
                    this.closeModal();
                    // 线索转化成功后跳转到线索列表页
                    browserHistory.push('/sObject/Leads');
                }, error => {
                    let { fields } = error;
                    if (fields) {
                        this.setState({errorMessages: fields});
                    }
                    this.resetButtonDisabled();
                    ErrorNotify(error);
                });
            });
        }
    }

    handleCancleClick() {
        this.resetState();
    }

    // 转化
    _renderEditItem(value, schema, index, objName) {
        let { errorMessages } = this.state;
        let Editor = this.BaseEditor;
        let errorMsg = '';
        let requirList = this.state.requirList;
        if (requirList[objName]) {
            let requireObj = requirList[objName];
            _.forEach(requireObj, v => {
                if (schema.get('name') === v){
                    errorMsg = '该字段为必填字段';
                }
            });
        }

        errorMessages.forEach(v => {
            if (schema.get('name') === v.position){
                errorMsg = v.msg;
            }
        });

        return (
            <div className="mcds-input__container" key={index}>
                <FieldEditor
                    ref={index}
                    errorMsg={errorMsg}
                    schema={schema}
                    value={value}
                    Editor={Editor} />
            </div>
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


        return (
            <div className="mcds-layout__column mcds-m__b-20" key={listIndex}>
                {column}
            </div>
        );
    }

    // 渲染一个对象的数据
    // data是一个对象的数据数组
    _renderGroup(data, objName) {
        let { info } = this.state;
        let schema = info.getIn(['metas', objName]);
        let components = [];
        let order = schema.toArray().map((val) => val.get('name'));
        // 从order中过滤得到必填字段
        let required = _.filter(order, (k) => {
            if (!schema.getIn([k, 'nullable'])) {
                return true;
            }
        });
            // 从order过滤得到非必填字段
        let other = _.filter(order, (k) => {
            if (schema.getIn([k, 'nullable'])) {
                return true;
            }
        });
        order = required.concat(other);
        // 再统一从order中过滤掉不应该显示的字段
        order = _.filter(order, (k) => {
            if (!checkIsSystemField(k) && schema.getIn([k, 'writable']) && schema.getIn([k, 'readable'])) {
                return true;
            }
        });
        order.forEach((key) => {
            _.map(data, (item, index) => {
                let nullable = schema.getIn([key, 'nullable']) || false;
                if (!nullable && !item.hasOwnProperty(key)) {
                    item[key] = null;
                }
                components.push(
                    this._renderEditItem(item[key], schema.get(key), `${objName}_${index}_${key}`, objName)
                );
            });
        });
        components = spliteArrayPerTwo(components);

        let editArea = _.map(components, (fieldsColumn, listIndex) => {
            return this._renderColumn(fieldsColumn, listIndex);
        });
        let displayName = this.props.meta.getIn([objName, 'display_name']) || objName;
        return (
            <div key={objName} className={style['base-modal__convert-group']}>
                <label className="convert-title">{displayName}</label>
                <div className="convert-group">
                    {editArea}
                </div>
            </div>
        );
    }
    renderColumns() {
        let { data, loading } = this.state;
        if (loading) {
            return (
                <div className="demo mcds-layout__row mcds-layout__middle mcds-layout__center" style={{height: '50%'}}>
                    <div className="mcds-layout__item-12" style={{marginTop: '40px'}}>
                        <Loading theme="logo" model="small" />
                    </div>
                </div>
            );
        }
        let columns = _.map(data, (v, key) => {
            return this._renderGroup(v, key);
        });
        return (
            <div>{columns}</div>
        );
    }

    resetState(){
        this.setState({
            info: {},
            loading: true,
            error: null,
            data: null,
            title: null,
            requirList: {},
            errorMessages: []
        });
    }
    resetButtonDisabled() {
        setTimeout(() => {
            this.setState({
                disabled: false
            });
        }, 300);
    }
    renderTriggerButton() {
        let { trigger } = this.props;
        let newTrigger = React.cloneElement(trigger, { onClick: ::this.handleRequestPre});
        return newTrigger;
    }

    render() {
        let trigger = this.renderTriggerButton();
        let body = this.renderColumns();
        let { title } = this.state;
        return (
            <ModalTrigger>
                {trigger}
                <Modal className={classnames('mcds-modal__w-820', style['base-modal__convert'])} ref="modal">
                    <ModalHeader>
                        <i className="mcds-modal__close mcds-icon__close-line-20 close" />
                        <p className="mcds-modal__title">

                            {
                                title ? title : '  新建xxx'

                            }
                        </p>
                    </ModalHeader>
                    <ModalBody>
                        {body}
                    </ModalBody>
                    <ModalFoot>
                        <div className="mcds-layout__column mcds-layout__right">
                            <span ref="handleClose" className="close" />
                            <Button className="mcds-button__neutral mcds-btn__right close" onClick={::this.handleCancleClick}>
                                取消
                            </Button>
                            <Button
                                disabled={this.state.disabled}
                                className="mcds-button__brand"
                                onClick={::this.handleRequestCommit}>
                                保存
                            </Button>
                        </div>
                    </ModalFoot>
                </Modal>
            </ModalTrigger>
        );
    }

}

ConvertModal.contextTypes = {
    router: PropTypes.object.isRequired
};

ConvertModal.defaultProps = {
    success: () => {},
    fail: () => {}
};

export default connect(
    (state) => ({
        actions: state.getIn(['standardObject', 'action']),
        meta: state.getIn(['standardObject', 'meta'])
    }),
    dispatch => bindActionCreators({ fetchMeta }, dispatch)
)(ConvertModal);
