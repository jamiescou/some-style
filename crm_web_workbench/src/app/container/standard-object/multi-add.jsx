import React, { Component } from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import classnames from 'classnames';
import PropTypes from 'prop-types';

import I from 'immutable';
import _ from 'lodash';
import ErrorNotify from 'container/share/error/error-notify';
import BuildEditors, { BuildFieldDependency } from 'container/share/base-field-editor';

import { fetchSchema } from 'redux/reducers/standard-object/schema';
import { fetchMeta } from 'redux/reducers/standard-object/meta';
import { createData } from 'redux/reducers/standard-object/listview/list';

import { validation } from 'utils/validate-value';
import { formatValueBySchema, filterFormatValueByScheme } from 'utils/format-value';


import {
    Button,
    ButtonGroup,
    Table,
    Th,
    notify
} from 'carbon';

let style = require('styles/modules/standard-object/index.scss');
let style2 = require('styles/modules/standard-object/multi-add.scss');

@connect(
    state => ({
        schema: state.getIn(['standardObject', 'schema']),
        meta: state.getIn(['standardObject', 'meta'])
    }),
    dispatch => bindActionCreators({fetchSchema, createData, fetchMeta}, dispatch)
)

export default class Home extends Component {
    static propTypes = {
        params: PropTypes.object,
        createData: PropTypes.func,
        router: PropTypes.any,
        fetchSchema: PropTypes.func,
        fetchMeta: PropTypes.func,
        schema: PropTypes.object,
        meta: PropTypes.object
    };
    constructor(){
        super();
        this.state = {
            rowsCount: 3,
            flag: 3,
            rowsData: {
                1: {},
                2: {},
                3: {}
            }
        };
        this.BuildEditor = BuildFieldDependency(BuildEditors);
        this.handleSubmitClick = this.handleSubmitClick.bind(this);
    }

    componentDidMount() {
        let { objName } = this.props.params;
        this.getData(objName);
    }

    getInputData() {
        let schema = this.getFields();
        let params = {};
        let objects = [];
        for (let key in this.state.rowsData) {
            _.map(schema, v => {
                let refName = v.name + key;
                let tmpVal = this.refs[refName].getValue();
                params[v.name] = formatValueBySchema(tmpVal, I.fromJS(v));
            });
            let newParams = filterFormatValueByScheme(params, schema);
            objects.push(newParams);
        }
        return objects;
    }

    // 确认提交 按钮
    handleSubmitClick() {
        let schema = this.getFields();
        let { objName } = this.props.params;
        let leadsObjects = this.getInputData();
        let valid = false;
        _.map(leadsObjects, v => {
            if (validation(schema, v)) {
                valid = true;
                return;
            }
        });
        if (valid) {
            notify.add('操作失败，验证未通过！');
        } else {
            this.props.createData(objName, leadsObjects)
                .then(() => {
                    notify.add('操作成功');
                }, response => ErrorNotify(response));
        }
    }

    getData(objName) {
        if (!objName) {
            console.warn(`the routes must have objName(${objName}) ,but one of them maybe undefined`);
            // 如果用没有有 objName 直接返回到主页
            this.props.router.push('/');
        }
        // loading 状态保持在页面中,每次进入页面重新加载数据,数据 Loading 完了在获取
        Promise.all([
            this.props.fetchSchema(objName),
            this.props.fetchMeta(objName)
        ]).then(() => {
            this.setState({
                loading: false,
                objName
            });
        }, () => {
            notify.add({message: '操作有误', theme: 'error'});
        });
    }

    getFields() {
        let { objName } = this.props.params;
        let leadsSchema = this.props.schema.toJS()[objName];
        let fieldsArr = [];
        for (let key in leadsSchema) {
            if (leadsSchema.hasOwnProperty(key)) {
                fieldsArr.push(leadsSchema[key]);
            }
        }
        let schema = this.filterWriteAble(fieldsArr);
        schema = this.checkField(schema);
        return schema;
    }

    // 获取必填字段
    getRequire(schema){
        let result = [];
        _.map(schema, v => {
            if (!v.nullable) {
                result.push(v);
            }
        });
        return result;
    }

    // 获取需要渲染的字段
    checkField(schema){
        let result = this.getRequire(schema);

        _.map(result, v => {
            delete schema[v.name];
        });
        _.map(schema, v => {
            result.push(v);
        });
        return result;
    }

    // 获取可编辑字段
    filterWriteAble(schema){
        let result = {};
        schema.map(v => {
            if (v.writable){
                result[v.name] = v;
            }
        });
        return result;
    }

    getThClassName(fieldObj) {
        let classNameStr = classnames('mcds-table__width', style2['multi-add__table-th']);
        switch (fieldObj.type) {
        case 'lookup':
        case 'phone':
            classNameStr = classnames(classNameStr, style2['multi-add__table-th2']);
            break;
        case 'address':
        case 'datetime':
            classNameStr = classnames(classNameStr, style2['multi-add__table-th3']);
            break;
        default:
            break;
        }
        return classNameStr;
    }

