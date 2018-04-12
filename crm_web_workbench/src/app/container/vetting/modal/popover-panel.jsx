/**
 * 
 */
import _ from 'lodash';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import classnames from 'classnames';
import { connect } from 'react-redux';
import {bindActionCreators} from 'redux';
import React, { Component } from 'react';

import { spliteArrayPerTwo } from '../../standard-object/build-field';
import BaseContext from '../detailview/components/fetch-name';
import { fetchData as fetchDataInfo} from 'redux/reducers/vetting/detailview';
import { fetchOneRequest } from 'requests/common/standard-object';
import { fetchDependency } from 'redux/reducers/standard-object/dependency';
import { fetchLayout } from 'redux/reducers/standard-object/layout';
import { fetchSchema } from 'redux/reducers/standard-object/schema';
import RelatedObjectItem from 'container/standard-object/panel/related-panel';
import {
    Popover,
    PopoverBody,
    PopoverTrigger,
    Loading
} from 'carbon';

let style = require('styles/modules/standard-object/index.scss');

// 设置面板字段显示数量 
const FIELDS_COUNT = 4;

class PopoverPanel extends Component {
    static propTypes = {
        // 需要触发的区域 e.g. <button>点击</button>
        trigger: PropTypes.element.isRequired,

        // standardObject Name  e.g. "Leads"
        objName: PropTypes.string.isRequired,
        // standardObject id e.g. "003bf1572d0354836905ba83aa10b522"
        id: PropTypes.string.isRequired,

        // 用户指定渲染时的展示顺序 e.g array ['name', 'QQ', 'Address', ...]
        // 这个order暂时不用,后期可能用到 暂时先留着
        order: PropTypes.array,

        // 以下是从props上获取的 不需要用户传入
        schema: PropTypes.object,
        dependency: PropTypes.object,
        fetchDataInfo: PropTypes.func,
        fetchSchema: PropTypes.func,
        fetchLayout: PropTypes.func,
        fetchDependency: PropTypes.func,
        layout: PropTypes.object
    }

    constructor(){
        super();
        this.state = {
            loading: true,
            data: '',
            random: _.random(0.1, 1.5)
        };
    }

    // 获取单条数据
    fetchData(){
        let { id, objName, schema, layout } = this.props;
        Promise.all([
            this.props.fetchSchema(objName),
            this.props.fetchLayout(objName, 'detail'),
            fetchOneRequest(objName, id)(),
            this.props.fetchDependency(objName)
        ]).then(res => {
            let { body } = res[2];
            if (!_.isEmpty(body) && schema && schema.size && layout && layout.size) {
                this.setState({
                    loading: false,
                    data: body
                }, () => {
                    let popoverClassName = 'popoverPanel' + this.disposeRandom();
                    let popover = document.querySelector('.' + popoverClassName);
                    if (popover) {
                        document.addEventListener('click', this.handleOutsideMouseClick.bind(this));
                        popover.addEventListener('mouseenter', this.handleInPopover.bind(this));
                        popover.addEventListener('mouseleave', this.handleOutPopover.bind(this));
                    }
                });
            }
        });
    }
    // 处理随机数
    disposeRandom(){
        let random = this.state.random;
        return _.toString(random).slice(2);
    }
    renderDependencyLookup () {
        let { dependency } = this.props;
        let { id, objName } = this.props;
        let { data } = this.state;
        let list = dependency.getIn([objName, 'reverse_lookup']);
        let result = [];
        if (!list) {
            return null;
        }
        list.toMap().map((v, key) => {
            let column_names = v.get('column_names');
            column_names.toArray().map(j => {
                result.push(
                    <li key={key} className={`${style['popover-related']}`}>
                        <RelatedObjectItem
                            defaultLength={2}
                            key={key}
                            needDetailPopover={false}
                            currentObjName={objName}
                            currentObjId={id}
                            relateObjName={key}
                            relatedKey={j}
                            data={data} />
                    </li>
                );
            });
        });
        return result;
    }

    renderDependencyDetail() {
        let { dependency } = this.props;
        let { objName, id } = this.props;
        let { data } = this.state;
        let list = dependency.getIn([objName, 'detail']);
        if (!list) {
            return null;
        }
        let result = list.toMap().map((v, key) => {
            return (
                <li key={key} className={`${style['popover-related']}`}>
                    <RelatedObjectItem
                        key={key}
                        defaultLength={2}
                        needDetailPopover={false}
                        currentObjName={objName}
                        currentObjId={id}
                        relateObjName={key}
                        relatedKey={v}
                        data={data} />
                </li>
            );
        });
        return (<div>{result.toArray()}</div>);
    }
    // 从layout的配置中拿到fields数据
    getFields(){
        let { layout, objName } = this.props;
        let children = layout.getIn(['detail', objName, 'layout', 'children']);
        let components = layout.getIn(['detail', objName, 'components']);
        let config;
        children.forEach(val => {
            let id = val.get('id');
            if (components && components.getIn([id, 'name']) === 'pageHeader') {
                config = components.getIn([id, 'config']);
            }
        });
        return config.get('fields');
    }
    // 对schema数据进行处理
    getSchemaData(){
        let { objName, order} = this.props;
        let schema = this.props.schema.get(objName);
        let result = [];
        let fields = null;
        if (!_.isEmpty(order)) {
            // 如果用户指定了order顺序 就按用户指定的来
            fields = order;
        } else {
            fields = this.getFields().toArray();
            fields = fields.slice(0, FIELDS_COUNT);
        }

        _.forEach(fields, val => {
            if (schema.get(val) && schema.getIn([val, 'readable'])) {
                result.push(schema.get(val));
            }
        });
        return result;
    }

