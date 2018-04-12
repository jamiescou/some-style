import _ from 'lodash';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import { Loading, notify} from 'carbon';
import React, { Component } from 'react';
import {bindActionCreators} from 'redux';

import { fetchMeta } from 'redux/reducers/standard-object/meta';
import { fetchLayout } from 'redux/reducers/standard-object/layout';
import { fetchSchema } from 'redux/reducers/standard-object/schema';
import { fetchList } from 'redux/reducers/standard-object/listview/list';
import { fetchRelatedObjectsData } from 'redux/reducers/standard-object/related-object/data';

import ErrorNotify from 'container/share/error/error-notify';
import RelatedPageHeader from './page-header';
import DataTable from './table';

class List extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true
        };
    }

    componentDidMount() {
        this.fetchTableData();
    }
    componentWillReceiveProps(nextProps) {
        let { relateObjName } = nextProps.params;
        // 老的对象名字
        let params = this.handleParam(nextProps.location.query);
        if (!_.isEqual(nextProps.location.query, this.props.location.query)) {
            this.props.fetchList(relateObjName, params).then(()=>{
                this.setState({
                    loading: false
                });
            }, response => {
                this.setState({
                    loading: true
                });
                ErrorNotify(response);
            });
        }
    }
    getViewFilter(){
        let { relatedKey, id } = this.props.params;
        return `{
            "filter_from": "all",
            "filter": {
                "expressions": [
                    {
                        "field":"${relatedKey}",
                        "operator":"==",
                        "operands": ["'${id}'"]
                    }
                ],
                "logical_relation": "1"
            }
        }`;
    }

    fetchTableData(){
        let { relateObjName } = this.props.params;
        let params = {order_by: 'updated_at', order_flag: 'DESC', limit: 50, offset: 0};
        params.view_filter = this.getViewFilter();
        this.refreshData(relateObjName, params);
    }

    handleParam(param) {
        let result = null;
        if (_.size(param) === 0 || !param.order_by || !param.order_flag || !param.view_filter) {
            result = {order_by: 'updated_at', order_flag: 'DESC', limit: 50, offset: 0};
            result.view_filter = this.getViewFilter();
        } else {
            param.offset = 0;
            param.limit = 50;
            result = param;
        }
        return result;
    }

    createSuccessBack(){
        let { relateObjName } = this.props.params;
        let params = {order_by: 'updated_at', order_flag: 'DESC', limit: 50, offset: 0};
        params.view_filter = this.getViewFilter();
        this.props.fetchList(relateObjName, params);
    }

    buildLayout(props = this.props) {
        let { relateObjName } = this.props.params;
        let layout = props.layout.get(relateObjName);
        let meta = props.meta.get(relateObjName);

        let schema = props.schema.get ? props.schema.get(relateObjName) : undefined;
        let otherProps = {
            meta: meta,
            layout: layout,
            schema: schema,
            objName: relateObjName,
            data: props.data,
            queryParam: props.queryParam,
            offset: props.offset,
            fetching: props.fetching
        };
        let children = layout.getIn(['layout', 'children']);
        let components = layout.get('components');
        let config;
        children.forEach(val => {
            let id = val.get('id');
            if (components && components.get(id).get('name') === 'dataTable') {
                config = components.get(id).get('config');
            }
        });
        return (
            <div>
                <RelatedPageHeader
                    createSuccessBack={::this.createSuccessBack}
                    {...otherProps} />
                <DataTable
                    config={config}
                    {...otherProps} />
            </div>);
    }

    refreshData(relateObjName, param) {
        if (!relateObjName) {
            console.warn(`the routes must have objName(${relateObjName}) ,but one of them maybe undefined`);
            // 如果用没有有 relateObjName 直接返回到主页
            this.props.router.push('/');
        }
        // loading 状态保持在页面中,每次进入页面重新加载数据,数据 Loading 完了在获取
        Promise.all([
            this.props.fetchList(relateObjName, param),
            this.props.fetchLayout(relateObjName, 'list'),
            this.props.fetchSchema(relateObjName),
            this.props.fetchMeta(relateObjName)
        ]).then(() => {
            let data = this.props.data;
            let meta = this.props.meta.get(relateObjName);
            // 避免出错
            if (data && data.toJS && meta && meta.toJS) {
                this.props.fetchRelatedObjectsData(meta.toJS(), data.toJS());
            }
            this.setState({
                loading: false
            });
        }, response => notify.add({message: response.error || '操作失败', theme: 'error'}));
    }

    render() {
        if (this.state.loading) {
            return (
                <div className="demo mcds-layout__row mcds-layout__middle mcds-layout__center" style={{height: '50%'}}>
                    <div className="mcds-layout__item-12" style={{marginTop: '40px'}}>
                        <Loading theme="logo" model="small" />
                    </div>
                </div>
            );
        }
        return this.buildLayout();
    }
}

List.contextTypes = {
    router: PropTypes.object
};

List.propTypes = {
    fetchLayout: PropTypes.func,
    fetchSchema: PropTypes.func,
    fetchList: PropTypes.func,
    params: PropTypes.object,
    router: PropTypes.object,
    objName: PropTypes.string,
    relateObjName: PropTypes.string,
    fetchMeta: PropTypes.func,
    data: PropTypes.object,
    meta: PropTypes.object,
    fetchRelatedObjectsData: PropTypes.func,
    location: PropTypes.object
};

export default connect(
    state => ({
        components: state.getIn(['standardObject', 'layout', 'list', 'components']),
        layout: state.getIn(['standardObject', 'layout', 'list']),
        schema: state.getIn(['standardObject', 'schema']),
        meta: state.getIn(['standardObject', 'meta']),
        data: state.getIn(['standardObject', 'listview', 'list', 'data']),
        queryParam: state.getIn(['standardObject', 'listview', 'list', 'param']),
        offset: state.getIn(['standardObject', 'listview', 'list', 'offset']),
        objName: state.getIn(['standardObject', 'listview', 'list', 'objName']),
        fetching: state.getIn(['standardObject', 'listview', 'list', 'fetching'])
    }),
    dispatch => bindActionCreators({fetchLayout, fetchSchema, fetchList, fetchMeta, fetchRelatedObjectsData}, dispatch)
)(List);
