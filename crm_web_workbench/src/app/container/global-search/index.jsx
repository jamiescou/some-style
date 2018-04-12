import React, { Component } from 'react';
import { Navigation, NavTitle, NavItem, NavList} from 'carbon';
import style from 'styles/modules/global-search/index.scss';
import PropTypes from 'prop-types';
import _ from 'lodash';
import {bindActionCreators} from 'redux';
import moment from 'moment';
import {connect} from 'react-redux';
import { Loading } from 'carbon';
import classnames from 'classnames';
import { fetchLayout } from 'redux/reducers/standard-object/layout';
import { fetchSchema } from 'redux/reducers/standard-object/schema';
import { fetchMeta } from 'redux/reducers/standard-object/meta';
import { fetchRelatedObjectsData } from 'redux/reducers/standard-object/related-object/data';
import { fetchSearchNav, fetchSearchData } from 'redux/reducers/search';
import ErrorNotify from 'container/share/error/error-notify';
import DataTable from './_table';

class Search extends Component {
    static propTypes = {
    };
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            loadingSmall: true,
            current: 0,
            objName: '',
            timer: null
        };
    }
    componentDidMount() {
        let keyword = this.props.location.query;
        let { allObjList } = this.props;
        if (allObjList && allObjList.size){
            this.searchObjData(keyword);
        }
    }

    componentWillReceiveProps(nextProps) {
        let newKeyWord = nextProps.location.query;
        let params = newKeyWord;
        if (!_.isEqual(nextProps.location.query, this.props.location.query) && this.props.allObjList) {
            this.setState({
                loading: true,
                current: 0
            }, () => { this.searchObjData(params); });
        }
    }

    // 获取搜索到的标准对象列表
    searchObjData(param){
        let params = param;
        this.props.fetchSearchNav(params).then(() => {
            let { navList } = this.props;
            if (navList){
                if (navList.size === 0){
                    this.setState({
                        loading: false,
                        loadingSmall: false
                    });
                }
                if (navList.size>0){
                    this.setState({
                        objName: navList.toArray()[0]
                    }, () => this.buildLayout());
                }
            }
        }, (err)=>{
            console.log('err', err);
        });
    }
    // 创建layout所需要的数据
    buildLayout() {
        let { objName } = this.state;
        if (objName !== ''){
            this.setState({
                loading: false,
                loadingSmall: true
            });
        }
        let params = {
            offset: 0,
            limit: 50
        };
        let param = this.props.location.query;
        params.keyword = param.keyword;
        Promise.all([
            this.props.fetchLayout(objName, 'list'),
            this.props.fetchSearchData(objName, params),
            this.props.fetchMeta(objName),
            this.props.fetchSchema(objName)
        ]).then(() => {
            let { layout, meta, schema, dataList } = this.props;
            if (layout && layout.size && meta && meta.size && schema && schema.size && dataList && dataList.size){
                let metaItem = meta.get(objName);
                this.props.fetchRelatedObjectsData(metaItem.toJS(), dataList.toJS());
                this.setState({
                    loadingSmall: false,
                    timer: moment()
                });
            }
        }, response => ErrorNotify(response));
    }
    // 处理layout并传递给DataTable组件
    renderTableData(){
        let { navList } = this.props;
        if (navList.size === 0){
            return this.renderNoResult();
        }
        if (this.state.loadingSmall){
            return (
                <div className="demo mcds-layout__row mcds-layout__middle mcds-layout__center" style={{height: '50%'}}>
                    <div className="mcds-layout__item-12" style={{marginTop: '340px'}}>
                        <Loading theme="logo" model="small" />
                    </div>
                </div>
            );
        }
        let { dataList, offset } = this.props;
        let { objName, timer } = this.state;
        if (!dataList || dataList.size === 0){
            return this.renderNoResult();
        }
        let params = {
            offset: 0,
            limit: 50
        };
        let param = this.props.location.query;
        params.keyword = param.keyword;
        let layout = this.props.layout.get ? this.props.layout.get(objName) : undefined;
        let meta = this.props.meta.get ? this.props.meta.get(objName) : undefined;
        let schema = this.props.schema.get ? this.props.schema.get(objName) : undefined;
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
                <DataTable
                    config={config}
                    timer={timer}
                    meta={meta}
                    offset={offset}
                    layout={layout}
                    schema={schema}
                    objName={objName}
                    param={params}
                    data={dataList} />
            </div>);
    }
    // 点击左侧列表
    handleNavClick(v, i){
        this.setState({
            current: i,
            objName: v,
            loadingSmall: true
        }, ()=>this.buildLayout());
    }
    renderNavigation(){
        let { navList, allObjList } = this.props;
        let result = [];
        if (this.state.loading) {
            return (
                <div className="demo mcds-layout__row mcds-layout__middle mcds-layout__center" style={{height: '50%'}}>
                    <div className="mcds-layout__item-12" style={{marginTop: '40px'}}>
                        <Loading theme="logo" model="small" />
                    </div>
                </div>
            );
        }
        if (navList.size === 0){
            return (<div className={classnames('mcds-text__size-12', style['search-nav__noresult'])} >未找到相关结果。</div>);
        }
        navList.toArray().forEach((v, i )=>{
            let nameOfObject = allObjList.get(v);
            if (nameOfObject){
                let displayName =  nameOfObject.get('display');
                result.push(
                    <NavItem onClick={this.handleNavClick.bind(this, v, i)} key={v} className={classnames({'mcds-is-active': this.state.current === i}, 'mcds-text__size-12')}>
                        {displayName}
                    </NavItem>
                );
            }
        });
        return result;
    }
    renderNoResult(){
        return (
            <div className={style['no-result']}>
                <div>
                    <img src="./public/img/img-no-result.svg" />
                </div>
                <div className="mcds-m__t-30"><span>抱歉，你要找的内容可能在火星上</span></div>
            </div>
        );
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
        return (
            <div style={{height: '100%'}}>
                <div className="mcds-layout__item mcds-layout__item-2" style={{height: '100%'}}>
                    <Navigation className={style.navigation}>
                        <NavTitle id="folder-header" className="mcds-text__size-12">
                            搜索结果
                        </NavTitle>
                        <NavList className={style.list}>
                            {this.renderNavigation()}
                        </NavList>
                    </Navigation>
                </div>
                <div className="mcds-layout__item mcds-layout__item-10" style={{position: 'relative'}}>
                    {this.renderTableData()}
                </div>
            </div>
        );
    }
}

