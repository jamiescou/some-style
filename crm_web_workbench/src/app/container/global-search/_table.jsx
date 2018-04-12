import _ from 'lodash';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import React, { Component } from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import { BuildNameLinkContext } from 'container/standard-object/get-suit-context';

import BaseField from 'container/standard-object/listview/base-field';
import ErrorNotify from 'container/share/error/error-notify';
import { fetchSearchData } from 'redux/reducers/search';
import { fetchRelatedObjectsData } from 'redux/reducers/standard-object/related-object/data';
import DetailPopoverPannel from '../standard-object/panel/detail-popover-panel';
const EXLUDETABLE = 61 + 138 + 0;

import {
    TableResize,
    Th,
    Loading
} from 'carbon';

let style = require('styles/modules/global-search/index.scss');

class DataTable extends Component {
    constructor(props){
        super(props);
        this.state = {
            moreLoading: false,
            editValue: null,
            active: false,
            deleteActive: false,
            deleteVal: null
        };
    }
    componentDidMount() {
        let elem = this.refs.table_content;
        let body = document.body;
        let loadData = this.refs.table.refs.loadData;
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
    }
    componentWillUnmount() {
        let loadData = this.refs.table.refs.loadData;
        loadData.removeEventListener('scroll', _.debounce);
        window.removeEventListener('resize', _.debounce);
    }
    _loadData(elem, body) {
        let { objName, param, offset, meta} = this.props;
        let top = elem.scrollTop + elem.offsetHeight;
        let height = elem.scrollHeight;
        let bodyHeight = body.clientHeight - EXLUDETABLE;
        if (height - top <= 20 && bodyHeight !== height && offset > 0 && !param.load) {
            param.limit = 50;
            param.offset = offset;
            delete param.load;

            this.props.fetchSearchData(objName, param)
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
            elem.style.height = (body.clientHeight - EXLUDETABLE) + 'px';
        }, 100);
    }
    /**
     * 把这个方法单独拉出来,渲染不同类型的字段会有一些判断,在这里处理
     */
    _renderCell(dataVal, field) {
        let {schema, objName} = this.props;

        let context = new BaseField({
            value: dataVal.get(field),
            schema: schema.get(field),
            data: dataVal,
            objName,
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
    // 调取搜索接口获取数据列表
    fetchListData() {
        let { objName, param, meta } = this.props;
        param.limit = 50;
        param.offset = 0;
        delete param.load;

        this.props.fetchSearchData(objName, param)
            .then((ret) => {
                this.props.fetchRelatedObjectsData(meta.toJS(), ret.result.body.objects);
            }, response => {
                this.setState({moreLoading: false});
                ErrorNotify(response);
            });

    }

    _renderRow(_fields, dataVal, id, dataIndex) {
        return (
            <tr key={`list-${dataVal.get('id')}-${dataIndex}`}>
                {_fields.map(field => this._renderCell(dataVal, field))}
            </tr>
        );
    }
    renderCount() {
        let { data, param } = this.props;
        let result = 0;
        if (data) {
            if (data.size >= 50 && !param.load) {
                result = data.size + '+ ';
            } else {
                result = data.size;
            }
        }
        return result;
    }
    /**
     * 加载更多的时候的 Loading 效果
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
                        className="mcds-is__sortable mcds-table__width">
                        {val.get('display_name')}
                    </Th>
                );
            })
        );
        // 表格头部thead
        const thead = (
            <thead>
                <tr>
                    {ths}
                    <Th className={classnames(style['table-th__width'], 'mcds-cell__shrink')} />
                </tr>
            </thead>
        );
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
    render() {
        let { meta, data, timer } = this.props;
        let display_name = meta.get('display_name');
        return (
            <div>
                <div className={style['search-table_header']}>
                    <div className="mcds-media">
                        <div className="mcds-m__r-30">
                            <div className="mcds-pageheader__header-left-icon" />
                        </div>
                        <div className="mcds-text__base mcds-text__size-20 mcds-p__t-3">{display_name}</div>
                    </div>
                    <div className="mcds-grid mcds-pageheader__footer mcds-m__t-41">
                        <div className="mcds-pageheader__footer-left">
                            <ul className="mcds-list__horizontal mcds-text__weak mcds-text__size-12">
                                <li className="mcds-list__item">{this.renderCount()}条结果</li>
                                <li className="mcds-list__item mcds-p__l-7 mcds-p__r-7">•</li>
                                <li className="mcds-list__item">最后更新</li>
                                <li className="mcds-list__item mcds-p__l-5">{timer.format('MM/DD/YYYY HH:mm:ss')}</li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div style={{position: 'relative'}}>
                    {this._renderTableData(data)}
                </div>
            </div>
        );
    }
}

DataTable.contextTypes = {
    router: PropTypes.object
};
DataTable.propTypes = {
    data: PropTypes.object, // 从父组件传过来的列表数据
    loading: PropTypes.bool, // 挂载redux上用来判断列表数据更新状态
    schema: PropTypes.object, // 从父组件传过来处理好的schema
    config: PropTypes.object, // 从父组件传过来处理好的字段渲染配置
    meta: PropTypes.object, // 从父组件传过来处理好的meta
    param: PropTypes.object, // 从父组件传过来的发送请求的参数
    objName: PropTypes.string, // 从父组件传过来要请求列表数据的标准对象
    fetchSearchData: PropTypes.func, // 列表数据更新的请求方法
    fetchRelatedObjectsData: PropTypes.func, // 列表数据更新关联对象的请求方法
    offset: PropTypes.number, // 列表数据更新的请求的限制参数，挂在在redux上，offset的值根据后台返回数据进行更新
    timer: PropTypes.object // 从父组件传过来请求成功数据的时间
};

export default connect(
    state => ({
        loading: state.getIn(['search', 'loading'])
    }),
    dispatch => bindActionCreators({ fetchSearchData, fetchRelatedObjectsData }, dispatch)
)(DataTable);
