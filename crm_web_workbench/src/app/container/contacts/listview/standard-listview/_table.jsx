/* eslint-disable react/no-find-dom-node */
import _ from 'lodash';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import React, { Component } from 'react';

import ReactDOM from 'react-dom';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import { browserHistory } from 'react-router';


import { deleteData, batchDeleteList } from 'redux/reducers/standard-object/listview/list';
import { fetchRelatedObjectsData } from 'redux/reducers/standard-object/related-object/data';
import { fetchList, modifydata, removedata } from 'redux/reducers/standard-object/listview/list';
import { settingCheckedAll, clearCheckedAll, handleChecked, deleteHashData } from 'redux/reducers/standard-object/listview/setting-hash';
import ErrorNotify from 'container/share/error/error-notify';


const EXLUDETABLE = 61 + 138 + 0;
import {
    TableResize,
    Th,
    notify,
    Loading
} from 'carbon';


import TrComponent from './tr-component';

let style = require('styles/modules/standard-object/index.scss');

class DataTable extends Component {
    constructor(props){
        super(props);
        this.state = {
            moreLoading: false,
            wrapWidth: 0 // table 宽度，resize table 需要用到
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
        let beforeScrollTop = loadData.scrollTop;
        loadData.addEventListener('scroll', _.debounce(() => {
            let afterScrollTop = loadData.scrollTop;
            let diff = afterScrollTop - beforeScrollTop;

            if ( diff === 0 ) {
                return false;
            }
            if ( diff > 0 ) {
                this._loadData(loadData, body);
            }
            beforeScrollTop = afterScrollTop;
        }, 300));

        // didMount 后拿到整个页面宽度
        // eslint-disable-next-line
        this.setState({
            wrapWidth: window.getComputedStyle(elem).width.replace('px', '')
        });
    }

    componentWillUnmount() {
        let loadData = this.refs.table.refs.loadData;
        loadData.removeEventListener('scroll', _.debounce);
        window.removeEventListener('resize', _.debounce);
    }

    _loadData(elem, body) {
        let { objName, queryParam, offset, schema } = this.props;
        let top = elem.scrollTop + elem.offsetHeight;
        let height = elem.scrollHeight;
        let bodyHeight = body.clientHeight - EXLUDETABLE;
        if (height - top <= 20 && bodyHeight !== height && offset > 0 && !queryParam.load) {
            queryParam.limit = 50;
            queryParam.offset = offset;
            delete queryParam.load;

            this.props.fetchList(objName, queryParam)
                .then((ret) => {
                    this.props.fetchRelatedObjectsData(schema.toJS(), ret.result.body.objects);
                }, response => {
                    ErrorNotify(response);
                });
        }
    }

    _screenHeight(elem, body) {
        clearTimeout(timer);
        let timer = setTimeout(() => {
            elem.style.height = (body.clientHeight - EXLUDETABLE) + 'px';
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
        let { objName, queryParam, schema } = this.props;
        queryParam.limit = 50;
        queryParam.offset = 0;
        delete queryParam.load;

        this.props.fetchList(objName, queryParam)
            .then((ret) => {
                this.props.fetchRelatedObjectsData(schema.toJS(), ret.result.body.objects);
            }, response => {
                this.setState({moreLoading: false});
                ErrorNotify(response);
            });

    }

    _renderRow(_fields, dataVal, id, dataIndex) {
        let {info, config, schema, data, objName} = this.props;

        return (
            <TrComponent
                key={id + dataIndex}
                id={id}
                info={info}
                objName={objName}
                config={config}
                schema={schema}
                data={data}
                fields={_fields}
                dataVal={dataVal}
                dataIndex={dataIndex} />
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
                    <th className="mcds-cell__shrink" style={{width: '60px'}}>
                        <div className="mcds-table__resize-cell mcds-p__t-8 mcds-p__b-8 mcds-p__l-30 mcds-p__r-30">
                            <span className="mcds-layout__item">#</span>
                        </div>
                    </th>
                    {/* <th className="mcds-cell__shrink" style={{width: '40px'}}>
                        <div className="mcds-table__resize-cell mcds-p__t-8 mcds-p__b-8 mcds-p__l-20 mcds-p__r-20">
                            <Checkbox
                                ref="checkbox"
                                onChange={this.handleAllClick.bind(this, status)}
                                checked={status !== 0}
                                indeterminate={status === 1} />
                        </div>
                    </th> */}
                    {ths}
                </tr>
            </thead>
        );
        return (
            <div className={style['table-wrapper']}>
                {this._renderMoreLoading()}
                <div ref="table_content">
                    <TableResize
                        ref="table"
                        wrapWidth={parseInt(this.state.wrapWidth)}
                        fixedWidth={60 + 40 + 50}
                        columnSize={_fields.size}
                        className={style['table-fixed']}>
                        {/* 防止初次不知道整个外层宽度的时候渲染出来了 table，导致 resize table 的宽度不确定，引起了拖动的问题 */}
                        {this.state.wrapWidth > 0 ? thead : null}
                        <tbody>
                            {this.state.wrapWidth > 0 ? trs : null}
                        </tbody>
                    </TableResize>
                    { data.size !== 0 ? null : <div className={classnames(style['table-data__null'], 'mcds-text__weak mcds-text__size-18 mcds-m__t-40 mcds-layout__column mcds-layout__center')}>暂无数据</div>}
                </div>
            </div>
        );
    }

    render() {
        let data = this.props.data;
        return (
            <div style={{position: 'relative'}}>
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

    allObjects: PropTypes.object, // redux上挂载的所有标准对象集合

    deleteHashData: PropTypes.func
};

export default connect(
    state => ({
        loading: state.getIn(['standardObject', 'listview', 'list', 'fetching']),
        allObjects: state.getIn(['standardObject', 'allObjects']),
        info: state.getIn(['vetting', 'listview', 'info']), // 审批页面的信息，取来是为了用action区分弹update的modal还是create的modal
        hashList: state.getIn(['standardObject', 'listview', 'hash', 'hashList'])
    }),
    dispatch => bindActionCreators({ deleteData, fetchList, modifydata, removedata, fetchRelatedObjectsData, batchDeleteList, settingCheckedAll, clearCheckedAll, handleChecked, deleteHashData}, dispatch)
)(DataTable);