    handleAddRow() {
        let rowsData = this.state.rowsData;
        let key = this.state.flag + 1;
        rowsData[key] = {};
        this.setState({
            rowsCount: this.state.rowsCount + 1,
            rowsData: rowsData,
            flag: key
        });
    }

    handleReduceRow(rowKey) {
        let rowsData = this.state.rowsData;
        delete rowsData[rowKey];
        this.setState({
            rowsCount: this.state.rowsCount - 1,
            rowsData: rowsData
        });
    }

    buildEditItem(item, rowIndex) {
        let defaultValue = '';
        let Editor = this.BuildEditor;
        return (
            <td>
                <div className="mcds-input__container">
                    <Editor
                        ref={item.get('name') + rowIndex}
                        className=""
                        schema={item}
                        value={defaultValue} />
                </div>
            </td>
        );
    }

    renderPageHeader() {
        let { meta } = this.props;
        let pageTitle = meta.get('display_name') || '线索';

        return (
            <div className={classnames('mcds-pageheader', style.relative)}>
                <div className="mcds-grid mcds-pageheader__header">
                    <div className="mcds-pageheader__header-left">
                        <div className="mcds-media">
                            <div className="mcds-m__r-30 mcds-p__t-6">
                                <div className="mcds-pageheader__header-left-icon" />
                            </div>
                            <div className="mcds-media__body">
                                <div className="mcds-pageheader__header-left-text">
                                    <span className={style2['multi-add__header-lead']}>{pageTitle}</span>
                                    <span className={style2['multi-add__header-arrow']}>{'>'}</span>
                                    <span className={style2['multi-add__header-mylead']}>我的{pageTitle}</span>
                                </div>
                                <Button className={classnames('mcds-text__line-28 mcds-pageheader__title', style2['multi-add__title'])}>批量新建</Button>
                            </div>
                        </div>
                    </div>
                    <div className="mcds-pageheader__header-right">
                        <ButtonGroup>
                            <Button className={classnames('mcds-button__item', style2['multi-add__btn'])} onClick={::this.handleSubmitClick}>新建数据</Button>
                        </ButtonGroup>
                    </div>
                </div>
                <div className={classnames('mcds-grid mcds-pageheader__footer', style2['multi-add__header-footer'])}>
                    <div className="mcds-pageheader__footer-left">
                        <ul className="mcds-list__horizontal mcds-text__weak mcds-text__size-12">
                            <li className="mcds-list__item">{this.state.rowsCount}个待新建项目</li>
                        </ul>
                    </div>
                </div>
            </div>
        );
    }

    renderThead(fields) {
        const ths = (
            fields.map(v => {
                return <Th key={v} className={this.getThClassName(v)}>{v.nullable ? '' : <span className={classnames('mcds-m__r-5', style2['multi-add__table-th-require'])}>*</span>}{v.display_name}</Th>;
            })
        );
        const thead = (
            <thead>
                <tr>
                    <th className={style2['multi-add__table-th-first']}>#</th>
                    {ths}
                    <th className={style2['multi-add__table-th-last']} />
                </tr>
            </thead>
        );
        return thead;
    }

    renderRow(fields, rowIndex) {
        return (
            <tr className={style2['multi-add__tr']} ref={'tr${rowIndex}'} key={rowIndex} id={'tr' + rowIndex}>
                <td>
                    {rowIndex}
                </td>
                {fields.map(field => this.buildEditItem(I.fromJS(field), rowIndex))}
                <td>
                    <div className="mcds-layout__column mcds-layout__right">
                        <span className="mcds-icon__close-line-20" key={rowIndex} onClick={this.handleReduceRow.bind(this, rowIndex)} />
                    </div>
                </td>
            </tr>
        );
    }

    renderTable() {
        let fields = this.getFields();
        let rows = [];
        let rowsData = this.state.rowsData;
        for (let key in rowsData) {
            if (rowsData.hasOwnProperty(key)) {
                rows.push(this.renderRow(fields, key));
            }
        }

        return (
            <Table className="mcds-table-fixed__layout">
                {this.renderThead(fields)}
                <tbody ref="tbody" id="tbody">
                    {rows}
                </tbody>
            </Table>
        );
    }

    render() {
        return (
            <div>
                {this.renderPageHeader()}
                <div className={style2['multi-add__table-wrapper']}>
                    {this.renderTable()}
                </div>
                <p className="mcds-p__l-24 mcds-p__t-23 mcds-text__link">
                    <span className="mcds-icon__left mcds-text__size-15 mcds-icon__add-line-20" />
                    <a href="javascript:;" onClick={::this.handleAddRow}>继续添加</a>
                </p>
            </div>
        );
    }
}
