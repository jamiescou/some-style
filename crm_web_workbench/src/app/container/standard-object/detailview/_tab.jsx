import _ from 'lodash';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import React, { Component } from 'react';

import { validation } from 'utils/validate-value';
import ErrorNotify from 'container/share/error/error-notify';
import { BuildFieldDependency } from '../../share/base-field-editor';
import { updateObject } from 'redux/reducers/standard-object/detailview/data';
import { formatValueBySchema, filterFormatValueByScheme} from 'utils/format-value';
import { checkIsSystemField, checkField, checkEditable, filterWriteAble } from '../build-field';

import { fetchFields } from 'redux/reducers/vetting/listview';

import ActivityLine from './_activity-line';
import EditItem from './edit-item/detail-edit';
import ActivityRecord from './_activity-record';

import {
    Button,
    Tab,
    TabItem,
    TabContent,
    notify
} from 'carbon';

import { approval } from '../../__base/approval';

import style from 'styles/modules/standard-object/index.scss';
import styles from 'styles/modules/standard-object/require-style.scss';

class ComplexTab extends Component {
    static propTypes = {};

    constructor(props){
        super(props);
        this.state = {
            tabIndex: 'B',
            // 是否进入详细信息 全部编辑的模式
            editAll: false,
            // 进入编辑模式的 条目
            editItems: new Set(),
            requirList: []
        };
        let { objConfig, objName } = props;
        this.BuildEditor = BuildFieldDependency(EditItem, objConfig.get(objName));
    }
    componentDidMount() {
        let { objName, id } = this.context.router.params;
        this.props.fetchFields(objName, id);
    }
    shouldComponentUpdate() {
        return true;
    }
    /* componentWillUpdate(nextProps, nextState) {
        // let state = this.state;
        // this.setState({...state});
    } */

    /**
     * 压入可编辑的条目 // 暂时key不传入.
     * @param  {[type]} key [key 可选项,如果不传,默认填写所有]
     * @return {[type]}     [description]
     */
    pushEditItems(key) {
        let { data } = this.props;
        let { editItems } = this.state;
        if (!key) {
            data.map((v, i) => {
                try {
                    // let { writable } = schema.get(i);
                    // if (writable) {
                    editItems.add(i);
                    // }
                } catch (e) {
                    console.warn('error in map,', i);
                }

            });
        } else {
            editItems.add(key);
        }
        this.setState({editItems});
    }
    /**
     * 弹出可编辑的条目
     * @param  {[type]} key [key 可选项,如果不传,默认填写所有]
     * @return {[type]}     [description]
     */
    popEditItem(key) {
        let { editItems } = this.state;
        if (key) {
            editItems.delete(key);
        } else {
            editItems.clear();
        }

        this.setState({editItems});
    }

    onEditBlur(key) {
        let result = {};
        let { schema, data } = this.props;
        let { objName, id } = this.context.router.params;
        let editItemNewValue = this.refs[key].getValue();

        result[key] = formatValueBySchema(editItemNewValue, schema.get(key));
        result = filterFormatValueByScheme(result, schema);
        result.version = data.get('version');
        // 请求失败code为103133是需要审批
        let paramObj = {objName: objName, objId: id, owner: data.get('owner'), page: 'detail', action: 'update'};
        this.props.updateObject(objName, id, result)
            .then(() => {
                notify.add('修改成功');
            }, error => {
                if (error.code === 103133) {
                    approval('update', paramObj, result);
                } else {
                    ErrorNotify(error);
                }
            });
    }

    /* onEnterKeyDown(key) {

    } */

    handleChangeAllEditors(v) {
        this.pushEditItems();
        this.setState({
            tabIndex: 'B',
            editAll: true,
            active: v
        });
    }

    handleCancleEditAll() {
        let { editAll, editItems } = this.state;
        editAll = false;
        editItems.clear();
        this.setState({
            editAll,
            editItems,
            requirList: []
        });
    }

    handleSaveAllEditors() {
        let result = {};
        let { editItems } = this.state;
        let { schema, data } = this.props;
        let { objName, id } = this.context.router.params;
        for (let key of editItems.keys()) {
            try {
                let writable = schema.getIn([key, 'writable']) || false;
                // let readable = schema.getIn([key, 'readable']) || false;

                if (writable && this.refs[key]) {
                    let newValue = this.refs[key].getValue();
                    result[key] = formatValueBySchema(newValue, schema.get(key));
                }
            } catch (e) {
                console.error("handleSaveAllEditors's error in", key, e.message);
            }

        }

        schema = filterWriteAble(schema);
        schema = checkField(schema, 'all');
        result = filterFormatValueByScheme(result, schema);
        result.version = data.get('version');
        let validList = validation(schema, Object.assign(data.toJS(), result));

        if (validList.length > 0){
            this.setState({
                requirList: validList
            });
        } else {
            this.setState({
                requirList: []
            });
            // 请求失败code为103133是需要审批
            let paramObj = {objName: objName, objId: id, owner: data.get('owner'), page: 'detail', action: 'update'};
            this.props.updateObject(objName, id, result)
                .then(() => {
                    notify.add('修改成功');
                    this.handleCancleEditAll();
                }, errorMeg => {
                    if (errorMeg.error.code === 103133) {
                        approval('update', paramObj, result);
                    } else {
                        ErrorNotify(errorMeg);
                    }
                });
        }

    }

