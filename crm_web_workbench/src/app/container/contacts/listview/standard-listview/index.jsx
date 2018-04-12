import _ from 'lodash';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import { Loading } from 'carbon';
import React, { Component } from 'react';
import {bindActionCreators} from 'redux';

import { fetchMeta } from 'redux/reducers/standard-object/meta';
import { fetchLayout } from 'redux/reducers/standard-object/layout';
import { fetchSchema } from 'redux/reducers/standard-object/schema';
import { fetchList } from 'redux/reducers/standard-object/listview/list';
import { fetchFilter } from 'redux/reducers/standard-object/listview/filter';
import { fetchRelatedObjectsData } from 'redux/reducers/standard-object/related-object/data';

import ErrorNotify from 'container/share/error/error-notify';
import _components from './_index';
import BuildComponents from 'container/standard-object/build-components';
class List extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: true
        };
    }

    componentDidMount() {
        let { objName } = this.props.params;
        let params = this.handleParam(this.context.router.location.query);
        this.refreshData(objName, params);
    }

    componentWillReceiveProps(nextProps) {
        let { loading } = this.state;
        // 新参数
        let { objName } = nextProps.params;
        // 老的对象名字
        let oldObjName = this.props.objName;
        let params = this.handleParam(nextProps.location.query);
        if (!_.isEqual(nextProps.location.query, this.props.location.query)) {
            this.props.fetchList(objName, params).then(()=>{
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

        if (objName !== oldObjName && !loading) {
            this.setState({
                loading: true
            });
            this.refreshData(objName, params);
        }
    }

    handleParam(param) {
        let result = null;
        if (_.size(param) === 0 || !param.order_by || !param.order_flag) {
            result = {order_by: 'updated_at', order_flag: 'DESC', limit: 50, offset: 0};
        } else {
            param.offset = 0;
            param.limit = 50;
            result = param;
        }
        return result;
    }

    buildLayout(props = this.props) {
        let { objName } = this.props.params;

        let layout = props.layout.get(objName);
        let meta = props.meta.get(objName);
        let schema = props.schema.get ? props.schema.get(objName) : undefined;
        let otherProps = {
            objName: props.params.objName,
            data: props.data,
            filter: props.filter,
            queryParam: props.queryParam,
            offset: props.offset,
            fetching: props.fetching
        };

        return (<BuildComponents
            meta={meta}
            layout={layout}
            schema={schema}
            {...otherProps}
            componentList={_components} />);
    }

    refreshData(objName, param) {

        if (!objName) {
            console.warn(`the routes must have objName(${objName}) ,but one of them maybe undefined`);
            // 如果用没有有 objName 直接返回到主页
            this.props.router.push('/');
        }
        // loading 状态保持在页面中,每次进入页面重新加载数据,数据 Loading 完了在获取
        Promise.all([
            this.props.fetchList(objName, param),
            this.props.fetchLayout(objName, 'list'),
            this.props.fetchSchema(objName),
            this.props.fetchMeta(objName),
            this.props.fetchFilter(objName)
        ]).then(() => {
            let data = this.props.data;
            let schema = this.props.schema.get(objName);
            // 避免出错
            if (data && data.toJS && schema && schema.toJS) {
                this.props.fetchRelatedObjectsData(schema.toJS(), data.toJS());
            }

            this.setState({
                loading: false
            });
        }, response => {
            ErrorNotify(response);
        });
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
    fetchFilter: PropTypes.func,
    params: PropTypes.object,
    router: PropTypes.object,
    objName: PropTypes.string,
    fetchMeta: PropTypes.func,
    location: PropTypes.object,
    data: PropTypes.object,
    meta: PropTypes.object,
    schema: PropTypes.object,
    fetchRelatedObjectsData: PropTypes.func
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
        filter: state.getIn(['standardObject', 'listview', 'filter', 'data']),
        fetching: state.getIn(['standardObject', 'listview', 'list', 'fetching'])
    }),
    dispatch => bindActionCreators({fetchLayout, fetchSchema, fetchList, fetchFilter, fetchMeta, fetchRelatedObjectsData}, dispatch)
)(List);
