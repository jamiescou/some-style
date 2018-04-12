/* eslint-disable react/no-find-dom-node */
import _ from 'lodash';
import I from 'immutable';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import React, { Component } from 'react';

import ReactDOM from 'react-dom';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import { browserHistory } from 'react-router';

import DetailPopoverPannel from '../../panel/detail-popover-panel';
import BaseListViewField from '../base-field';

import { BuildNameLinkContext } from '../../get-suit-context';
import { deleteData, batchDeleteList } from 'redux/reducers/standard-object/listview/list';
import { fetchRelatedObjectsData } from 'redux/reducers/standard-object/related-object/data';
import { fetchList, modifydata, removedata } from 'redux/reducers/standard-object/listview/list';
import { settingCheckedAll, clearCheckedAll, handleChecked, deleteHashData } from 'redux/reducers/standard-object/listview/setting-hash';
import ErrorNotify from 'container/share/error/error-notify';

import Bar from '../bar';
import EditModal from '../../modal/update';
import DeleteDataModal from '../../modal/delete';

import {
    DropDown,
    DropDownList,
    DropDownItem,
    TableResize,
    Th,
    DropDownTrigger,
    ButtonSmallIcon,
    notify,
    Checkbox,
    Loading,
    ButtonGroup
} from 'carbon';

let style = require('styles/modules/standard-object/index.scss');

class DataTable extends Component {
    constructor(props){
        super(props);
        this.state = {
            moreLoading: false
        };
    }

    componentDidMount() {
        let { info } = this.props;
        if (info && info.action === 'update') {
            /* eslint-disable no-find-dom-node */
            let edit = ReactDOM.findDOMNode(this.refs.editModal);
            edit.click();
        }
        let elem = this.refs.table_content;
        let body = document.body;
        let loadData = this.refs.table.refs.loadData;
        // let container = this.refs.table_container;
        this._screenHeight(elem, body);
        window.addEventListener('resize', _.debounce(() => {
            this._screenHeight(elem, body);
        }, 300));

        loadData.addEventListener('scroll', _.debounce(() => {
            this._loadData(loadData, body);
        }, 300));
    }

    componentWillUnmount() {
        let loadData = this.refs.table.refs.loadData;
        loadData.removeEventListener('scroll', _.debounce);
        window.removeEventListener('resize', _.debounce);
    }

    _loadData(elem, body) {
        let { objName, queryParam, offset, meta } = this.props;
        let top = elem.scrollTop + elem.offsetHeight;
        let height = elem.scrollHeight;
        let bodyHeight = body.clientHeight - 225;
        if (height - top <= 20 && bodyHeight !== height && offset > 0 && !queryParam.load) {
            queryParam.limit = 50;
            queryParam.offset = offset;
            delete queryParam.load;

            this.props.fetchList(objName, queryParam)
                .then((ret) => {
                    this.props.fetchRelatedObjectsData(meta.toJS(), ret.result.body.objects);
                }, response => {
                    ErrorNotify(response);
                });
        }
    }

    _screenHeight(elem, body) {
        clearTimeout(timer);
        let timer = setTimeout(() => {
            elem.style.height = (body.clientHeight - 225) + 'px';
        }, 100);
    }

    handleAllClick(currentStatus) {
        if (currentStatus === 0) {
            let data = this.props.data.toArray();
            this.props.settingCheckedAll(data);
        } else {
            this.props.clearCheckedAll();
        }
    }
    handleOneClick(dataVal) {
        this.props.handleChecked(dataVal);
    }

    onDelete(deleteObjVal, closeModal) {
        this.props.deleteData(this.props.objName, deleteObjVal.get('id'), deleteObjVal.get('version'))
            .then(() => {
                notify.add('删除成功');
                closeModal();
            }, response => ErrorNotify(response));
    }