    renderLeftTab(state = this.state) {
        let { data, schema, config, fields } = this.props;
        let { objName } = this.context.router.params;
        let { editItems } = this.state;
        let BuildEditor = this.BuildEditor;
        // 需要编辑的字段,统一生成为一个数组
        let buildEditItem = [];
        let EditRowComponents = [];
        // let newData = [];
        // data遍历的时候内部index数字索引
        let index = 0;
        let order = config.get('order');
        if (!order || (order && order.size ===0)) {
            order = _.map(schema.toJS(), v => v.name);
        } else {
            order = order.toJS();
        }
        // 排除正在审批的字段
        if (fields && fields.get('FieldList')) {
            let fieldList = fields.get('FieldList').map(item => { return item.split('.')[0]; });
            fieldList = [...new Set(fieldList)];
            order = _.difference(order, fieldList);
        }
        _.map(order, (v, i) => {
            if (checkIsSystemField(i)) {
                return null;
            }
            // 在编辑状态下,过滤掉不可编辑的项目
            let status = editItems.has(v) ? 'edit' : 'common';
            let className = index % 2 ? 'mcds-m__l-15' : 'mcds-m__r-15';
            let requirList = this.state.requirList;
            let name = schema.get(v).get('name');
            let requiredStyle = null;
            let errorStyle = false;
            _.map(requirList, val => {
                if ((name === val) && (status === 'edit' )){
                    errorStyle = true;
                    requiredStyle = <span className={`mcds-span__required ${styles.requir}`}>该字段为必填字段</span>;
                }
            });
            let active = this.state.active === v;
            buildEditItem.push(
                <div className="mcds-layout__item-6 mcds-input__container" key={v}>
                    <BuildEditor
                        active={active}
                        error={errorStyle}
                        status={status}
                        ref={v}
                        schema={schema.get(v)}
                        className={className}
                        onEditClick={this.handleChangeAllEditors.bind(this, v)}
                        value={data.get(v)}
                        objName={objName}
                        data={data}
                        checkPermission={checkEditable(data)} />
                    {requiredStyle}
                </div>
            );
            index++;
        });
        index = 0;
        if (buildEditItem.length === 0) {
            EditRowComponents.push(
                <div className="mcds-layout__row mcds-layout__middle mcds-layout__center">
                    <img src="/public/img/img-no-result.svg" />
                    <div className="mcds-text__size-14 mcds-text__weak mcds-m__t-30">哦哦，所有字段都在审批中...</div>
                </div>
            );
        } else {
            for (let i =0; i<buildEditItem.length; i++ ){
                if (i%2 === 0 ) {
                    EditRowComponents.push(
                        <div className="mcds-layout__column mcds-p__t-20" key={i}>
                            {buildEditItem[i]}
                            {buildEditItem[i+1] ? buildEditItem[i+1] : ''}
                        </div>
                    );
                }
            }
        }

        return (
            <div className={classnames('mcds-container mcds-bg__weak', style.tab)} style={{padding: '20px', height: '100%'}}>
                <Tab className="mcds-tab__default">
                    {/* <TabItem className={classnames({'mcds-tab__active': state.tabIndex === 'A'})} onClick={() => { this.setState({tabIndex: 'A'}); }}>
                        活动记录
                    </TabItem> */}
                    <TabItem className={classnames({'mcds-tab__active': state.tabIndex === 'B'})} onClick={() => { this.setState({tabIndex: 'B'}); }}>
                        详细信息
                    </TabItem>
                    {/* <TabContent className={classnames('mcds-tab-scoped__padding', {'mcds-tab__active': state.tabIndex === 'A'})}>
                        {this.renderActivityRecord()}
                        {this.renderActivityLine()}
                    </TabContent> */}
                    <TabContent
                        className={classnames('mcds-tab-scoped__padding mcds-p__t-0', {'mcds-tab__active': state.tabIndex === 'B', 'mcds-container__shadow mcds-m__t-20 mcds-bg': state.editAll})}>
                        <button
                            className="hide mcds-passive__button"
                            id="tabEditAll"
                            onClick={::this.handleChangeAllEditors}>
                            编辑所有的字段
                        </button>
                        <div className="mcds-p__r-20 mcds-p__l-20">
                            {EditRowComponents}
                        </div>
                        <div
                            className={classnames('mcds-bg__weak mcds-text__center mcds-p__t-12 mcds-p__b-12 mcds-m__t-30', {
                                hide: !state.editAll
                            })}>
                            <Button className="mcds-button__neutral mcds-btn__right" onClick={::this.handleCancleEditAll}>
                                取消
                            </Button>
                            <Button className="mcds-button__brand" onClick={::this.handleSaveAllEditors}>
                                保存
                            </Button>
                        </div>
                    </TabContent>
                </Tab>
            </div>
        );
    }

    // 活动记录的组件
    renderActivityRecord(){
        return <ActivityRecord />;
    }
    // 活动 筛选时间线的组件
    renderActivityLine() {
        return <ActivityLine />;
    }

    render() {
        return this.renderLeftTab();
    }
}
ComplexTab.propTypes = {
    data: PropTypes.object, // 当前标准对象数据
    fields: PropTypes.object, // 该条数据正在审批的字段
    schema: PropTypes.object,
    objName: PropTypes.string.isRequired,
    config: PropTypes.object,
    updateObject: PropTypes.func,
    objConfig: PropTypes.object,
    fetchFields: PropTypes.func // 获取正在审批的字段
};
ComplexTab.contextTypes = {
    router: PropTypes.object.isRequired
};

export default connect(
    state => ({
        objConfig: state.getIn(['standardObject', 'layout', 'objConfig']),
        fields: state.getIn(['vetting', 'listview', 'fields'])
    }),
    dispatch => bindActionCreators({ updateObject, fetchFields }, dispatch)
)(ComplexTab);
