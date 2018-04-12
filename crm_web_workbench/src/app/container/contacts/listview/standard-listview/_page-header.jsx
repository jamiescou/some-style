/* eslint-disable react/no-find-dom-node */
import _ from 'lodash';
import I from 'immutable';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import { browserHistory } from 'react-router';
import classnames from 'classnames';

import ReactDOM from 'react-dom';

import Edit from 'components/filter/edit';
import Create from 'components/filter/create';
import Search from 'components/filter/search';
import CreateModal from '../../modal/create';
import ViewFiterDropdown from './view-filter-dropdown';

import ErrorNotify from 'container/share/error/error-notify';
import { creatAlldata } from 'redux/reducers/standard-object/listview/list';
import {createFilterData, updateFilterData, fetchFilter, deleteFilter } from 'redux/reducers/standard-object/listview/filter';
import { clearCheckedAll } from 'redux/reducers/standard-object/listview/setting-hash';
import {
    Button,
    ButtonIcon,
    ButtonGroup,
    notify
} from 'carbon';

let style = require('styles/modules/standard-object/index.scss');
// 视图筛选器的key值映射
let mapInfo = {
    display_name: '视图名称',
    filter_from: '显示数据',
    visible_to: '可见权限',
    logical_relation: '筛选逻辑',
    expressions: '筛选条件',
    field: '字段名称',
    operator: '运算符',
    operands: '字段值',
    country: '国家',
    state: '省份',
    city: '城市',
    street: '街道',
    symbol: '货币类型',
    value: '货币数值',
    filename: '文件名',
    size: '文件大小',
    url: '文件地址',
    bool: true
};

class PageHeader extends Component {
    constructor(props){
        super(props);
        this.state = {
            // 是否显示筛选面板
            showFilter: false,
            filter: 'searchFilter'
        };
    }

    componentWillMount(){
        let {parentObjName, id, relatedKey} = this.context.router.params;
        if (parentObjName && id && relatedKey){
            this.props.fetchMeta(parentObjName);
            this.props.fetchObj(parentObjName, id);
        }
    }

    componentDidMount() {
        let { info } = this.props;
        if (info && info.action === 'create') {
            let create = ReactDOM.findDOMNode(this.refs.createModal);
            create.click();
        }
    }

    getViewFilterFromQuery() {
        let view_filter = this.context.router.location.query.view_filter;

        try {
            return view_filter ? JSON.parse(view_filter) : null;
        } catch (e) {
            return null;
        }
    }

    //  创建视图
    _createViewFilter(){
        this.setState({
            filter: 'createFilter'
        }, () => {
            this.showFilterPanel();
        });
    }

    // 编辑视图
    _editViewFilter(){
        let view_filter = this.getViewFilterFromQuery();
        if (view_filter && view_filter.id) {
            this.setState({
                filter: 'editFilter'
            }, () => {
                this.showFilterPanel();
            });
        }
    }

    // 下拉列表点击默认筛选视图
    _handleDefaultFilter(){
        let { objName } = this.props;
        browserHistory.push({ pathname: `/contacts/${objName}`});
        this.hideFilterPanel();
    }

    // 点击筛选器
    _handleFilter(){
        this.setState({
            filter: 'searchFilter'
        }, () => {
            if (this.state.showFilter) {
                this.hideFilterPanel();
            } else {
                this.showFilterPanel();
            }
        });
    }

    // 下拉列表切换到当前点击视图
    _handleNowView(key){
        let { filter, queryParam, objName }= this.props;
        let send_view_filter = {};
        filter.get('view_filters').map((v, k) => {
            if (k === key ) {
                send_view_filter.filter_from = v.get('filter_from');
                send_view_filter.filter = v.get('filter');
                send_view_filter.id = key;
                queryParam.view_filter = JSON.stringify(send_view_filter);
                delete queryParam.load;
                delete queryParam.offset;
                // 清除表格的全选的hash数据
                this.props.clearCheckedAll();
                browserHistory.push({ pathname: `/contacts/${objName}`, query: queryParam});
                this.hideFilterPanel();
            }
        });
    }

