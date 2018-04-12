/*
 *   海
 */
import _ from 'lodash';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import { Loading, notify } from 'carbon';
import React, { Component } from 'react';
import {bindActionCreators} from 'redux';

import { fetchMeta } from 'redux/reducers/standard-object/meta';
import { fetchLayout } from 'redux/reducers/standard-object/layout';
import { fetchSchema } from 'redux/reducers/standard-object/schema';
import { fetchFilter } from 'redux/reducers/standard-object/listview/filter';
import { fetchRelatedObjectsData } from 'redux/reducers/standard-object/related-object/data';
import { fetchTerritoryList, fetchTerritoryNode, fetchTerritoryRecord } from 'redux/reducers/territory/territory';
import ErrorNotify from 'container/share/error/error-notify';
import _components from './_index';
import BuildComponents from 'container/standard-object/build-components.jsx';
class List extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: true
        };
    }

    componentDidMount() {
        let { objName } = this.props.params;
        let params = {limit: 50, offset: 0};
        this.refreshData(objName, params);
    }

    componentWillReceiveProps(nextProps) {
        let params = {limit: 50, offset: 0};
        // 新参数
        let { objName, territory_id } = nextProps.params;
        let oldTerritoryId = this.props.params.territory_id;
        if (!_.isEqual(oldTerritoryId, territory_id)) {
            this.props.fetchTerritoryRecord(objName, territory_id, params).then(() => {
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
            fetching: props.fetching,
            model: props.model,
            territory_list: props.territory_list
        };
        return (<BuildComponents
            meta={meta}
            layout={layout}
            schema={schema}
            {...otherProps}
            componentList={_components} />);
    }

    refreshData(objName, param) {
        let { territory_id } = this.props.params;
        if (!territory_id) {
            console.warn(`the routes must have territory_id(${territory_id}) ,but one of them maybe undefined`);
            // 如果用没有有 objName 直接返回到主页
            this.props.router.push('/');
        }
        // loading 状态保持在页面中,每次进入页面重新加载数据,数据 Loading 完了在获取
        Promise.all([
            this.props.fetchLayout(objName, 'list'),
            this.props.fetchSchema(objName),
            this.props.fetchMeta(objName),
            this.props.fetchFilter(objName),
            this.props.fetchTerritoryList(objName)
        ]).then(() => {
            let { data, model } = this.props;
            let meta = this.props.meta.get(objName);
            if (model && model.toJS) {
                let model_id = model.get('model_id');
                this.props.fetchTerritoryNode(model_id);
                this.props.fetchTerritoryRecord(objName, territory_id, param).then(() => {
                    // 避免出错
                    if (data && data.toJS && meta && meta.toJS) {
                        this.props.fetchRelatedObjectsData(meta.toJS(), data.toJS());
                        this.setState({
                            loading: false
                        });
                    }
                }, () => {
                    notify.add({message: '当用户权限错误或者发生未知错误,界面即将跳转回列表页!', theme: 'error'});
                    setTimeout(() => {
                        this.props.router.push(`/sObject/${objName}`);
                    }, 1000);
                });
            }

        }, error => ErrorNotify(error));
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
    fetchFilter: PropTypes.func,
    params: PropTypes.object,
    router: PropTypes.object,
    objName: PropTypes.string,
    fetchMeta: PropTypes.func,
    data: PropTypes.object,
    meta: PropTypes.object,
    fetchRelatedObjectsData: PropTypes.func,
    model: PropTypes.object, // 海的列表
    territory_list: PropTypes.object, // 海的节点列表
    fetchTerritoryList: PropTypes.func, // 获取海的列表
    fetchTerritoryNode: PropTypes.func, // 获取海节点
    fetchTerritoryRecord: PropTypes.func, // 获取海的record
    territory_id: PropTypes.string // 海的id
};

export default connect(
    state => ({
        components: state.getIn(['standardObject', 'layout', 'list', 'components']),
        layout: state.getIn(['standardObject', 'layout', 'list']),
        schema: state.getIn(['standardObject', 'schema']),
        meta: state.getIn(['standardObject', 'meta']),
        data: state.getIn(['territory', 'data']), // 海的数据
        queryParam: state.getIn(['territory', 'param']),
        offset: state.getIn(['territory', 'offset']),
        objName: state.getIn(['territory', 'objName']),
        filter: state.getIn(['standardObject', 'listview', 'filter', 'data']),
        fetching: state.getIn(['territory', 'fetching']),
        model: state.getIn(['territory', 'model']), // 海的model
        territory_list: state.getIn(['territory', 'territory_list']) // 海的节点
    }),
    dispatch => bindActionCreators({fetchLayout, fetchSchema, fetchFilter, fetchMeta, fetchRelatedObjectsData, fetchTerritoryList, fetchTerritoryNode, fetchTerritoryRecord}, dispatch)
)(List);
