/* eslint-disable react/no-find-dom-node */
import _ from 'lodash';
import I from 'immutable';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import { browserHistory } from 'react-router';
import classnames from 'classnames';


import Create from 'components/filter/create';
import ViewFiterDropdown from 'container/standard-object/listview/standard-listview/view-filter-dropdown';

import ErrorNotify from 'container/share/error/error-notify';
import { createFilterData } from 'redux/reducers/standard-object/listview/filter';
import { clearCheckedAll } from 'redux/reducers/standard-object/listview/setting-hash';
import {
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
        browserHistory.push({ pathname: `/sObject/${objName}`});
        this.hideFilterPanel();
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
                delete queryParam.offset;
                // 清除表格的全选的hash数据
                this.props.clearCheckedAll();
                browserHistory.push({ pathname: `/sObject/${objName}`, query: queryParam});
                this.hideFilterPanel();
            }
        });
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
        let newData = data.toJS();
        // 视图筛选器非空信息验证
        mapInfo.bool = true;
        let flag = this.validateFilter(newData);
        if (!flag) { return; }
        newData = this.disposeComplexField(newData);
        this.props.createFilterData(objName, newData).then((res) => {
            let {id, view_filter} = res.result.body;
            this.fetchQueryData(view_filter, id);
        }, response => ErrorNotify(response));
    }

    // 获取列表数据 query接口
    fetchQueryData(view_filter, id){
        let {objName, queryParam} = this.props;
        let send_view_filter = {};
        send_view_filter.filter_from = view_filter.filter_from;
        send_view_filter.filter = view_filter.filter;
        send_view_filter.id = id;
        queryParam.view_filter = JSON.stringify(send_view_filter);
        delete queryParam.offset;
        browserHistory.push({ pathname: `/sObject/${objName}`, query: queryParam});
        this.hideFilterPanel();
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
        let schema = this.filterSchemaField(this.props.schema);
        let pageTitle = this.props.meta ? this.props.meta.get('display_name') : '';
        return (<Create
            onCancel={this.hideFilterPanel.bind(this)}
            onCommit={this._handleCommit.bind(this)}
            pageTitle={pageTitle}
            schema={schema} />);
    }

    renderCount() {
        let { data } = this.props;
        let result = 0;
        if (data) {
            if (data.size >= 50) {
                result = data.size + '+ ';
            } else {
                result = data.size;
            }
        }
        return result;
    }

    renderLeftHeader() {
        let pageTitle = this.props.meta ? this.props.meta.get('display_name') : '';
        return (<ViewFiterDropdown
            objName={this.context.router.params.objName}
            pageTitle={pageTitle}
            filter={this.props.filter}
            onSelectView={::this._handleNowView}
            onCreate={::this._createViewFilter}
            onEdit={::this._editViewFilter}
            onSelectDefault={::this._handleDefaultFilter}
            view_filter={this.getViewFilterFromQuery()}
            view_filters={this.props.filter.get('view_filters')}
            model={this.props.model}
            territory_list={this.props.territory_list} />);
    }

    renderPageHeader() {
        let { queryParam } = this.props;
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
                    <div className="mcds-pageheader__header-right" />
                </div>
                <div className="mcds-grid mcds-pageheader__body" />
                <div className="mcds-grid mcds-pageheader__footer">
                    <div className="mcds-pageheader__footer-left">
                        <ul className="mcds-list__horizontal mcds-text__weak mcds-text__size-12">
                            <li className="mcds-list__item">{::this.renderCount()}个项目</li>
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
    objName: PropTypes.string,
    data: PropTypes.object,
    queryParam: PropTypes.object,
    meta: PropTypes.object,
    filter: PropTypes.object,
    createFilterData: PropTypes.func,
    schema: PropTypes.object,
    clearCheckedAll: PropTypes.func,
    fetchMeta: PropTypes.func,
    model: PropTypes.object,
    territory_list: PropTypes.object
};

PageHeader.contextTypes = {
    router: PropTypes.object
};

export default connect(
    null,
    dispatch => bindActionCreators({ createFilterData, clearCheckedAll }, dispatch)
)(PageHeader);

