/* eslint-disable react/no-find-dom-node */
import _ from 'lodash';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import React, { Component } from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { claimTerritoryRecord, fetchTerritoryRecord } from 'redux/reducers/territory/territory';
import { fetchRelatedObjectsData } from 'redux/reducers/standard-object/related-object/data';
import ErrorNotify from 'container/share/error/error-notify';
import TrComponent from './tr-component';
// import Bar from './bar';
const EXLUDETABLE = 61 + 138 + 0;
import {
    TableResize,
    Th,
    notify,
    Loading
} from 'carbon';

let style = require('styles/modules/standard-object/index.scss');

class DataTable extends Component {
    constructor(props){
        super(props);
        this.state = {
            moreLoading: false,
            wrapWidth: 0 // table 宽度，resize table 需要用到
        };
        this.handleClaimRecord = this.handleClaimRecord.bind(this);
    }

    componentDidMount() {
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

            if (diff === 0) {
                return false;
            }
            if (diff > 0) {
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
        let { objName, queryParam, offset, meta } = this.props;
        let top = elem.scrollTop + elem.offsetHeight;
        let height = elem.scrollHeight;
        let bodyHeight = body.clientHeight - EXLUDETABLE;
        let { territory_id } = this.context.router.params;
        if (height - top <= 20 && bodyHeight !== height && offset > 0) {
            queryParam.limit = 50;
            queryParam.offset = offset;
            delete queryParam.update_date;

            this.props.fetchTerritoryRecord(objName, territory_id, queryParam)
                .then(response => {
                    this.props.fetchRelatedObjectsData(meta.toJS(), response.result.body.objects);
                }, response => {
                    ErrorNotify(response);
                })
                .catch(error => ErrorNotify(error));
        }
    }

    _screenHeight(elem, body) {
        clearTimeout(timer);
        let timer = setTimeout(() => {
            elem.style.height = (body.clientHeight - EXLUDETABLE) + 'px';
        }, 100);
    }

    // 海的领取
    handleClaimRecord(id){
        this.props.claimTerritoryRecord(id).then(res => {
            let { code } = res.result;
            if (code === 0) {
                notify.add('领取成功');
            }
        }, () => {
            notify.add('领取失败');
        });
    }

    _renderRow(_fields, dataVal, id, dataIndex) {
        let { schema, data, objName } = this.props;
        return (
            <TrComponent
                key={id + dataIndex}
                id={id}
                objName={objName}
                schema={schema.toJS()}
                data={data.get(dataIndex)}
                fields={_fields}
                onClaimRecord={this.handleClaimRecord}
                dataVal={dataVal}
                dataIndex={dataIndex} />
        );
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

        if (data) {
            trs = data.toArray().map((dataVal, dataIndex) => {
                let id = dataVal.get('id');
                return this._renderRow(_fields, dataVal, id, dataIndex);
            });
        }

        const ths = (
            _fields.toArray().map(v => {
                let val = this.props.schema.get(v);
                return (
                    <Th
                        key={v}
                        resizable={true}
                        className="mcds-is__sortable mcds-table__width" >
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
                    {ths}
                    <Th className="mcds-cell__shrink" style={{width: '50px'}} />
                </tr>
            </thead>
        );
        //  style={{position: 'fixed', top: '192px', bottom: 0, width: '100%', overflow: 'auto'}}
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
                    { (data && data.size) ? null : <div className={classnames(style['table-data__null'], 'mcds-text__weak mcds-text__size-18 mcds-m__t-40 mcds-layout__column mcds-layout__center')}>暂无数据</div>}
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
    params: PropTypes.object,
    objName: PropTypes.string,
    offset: PropTypes.number,
    queryParam: PropTypes.object,
    fetchRelatedObjectsData: PropTypes.func,
    fetching: PropTypes.bool,
    claimTerritoryRecord: PropTypes.func, // 海的领取
    fetchTerritoryRecord: PropTypes.func // 获取海的record的List
};

export default connect(
    state => ({
        loading: state.getIn(['territory', 'fetching'])
    }),
    dispatch => bindActionCreators({fetchRelatedObjectsData, claimTerritoryRecord, fetchTerritoryRecord}, dispatch)
)(DataTable);
