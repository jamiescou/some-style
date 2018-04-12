import _ from 'lodash';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import React, { Component } from 'react';

import { BuildNameLinkContext } from '../../get-suit-context';
import ErrorNotify from 'container/share/error/error-notify';
import { fetchList } from 'redux/reducers/standard-object/listview/list';
import { fetchRelatedObjectsData } from 'redux/reducers/standard-object/related-object/data';

import DetailPopoverPannel from '../../panel/detail-popover-panel';
import BaseListViewField from '../base-field';

import EditModal from '../../detailview/modal/edit-cooperator';
import DeleteModal from '../../detailview/modal/delete-cooperator';

import {
    DropDown,
    DropDownList,
    DropDownItem,
    TableResize,
    Th,
    DropDownTrigger,
    ButtonSmallIcon,
    ButtonGroup
} from 'carbon';

let style = require('styles/modules/standard-object/index.scss');

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

    /**
     * 把这个方法单独拉出来,渲染不同类型的字段会有一些判断,在这里处理
     */
    _renderCell(dataVal, field) {
        let { schema } = this.props;
        let { cooperationObjName } = this.context.router.params;
        let context = new BaseListViewField({
            schema: schema.get(field),
            value: dataVal.get(field),
            data: dataVal,
            objName: cooperationObjName,
            needDetailPopover: true
        }).render();
        if (field === 'name') {
            let trigger = (
                <div className="mcds-truncate">
                    {BuildNameLinkContext(dataVal.get(field), dataVal.get('id'), cooperationObjName)}
                </div>
            );

            context = (
                <DetailPopoverPannel
                    id={dataVal.get('id')}
                    objName={cooperationObjName}
                    trigger={trigger} />);
        }

        return <td key={field} className="mcds-truncate">{context}</td>;

    }
    // 判断编辑和删除权限
    buildDropDownArray(id, dataVal) {
        let {config, memberList, dataDetail} = this.props;
        let { objName } = this.context.router.params;
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
                        return (<EditModal
                            key={i}
                            successBack={this.props.successBack}
                            record={dataDetail}
                            value={memberList.get(id)}
                            objName={objName}
                            teamRole={this.props.teamRole}
                            button={<DropDownItem className="close" >{displayName}</DropDownItem>} />);
                    case 'delete':
                        return (<DeleteModal
                            key={i}
                            successBack={this.props.successBack}
                            objName={objName}
                            record={dataDetail}
                            button={<DropDownItem className="close">{displayName}</DropDownItem>}
                            user={dataVal} />);
                    default:
                        throw new Error(`not found ${operation} about modal operation`);
                    }
                }
            });
            return result;
        };
        return <ButtonGroup>{optionalButtons()}</ButtonGroup>;
    }

    _renderRow(_fields, dataVal, id, dataIndex) {
        let drondwonTriggerArray = this.buildDropDownArray(id, dataVal);
        const dropDown = (
            <td className="mcds-cell__shrink" key={dataIndex}>
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
        return (
            <tr key={`list-${dataVal.get('id')}-${dataIndex}`}>
                <td className="mcds-cell__shrink mcds-p__l-30">
                    <span className="mcds-layout__item">{dataIndex + 1}</span>
                </td>

                {_fields.map(field => this._renderCell(dataVal, field))}
                {dropDown}
            </tr>
        );
    }

    _renderTableData(data) {
        let _fields = this.props.config.get('fields');
        let trs = null;
        if (data) {
            trs = data.map((dataVal, dataIndex) => {
                let id = dataVal.get('id');
                return this._renderRow(_fields, dataVal, id, dataIndex);
            });
        }

        const ths = (
            _fields.toArray().map(v => {
                let val = this.props.schema.get(v);
                // resizable={true}
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
                    <th className={classnames(style['table-th__width'], 'mcds-cell__shrink')}>
                        <div className="mcds-table__resize-cell mcds-p__t-8 mcds-p__b-8 mcds-p__l-30 mcds-p__r-30">
                            <span className="mcds-layout__item">#</span>
                        </div>
                    </th>
                    {ths}
                    <Th className={classnames(style['table-th__width'], 'mcds-cell__shrink')} />
                </tr>
            </thead>
        );
        return (
            <div className={style['table-wrapper']}>
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
    schema: PropTypes.object,
    config: PropTypes.object,
    meta: PropTypes.object,
    objName: PropTypes.string,
    offset: PropTypes.number,
    fetchList: PropTypes.func,
    queryParam: PropTypes.object,
    fetchRelatedObjectsData: PropTypes.func,
    memberList: PropTypes.object,
    dataDetail: PropTypes.object,
    successBack: PropTypes.func,
    teamRole: PropTypes.object
};
export default connect(
    null,
    dispatch => bindActionCreators({ fetchList, fetchRelatedObjectsData}, dispatch)
)(DataTable);