    _buildDependItem(item){
        let { data } = this.state;
        let value = item.get('name');
        return (
            <div>
                <div className="mcds-text__weak mcds-m__b-5">
                    {item.get('display_name')}
                </div>
                <div className="mcds-truncate">
                    <BaseContext
                        value={data[value]}
                        schema={item} />
                </div>
            </div>
        );
    }
    // 分列渲染
    _renderColumn(fields, listIndex){
        let column = _.map(fields, (v, i) => {
            let className = classnames('mcds-layout__item-6', {
                'mcds-p__r-15': i === 0,
                'mcds-p__l-15': i === 1
            });
            return (
                <div className={classnames('mcds-truncate', className)} key={i}>
                    {v}
                </div>
            );
        });
        return (
            <div className={classnames('mcds-layout__item-12 mcds-m__b-15')} key={listIndex}>
                {column}
            </div>
        );
    }

    // 渲染面板头部信息
    renderPanelHeader(){
        let { data } = this.state;
        let { objName, id } = this.props;
        let avatar = null;
        if (objName === 'User' && data.Avatar) {
            avatar = data.Avatar;
        }

        return (
            <div className="mcds-layout__item-12 mcds-p__b-15">
                <div className="mcds-media">
                    <div className="mcds-media__figure">
                        <div className="mcds-pageheader__header-left-icon mcds-avatar mcds-avatar__size-24">
                            {avatar ? <img src={avatar} /> : null}
                        </div>
                    </div>
                    <div className="mcds-media__body">
                        <div className="mcds-pageheader__title mcds-truncate mcds-p__r-20">
                            <Link to={`/sObject/${objName}/${id}`}>
                                {data.name}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // 渲染面板主体信息
    renderPanelBody(){
        let schema = this.getSchemaData();
        let items = _.map(schema, v => this._buildDependItem(v));
        let fieldsList = spliteArrayPerTwo(items);
        return fieldsList.map(this._renderColumn);
    }
    // 渲染面板信息
    renderPopoverBody(){
        return (
            <ul>
                <li className={classnames('mcds-layout__column', style['popover-body__p-20'])}>
                    {this.renderPanelHeader()}
                    {this.renderPanelBody()}
                </li>
                {this.renderDependencyDetail()}
                {this.renderDependencyLookup()}
            </ul>
        );
    }

    renderPopover(){
        let popoverClassName = 'popoverPanel' + this.disposeRandom();
        let className = this.state.loading ? 'mcds-p__t-25 mcds-p__b-25' : '';
        return (
            <Popover className={classnames(popoverClassName, style['popover-container'])}>
                <PopoverBody className={classnames(className, `${style['popover-body']}`)}>
                    {
                        this.state.loading ? <Loading /> : this.renderPopoverBody()
                    }
                </PopoverBody>
            </Popover>
        );
    }

    // 移入显示面板时的处理
    handleInPopover(e){
        clearTimeout(this.closeTimer);
        e.stopPropagation();
    }
    // 移出显示面板时的处理
    handleOutPopover(e){
        clearTimeout(this.openTimer);
        this.closeTimer = setTimeout(() => {
            this.close();
            this.resetState();
        }, 1000);
        e.stopPropagation();
    }
    // 点击判断是否需要面板消失
    handleOutsideMouseClick(e) {
        let popoverClassName = 'popoverPanel' + this.disposeRandom();
        let popover = document.querySelector('.' + popoverClassName);
        if (popover) {
            if (e.target.contains(popover) || popover.contains(e.target)) { return; }
            this.close();
            this.resetState();
        }
        e.stopPropagation();
    }
    // 移入trigger时的处理
    popoverTriggerIn(open){
        clearTimeout(this.closeTimer);
        this.openTimer = setTimeout(() => {
            open();
            this.fetchData();
        }, 500);
    }

    // 移出trigger时的处理 
    popoverTriggerOut(close){
        this.close = close;
        clearTimeout(this.openTimer);
        this.closeTimer = setTimeout(() => {
            close();
            this.resetState();
            let popoverClassName = 'popoverPanel' + this.disposeRandom();
            let popover = document.querySelector('.' + popoverClassName);
            if (popover) {
                document.removeEventListener('click', this.handleOutsideMouseClick.bind(this));
                popover.removeEventListener('mouseenter', this.handleInPopover.bind(this));
                popover.removeEventListener('mouseleave', this.handleOutPopover.bind(this));
            }
        }, 1000);
    }

    resetState(){
        setTimeout(() => {
            this.setState({
                loading: true,
                data: ''
            });
        }, 100);
    }

    render(){
        return (
            <PopoverTrigger
                triggerBy="hover"
                placement="right-bottom"
                onMouseOver={::this.popoverTriggerIn}
                onMouseOut={::this.popoverTriggerOut}
                overlay={this.renderPopover()}>
                {this.props.trigger}
            </PopoverTrigger>
        );
    }
}

export default connect(
    state => ({
        schema: state.getIn(['standardObject', 'schema']),
        layout: state.getIn(['standardObject', 'layout']),
        dependency: state.getIn(['standardObject', 'dependency'])
    }),
    dispatch => bindActionCreators({
        fetchDependency,
        fetchOneRequest,
        fetchSchema,
        fetchDataInfo,
        fetchLayout
    }, dispatch)
)(PopoverPanel);