    handleSort(field) {
        if (!this.props.fetching) {
            let loadData = this.refs.table.refs.loadData;
            let { queryParam } = this.props;
            let { pathname } = this.context.router.location;
            queryParam.order_by = field;
            queryParam.order_flag = queryParam.order_flag || 'updated_at';
            if (queryParam.order_flag.toLocaleLowerCase() === 'asc') {
                queryParam.order_flag = 'DESC';
            } else {
                queryParam.order_flag = 'ASC';
            }
            delete queryParam.offset;
            delete queryParam.load;
            loadData.scrollTop = 0;
            this.clearCheckedAll();
            browserHistory.push({ pathname, query: queryParam});
        }
    }

    /**
     * 把这个方法单独拉出来,渲染不同类型的字段会有一些判断,在这里处理
     */
    _renderCell(dataVal, field) {
        let { schema, objName } = this.props;

        let context =new BaseListViewField({
            schema: schema.get(field),
            value: dataVal.get(field),
            objName: objName,
            data: dataVal,
            needDetailPopover: true
        }).render();

        if (field === 'name') {
            let trigger = (
                <div className="mcds-truncate">
                    {BuildNameLinkContext(dataVal.get(field), dataVal.get('id'), objName)}
                </div>
            );
            context = (
                <DetailPopoverPannel
                    id={dataVal.get('id')}
                    objName={objName}
                    trigger={trigger} />);
        }

        return <td key={field} className="mcds-truncate">{context}</td>;

    }
    // 判断编辑和删除权限
    buildDropDownArray(objName, id, dataVal) {
        let config = this.props.config;
        let optionalButtons = () => {
            let result = [];
            let optionalButton = config.get('optionalButtons');
            if (!optionalButton) {
                return false;
            }
            result = optionalButton.toArray().map((v, i) => {
                let type = v.get('type');
                if (type === 'modal') {
                    let displayName = v.get('displayName');
                    let operation = v.get('operation');
                    switch (operation){
                    case 'edit':
                        let order = v.get('order') ? v.get('order').toJS() : [];
                        return (
                            <EditModal
                                key={i}
                                id={id}
                                ref="editModal"
                                fromPage="list"
                                value={dataVal}
                                order={order}
                                objName={objName}
                                schema={this.props.schema}
                                success={this.modifySuccess.bind(this)}
                                trigger={<DropDownItem className="close" >{displayName}</DropDownItem>} />
                        );
                    case 'delete':
                        return (
                            <DeleteDataModal
                                id={id}
                                value={dataVal}
                                key={i} objName={objName}
                                success={this.removeSuccess.bind(this)}
                                onDelete={(closeModal) => { this.onDelete(dataVal, closeModal); }}
                                trigger={<DropDownItem className="close">{displayName}</DropDownItem>} />);
                    default:
                        throw new Error(`not found ${operation} about modal operation`);
                    }
                }
            });
            return result;
        };
        return <ButtonGroup>{optionalButtons()}</ButtonGroup>;
    }

    modifySuccess (objName, id, data) {
        this.props.modifydata(objName, id, data);
    }
    removeSuccess (objName, body, data) {
        let id = body.id;
        this.props.removedata(objName, id, data);
        // 这个是删除选中的数据的hash记录
        this.props.deleteHashData(id);
    }

    // 批量删除
    batchDeleteSuccess(data) {
        this.props.batchDeleteList(data);
        this.clearCheckedAll();
        this.fetchListData();
    }

    clearCheckedAll(){
        this.props.clearCheckedAll();
    }

    // 批量转化
    batchTransferSuccess() {
        this.clearCheckedAll();
        this.fetchListData();
    }
    // 调取query获取数据列表
    fetchListData() {
        let { objName, queryParam, meta } = this.props;
        queryParam.limit = 50;
        queryParam.offset = 0;
        delete queryParam.load;

        this.props.fetchList(objName, queryParam)
            .then((ret) => {
                this.props.fetchRelatedObjectsData(meta.toJS(), ret.result.body.objects);
            }, response => {
                this.setState({moreLoading: false});
                ErrorNotify(response);
            });

    }