    _handleDeleteCurrentFilterSuccess(res) {
        let view_filter = this.getViewFilterFromQuery();
        if (view_filter && view_filter.id) {
            this.setState({
                showFilter: false
            }, () => {
                let { objName } = this.props;
                this.props.deleteFilter(res);
                notify.add('操作成功');
                browserHistory.push({ pathname: `/contacts/${objName}`});
            });
        }
    }

    // 打开筛选器面板
    showFilterPanel(){
        if (this.state.showFilter) {
            this.hideFilterPanel();
        }
        this.setState({
            showFilter: true
        });
    }

    // 关闭筛选器面板
    hideFilterPanel(){
        this.setState({
            showFilter: false
        });
    }

    // 验证视图筛选器是否为空
    validateFilter(data){
        if (!mapInfo.bool) { return mapInfo.bool; }
        _.forEach(data, (val, key) => {
            if (_.isArray(val) || _.isObject(val)){
                if (_.isEmpty(val)) {
                    mapInfo.bool = false;
                    notify.add({message: `${mapInfo[key]}不能为空`, theme: 'warning'});
                    return;
                }
                this.validateFilter(val);
            }
            let newVal = _.isString(val) ? val.replace(/'/g, '') : val;
            if (newVal === 'null' || newVal === 'undefined' || !_.trim(newVal)){
                notify.add({message: `${mapInfo[_.isString(key) ? key : 'operands']}不能为空`, theme: 'warning'});
                mapInfo.bool = false;
                return;
            }
        });
        return mapInfo.bool;
    }

    // 复合字段的处理
    disposeComplexField(data){
        let expressions = data.filter.expressions;
        _.map(expressions, (val) => {
            if (val.type === 'address') {
                val.field = val.field + '.state';
                val.operands = [val.operands[0]];
            }
            if (val.type === 'currency') {
                let currency = val.operands[0];
                val.field = val.field + '.value';
                val.operands = ["'" + currency.value + "'"];
            }
            if (val.type === 'file') {
                let file = val.operands[0];
                val.field = val.field + '.filename';
                val.operands = ["'" + file.filename + "'"];
            }
            delete val.type;
        });
        data.filter.expressions = expressions;
        return data;
    }

    // 提交数据
    _handleCommit(data){
        let { objName } = this.props;
        let now_view_filter = this.context.router.location.query.view_filter;
        now_view_filter = now_view_filter ? JSON.parse(now_view_filter) : '';
        let newData = data.toJS();
        // 视图筛选器非空信息验证
        mapInfo.bool = true;
        let flag = this.validateFilter(newData);
        if (!flag) { return; }
        newData = this.disposeComplexField(newData);
        switch (this.state.filter){
        case 'createFilter' :
            // 创建并保存
            this.props.createFilterData(objName, newData).then((res) => {
                let {id, view_filter} = res.result.body;
                this.fetchQueryData(view_filter, id);
            }, response => ErrorNotify(response));
            break;
        case 'editFilter' :
            // 编辑时保存并筛选 调用update接口
            this.props.updateFilterData(objName, newData, now_view_filter.id).then((res) => {
                let {id, view_filter} = res.result.body;
                this.fetchQueryData(view_filter, id);
            }, response => ErrorNotify(response));
            break;
        case 'searchFilter' :
            // 走创建视图的接口
            this.props.createFilterData(objName, newData).then((res) => {
                let {id, view_filter} = res.result.body;
                this.fetchQueryData(view_filter, id);
            }, response => ErrorNotify(response));
            break;
        default :
            throw new Error(`No matches found about ${this.state.filter}`);
        }
    }

    // 获取列表数据 query接口
    fetchQueryData(view_filter, id){
        let {objName, queryParam} = this.props;
        let send_view_filter = {};
        send_view_filter.filter_from = view_filter.filter_from;
        send_view_filter.filter = view_filter.filter;
        send_view_filter.id = id;
        queryParam.view_filter = JSON.stringify(send_view_filter);
        delete queryParam.load;
        delete queryParam.offset;
        browserHistory.push({ pathname: `/contacts/${objName}`, query: queryParam});
        this.hideFilterPanel();
    }

    // 仅仅筛选走这个接口
    hangJustFilter(data){
        let { objName, queryParam } = this.props;
        let newData = data.toJS();
        // 验证筛选器的值是否为空
        mapInfo.bool = true;
        let flag = this.validateFilter(newData);
        if (!flag) { return; }
        newData = this.disposeComplexField(newData);
        let view_filter = this.context.router.location.query.view_filter;
        view_filter = view_filter ? JSON.parse(view_filter) : '';
        if (view_filter && view_filter.id){
            newData.id = view_filter.id;
        }
        queryParam.view_filter= JSON.stringify(newData);
        delete queryParam.load;
        delete queryParam.offset;
        browserHistory.push({ pathname: `/contacts/${objName}`, query: queryParam});
        this.hideFilterPanel();
    }

    // 生成 右上角的 buttonGroup;
    renderOptionalButtons(props = this.props) {
        // 临时从props上去获取.以后可能换成函数去获取
        let { objName } = props;
        let configs = props.config;
        let optionalButtons = (config = configs) => {
            let optionalButton = config.get('optionalButtons');
            if (!optionalButton) {
                return false;
            }
            return optionalButton.toArray().map((v, i) => {
                let type = v.get('type');
                if (type === 'modal') {
                    let operation = v.get('operation');
                    switch (operation){
                    case 'create':
                        let order = v.get('order');
                        return (<CreateModal
                            fromPage="detail"
                            ref="createModal"
                            success={this.creatSuccess.bind(this)}
                            key={i}
                            order={ order ? order.toJS() : null }
                            trigger={<Button className="mcds-button__item">邀请</Button>}
                            className="mcds-button__item"
                            objName={objName} />);
                    default:
                        console.log(`not found ${operation} about modal operation`);
                    }
                }
            });
        };
        return <ButtonGroup>{optionalButtons()}</ButtonGroup>;
    }

    creatSuccess (objName, data) {
        this.props.creatAlldata(objName, data);
    }

    // schema过滤一些字段和值
    filterSchemaField(schema) {
        let newSchema = schema;
        schema.map((val, key) => {
            if (val.get('name') === 'version'){
                newSchema = schema.delete(key);
            }
            if (val.get('type') === 'geolocation') {
                newSchema = schema.delete(key);
            }
            if (val.get('default_value')) {
                newSchema = schema.deleteIn([key, 'default_value']);
            }
        });
        return newSchema;
    }

    // 渲染时对复合字段进行处理
    disposeRenderComplexField(filter) {
        let newFilter = filter.toJS ? filter.toJS() : filter;
        let expressions = newFilter.filter.expressions;
        _.forEach(expressions, val => {
            let reg = /\./ig;
            let valArr = val.field.split(reg);
            if (valArr && valArr.length > 1) {
                val.field = valArr[0];
            }
        });
        newFilter.filter.expressions = expressions;
        return I.fromJS(newFilter);
    }

    // 渲染 创建/编辑 组件
    renderFilterComponent() {
        let filter = null;
        let schema = this.filterSchemaField(this.props.schema);
        let pageTitle = this.props.meta ? this.props.meta.get('display_name') : '';
        let view_filter = this.context.router.location.query.view_filter;
        view_filter = view_filter ? JSON.parse(view_filter) : '';
        switch (this.state.filter){
        case 'createFilter' :
            return (<Create
                onCancel={this.hideFilterPanel.bind(this)}
                onCommit={this._handleCommit.bind(this)}
                pageTitle={pageTitle}
                schema={schema} />);
        case 'editFilter' :
            filter = this.props.filter.get('view_filters').get(view_filter.id);
            filter = this.disposeRenderComplexField(filter);
            return (<Edit
                onCancel={this.hideFilterPanel.bind(this)}
                onCommit={this._handleCommit.bind(this)}
                filter={filter}
                pageTitle={pageTitle}
                schema={schema} />);
        case 'searchFilter':
            filter = I.fromJS(view_filter);
            // 只要路由里边没有view_filter就手动创建一个
            if (!view_filter) {
                filter = {
                    filter_from: 'private', // 有效值: "private" 或 "all"
                    filter: {
                        logical_relation: '',
                        expressions: []
                    }
                };
                filter = I.fromJS(filter);
            }
            filter = this.disposeRenderComplexField(filter);
            return (<Search
                onCancel={this.hideFilterPanel.bind(this)}
                onFilterCommit={this.hangJustFilter.bind(this)}
                onCommit={this._handleCommit.bind(this)}
                filter={filter}
                pageTitle={pageTitle}
                schema={schema} />);
        default :
            throw new Error('未找到匹配项');
        }
    }

    renderCount() {
        let { data, queryParam } = this.props;
        let result = 0;
        if (data) {
            if (data.size >= 50 && !queryParam.load) {
                result = data.size + '+ ';
            } else {
                result = data.size;
            }
        }
        return result;
    }

    // 判断是否从详情页查看全部进入去掉默认视图
    renderLeftHeader() {
        let pageTitle = this.props.meta ? this.props.meta.get('display_name') : '';
        return (<ViewFiterDropdown
            objName={this.context.router.params.objName}
            pageTitle={pageTitle}
            filter={this.props.filter}
            onSelectView={::this._handleNowView}
            onEdit={::this._editViewFilter}
            onCreate={::this._createViewFilter}
            onDelete={::this._handleDeleteCurrentFilterSuccess}
            onSelectDefault={::this._handleDefaultFilter}
            view_filter={this.getViewFilterFromQuery()}
            view_filters={this.props.filter.get('view_filters')} />);
    }

    renderPageHeader() {
        let {schema, queryParam} = this.props;

        return (
            <div className={classnames('mcds-pageheader', style.relative)}>
                <div className="mcds-grid mcds-pageheader__header">
                    <div className="mcds-pageheader__header-left">
                        <div className="mcds-media">
                            <div className="mcds-m__r-30 mcds-p__t-6">
                                <div className="mcds-pageheader__header-left-icon" />
                            </div>
                            { this.renderLeftHeader() }
                        </div>
                    </div>
                    <div className="mcds-pageheader__header-right">
                        {::this.renderOptionalButtons()}
                    </div>
                </div>
                <div className="mcds-grid mcds-pageheader__body">
                    <ButtonIcon className="mcds-button__neutral mcds-button-icon__more" onClick={::this._handleFilter} icon="mcds-icon__funnel-solid-14" />
                </div>
                <div className="mcds-grid mcds-pageheader__footer">
                    <div className="mcds-pageheader__footer-left">
                        <ul className="mcds-list__horizontal mcds-text__weak mcds-text__size-12">
                            <li className="mcds-list__item">{::this.renderCount()}个项目</li>
                            <li className="mcds-list__item mcds-p__l-7 mcds-p__r-7">•</li>
                            <li className="mcds-list__item">按{queryParam.order_by ? schema.get(queryParam.order_by).get('display_name') : '最新修改时间'}排序</li>
                            <li className="mcds-list__item mcds-p__l-7 mcds-p__r-7">•</li>
                            <li className="mcds-list__item">最后更新</li>
                            <li className="mcds-list__item mcds-p__l-5">{queryParam.update_date}</li>
                        </ul>
                    </div>
                </div>
            </div>
        );
    }

    render() {
        return (
            <div>
                {this.renderPageHeader()}
                {this.state.showFilter ? this.renderFilterComponent() : null }
            </div>
        );
    }
}

PageHeader.propTypes = {
    config: PropTypes.object,
    objName: PropTypes.string,
    data: PropTypes.object,
    queryParam: PropTypes.object,
    meta: PropTypes.object,
    filter: PropTypes.object,
    deleteFilter: PropTypes.func,
    updateFilterData: PropTypes.func,
    createFilterData: PropTypes.func,
    creatAlldata: PropTypes.func,
    schema: PropTypes.object,
    clearCheckedAll: PropTypes.func,
    fetchMeta: PropTypes.func,
    fetchObj: PropTypes.func,
    info: PropTypes.object
};

PageHeader.contextTypes = {
    router: PropTypes.object
};

export default connect(
    state => ({
        metaMap: state.getIn(['standardObject', 'meta']),
        parentDetailData: state.getIn(['standardObject', 'detailview', 'data']),
        info: state.getIn(['vetting', 'listview', 'info']) // 审批页面的信息，取来是为了用action区分弹update的modal还是create的modal
    }),
    dispatch => bindActionCreators({ creatAlldata, createFilterData, updateFilterData, fetchFilter, deleteFilter, clearCheckedAll }, dispatch)
)(PageHeader);

