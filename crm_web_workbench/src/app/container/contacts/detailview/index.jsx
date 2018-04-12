import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import { Loading } from 'carbon';

import { eventEmitter } from 'utils/event';
import BuildComponents from 'container/standard-object/build-components';
import { fetchMeta } from 'redux/reducers/standard-object/meta';
import { fetchSchema } from 'redux/reducers/standard-object/schema';
import { fetchDependency } from 'redux/reducers/standard-object/dependency';
import { fetchLayout, fetchObjConfig } from 'redux/reducers/standard-object/layout';
import { fetchObj } from 'redux/reducers/standard-object/detailview/data';
import { fetchRelatedObjectsData } from 'redux/reducers/standard-object/related-object/data';
import { fetchTeamMember } from 'redux/reducers/acl/team';
import { fetchObjectTeamRoles } from 'redux/reducers/standard-object/team-role';
import { fetchItemActions } from 'redux/reducers/standard-object/action';
import _components from './_index';

import {
    notify
} from 'carbon';

@connect(
    state => ({
        layout: state.getIn(['standardObject', 'layout']),
        schema: state.getIn(['standardObject', 'schema']),
        meta: state.getIn(['standardObject', 'meta']),
        data: state.getIn(['standardObject', 'detailview', 'data'])
    }),
    dispatch => bindActionCreators({
        fetchLayout,
        fetchSchema,
        fetchObj,
        fetchMeta,
        fetchRelatedObjectsData,
        fetchTeamMember,
        fetchDependency,
        fetchObjConfig,
        fetchObjectTeamRoles,
        fetchItemActions},
    dispatch)
)

export default class DetailIndex extends Component {
    static propTypes = {
        fetchLayout: PropTypes.func,
        fetchSchema: PropTypes.func,
        fetchMeta: PropTypes.func,
        fetchObj: PropTypes.func,
        schema: PropTypes.object,
        layout: PropTypes.object,
        data: PropTypes.object,
        params: PropTypes.object,
        router: PropTypes.object,
        fetchDependency: PropTypes.func,
        fetchObjectTeamRoles: PropTypes.func,
        fetchObjConfig: PropTypes.func,
        fetchItemActions: PropTypes.func,
        fetchRelatedObjectsData: PropTypes.func,
        fetchTeamMember: PropTypes.func,
        meta: PropTypes.object

    };

    constructor(props) {
        super(props);
        this.state = ({
            loading: true,
            objName: null,
            id: null
        });
    }

    componentWillMount() {
        let { objName, id } = this.props.params;
        let cb = this.refreshData.bind(this);
        eventEmitter.on('refreshDetail', () => {
            this.setState({loading: true}, cb(objName, id));
        });
    }

    componentDidMount() {
        let { objName, id } = this.props.params;
        this.refreshData(objName, id);
    }

    componentWillReceiveProps(nextProps) {
        let state = this.state;
        let { objName, id } = this.props.params;
        let newObjName = nextProps.params.objName;
        let newId = nextProps.params.id;
        // 当路由被更改,刷新信息
        if (!state.loading && newId !== id && newObjName !== objName) {
            this.setState({
                loading: true
            });
            this.refreshData(newObjName, newId);
        }

    }
    componentWillUnmount() {
        // eventEmitter.removeListener('refreshData');
    }

    refreshData(objName, id) {
        if (!objName || !id) {
            console.warn(`the routes must have objName(${objName}) and id(${id}),but one of them maybe undefined`);
            // 如果用没有有 obj 或 id 直接返回到主页
            this.props.router.push('/');
            return false;
        }
        console.log('objName,id', objName, id);
        Promise.all([
            this.props.fetchLayout(objName, 'detail'),
            this.props.fetchSchema(objName),
            this.props.fetchMeta(objName),
            this.props.fetchObj(objName, id),
            this.props.fetchDependency(objName),
            this.props.fetchObjectTeamRoles(objName),
            this.props.fetchItemActions(objName),
            this.props.fetchObjConfig(objName)
        ]).then(() => {
            let data = this.props.data;
            let schema = this.props.schema.get(objName);
            // 避免出错
            if (data && data.toJS && schema && schema.toJS) {
                this.props.fetchRelatedObjectsData(schema.toJS(), [data.toJS()]);
                this.props.fetchTeamMember(objName, id, data.get('owner'));
            }
            this.setState({
                loading: false,
                objName,
                id
            });
        }, () => {
            notify.add({message: '当用用户权限错误或者发生未知错误,界面即将跳转回列表页!', theme: 'error'});
            setTimeout(() => {
                this.props.router.push(`/contacts/${objName}`);
            }, 1000);
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

        let { objName } = this.props.params;
        let layout = this.props.layout.getIn(['detail', objName]);
        let meta = this.props.meta.get(objName);
        let schema = this.props.schema.get ? this.props.schema.get(objName) : undefined;

        return (<BuildComponents
            meta={meta}
            objName={objName}
            layout={layout}
            schema={schema}
            data={this.props.data}
            componentList={_components} />);

    }
}