    _renderRow(_fields, dataVal, id, dataIndex) {
        let objName = this.props.objName;
        let drondwonTriggerArray = this.buildDropDownArray(objName, id, dataVal);
        const dropDown = (
            <td className="mcds-cell__shrink" key={`${id}-${dataIndex}`}>
                <div className="mcds-layout__column pull-right" title={dataVal.get(_fields)}>
                    {
                        drondwonTriggerArray.length !== 0 ? <DropDownTrigger autoCloseTag="close" target="self" placement="bottom-left" synchWidth={false} >
                            <ButtonSmallIcon icon="mcds-icon__triangle-solid-14" />
                            <DropDown className="mcds-dropdown__min-no">
                                <DropDownList>
                                    { drondwonTriggerArray }
                                </DropDownList>
                            </DropDown>
                        </DropDownTrigger> : null
                    }
                </div>
            </td>
        );
        let hashList = this.props.hashList;
        let nowcChecked = hashList.get(id);
        return (
            <tr key={`list-${dataVal.get('id')}-${dataIndex}`} className={nowcChecked ? 'mcds-table__checked' : ''}>
                <td className="mcds-cell__shrink mcds-p__l-30">
                    <span className="mcds-layout__item">{dataIndex + 1}</span>
                </td>
                <td className="mcds-cell__shrink">
                    <Checkbox
                        checked={!!nowcChecked}
                        onChange={this.handleOneClick.bind(this, dataVal)} />
                </td>

                {_fields.map(field => this._renderCell(dataVal, field))}
                {dropDown}
            </tr>
        );
    }

    iconClass(field, order_flag, order_by) {
        let curIcon = null;
        if (order_by === field && order_flag.toLocaleLowerCase() === 'desc') {
            curIcon = 'mcds-icon__arrow-solid-14';
        } else if (order_by === field && order_flag.toLocaleLowerCase() === 'asc') {
            curIcon = 'mcds-icon__arrow-solid-14 mcds-icon__rotate-180';
        } else {
            curIcon = null;
        }

        return curIcon;
    }

    /**
     * 加载更多的时候的 Loading 效果
     * @private
     */
    _renderMoreLoading() {
        if (this.props.loading) {
            return (
                <div id={style.moreLoading}>
                    <Loading theme="logo" model="small" />
                </div>
            );
        }

        return null;

    }