Search.propTypes = {
    fetchSearchNav: PropTypes.func,
    fetchSearchData: PropTypes.func,
    fetchMeta: PropTypes.func,
    location: PropTypes.object,
    params: PropTypes.object,
    navList: PropTypes.object,
    dataList: PropTypes.object,
    fetchLayout: PropTypes.func,
    fetchSchema: PropTypes.func,
    layout: PropTypes.object,
    meta: PropTypes.object,
    schema: PropTypes.object,
    fetchAllObj: PropTypes.func,
    allObjList: PropTypes.object,
    offset: PropTypes.number,
    fetchRelatedObjectsData: PropTypes.func
};
Search.contextTypes = {
    router: PropTypes.object.isRequired
};

export default connect(
    state => ({
        navList: state.getIn(['search', 'nav']),
        dataList: state.getIn(['search', 'list']),
        meta: state.getIn(['standardObject', 'meta']),
        allObjList: state.getIn(['standardObject', 'allObjects']),
        schema: state.getIn(['standardObject', 'schema']),
        offset: state.getIn(['search', 'offset']),
        objName: state.getIn(['search', 'objName']),
        layout: state.getIn(['standardObject', 'layout', 'list'])
    }),
    dispatch => bindActionCreators({ fetchLayout, fetchSearchNav, fetchSearchData, fetchSchema, fetchMeta, fetchRelatedObjectsData}, dispatch)
)(Search);