    _renderTableData(data) {
        let _fields = this.props.config.get('fields');
        let trs = null;
        let {order_flag, order_by} = { order_flag: null, order_by: null };

        // 0 未选中  1 部分选中  2 全选
        let status = 0;

        if (data) {
            order_flag = this.props.queryParam.order_flag;
            order_by = this.props.queryParam.order_by;

            let hasEmpty = false;
            let hashList = this.props.hashList;
            trs = data.toArray().map((dataVal, dataIndex) => {
                let id = dataVal.get('id');
                if (hashList.get(id)) {
                    status = 1;
                } else {
                    hasEmpty = true;
                }
                return this._renderRow(_fields, dataVal, id, dataIndex);
            });

            if (status === 1) {
                if (hasEmpty) {
                    status = 1;
                } else {
                    status = 2;
                }
            }
        }
        const ths = (
            _fields.toArray().map(v => {
                let val = this.props.schema.get(v);
                return (
                    <Th
                        key={v}
                        resizable={true}
                        className="mcds-is__sortable mcds-table__width"
                        icon={data ? ::this.iconClass(val.get('name'), order_flag, order_by) : null}
                        onClick={this.handleSort.bind(this, val.get('name'))} >
                        {val.get('display_name')}
                    </Th>
                );
            })
        );
        // 表格头部thead
        const thead = (
            <thead>
                <tr>
                    <th className={classnames(style['table-th__width'], 'mcds-cell__shrink')}>
                        <div className="mcds-table__resize-cell mcds-p__t-8 mcds-p__b-8 mcds-p__l-30 mcds-p__r-30">
                            <span className="mcds-layout__item">#</span>
                        </div>
                    </th>
                    <th className={classnames(style['table-th__width'], 'mcds-cell__shrink')}>
                        <div className="mcds-table__resize-cell mcds-p__t-8 mcds-p__b-8 mcds-p__l-20 mcds-p__r-20">
                            <Checkbox
                                ref="checkbox"
                                onChange={this.handleAllClick.bind(this, status)}
                                checked={status !== 0}
                                indeterminate={status === 1} />
                        </div>
                    </th>
                    {ths}
                    <Th className={classnames(style['table-th__width'], 'mcds-cell__shrink')} />
                </tr>
            </thead>
        );
        //  style={{position: 'fixed', top: '192px', bottom: 0, width: '100%', overflow: 'auto'}}
        return (
            <div className={style['table-wrapper']}>
                {this._renderMoreLoading()}
                <div className={style['table-wrapper']} ref="table_content">
                    <TableResize ref="table" className={style['table-fixed']}>
                        {thead}
                        <tbody>
                            {trs}
                        </tbody>
                    </TableResize>
                    { data.size !== 0 ? null : <div className={classnames(style['table-data__null'], 'mcds-text__weak mcds-text__size-18 mcds-m__t-40 mcds-layout__column mcds-layout__center')}>暂无数据</div>}
                </div>
            </div>
        );
    }
    // 渲染批量操作条
    renderBatchBar() {
        let { objName, allObjects } = this.props;
        let hashList = this.props.hashList;
        let hashArray = hashList.toArray();

        if (I.isImmutable(hashList) && hashList.size) {
            return (
                <Bar
                    allObjects={allObjects}
                    dataArray={hashArray}
                    batchDeleteSuccess={::this.batchDeleteSuccess}
                    batchTransferSuccess={::this.batchTransferSuccess}
                    objName={objName} />
            );
        }
    }

    render() {
        let data = this.props.data;
        return (
            <div style={{position: 'relative'}}>
                {this.renderBatchBar()}

                {this._renderTableData(data)}

            </div>
        );
    }
}

DataTable.contextTypes = {
    router: PropTypes.object
};
DataTable.propTypes = {
    data: PropTypes.object,
    loading: PropTypes.bool,
    schema: PropTypes.object,
    config: PropTypes.object,
    meta: PropTypes.object,
    objName: PropTypes.string,
    offset: PropTypes.number,
    deleteData: PropTypes.func,
    fetchList: PropTypes.func,
    queryParam: PropTypes.object,
    batchDeleteList: PropTypes.func,
    modifydata: PropTypes.func,
    fetchRelatedObjectsData: PropTypes.func,
    fetching: PropTypes.bool,
    removedata: PropTypes.func,
    settingCheckedAll: PropTypes.func,
    clearCheckedAll: PropTypes.func,
    handleChecked: PropTypes.func,
    hashList: PropTypes.object,
    info: PropTypes.object,
    deleteHashData: PropTypes.func,
    allObjects: PropTypes.object // redux上挂在的所有标准对象集合
};

export default connect(
    state => ({
        allObjects: state.getIn(['standardObject', 'allObjects']),
        loading: state.getIn(['standardObject', 'listview', 'list', 'fetching']),
        info: state.getIn(['vetting', 'listview', 'info']), // 审批页面的信息，取来是为了用action区分弹update的modal还是create的modal
        hashList: state.getIn(['standardObject', 'listview', 'hash', 'hashList'])
    }),
    dispatch => bindActionCreators({ deleteData, fetchList, modifydata, removedata, fetchRelatedObjectsData, batchDeleteList, settingCheckedAll, clearCheckedAll, handleChecked, deleteHashData}, dispatch)
)(DataTable);
