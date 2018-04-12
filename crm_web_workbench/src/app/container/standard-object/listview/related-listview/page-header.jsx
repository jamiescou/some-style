import I from 'immutable';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import {connect} from 'react-redux';
import { Link } from 'react-router';
import React, { Component } from 'react';
import {bindActionCreators} from 'redux';

import { fetchMeta } from 'redux/reducers/standard-object/meta';
import { fetchObj } from 'redux/reducers/standard-object/detailview/data';
import {
    BreadCrumbs,
    Crumb,
    Loading,
    Button,
    ButtonGroup
} from 'carbon';

import CreateModal from '../../modal/create';

let style = require('styles/modules/standard-object/index.scss');

class PageHeader extends Component {
    constructor(){
        super();
    }

    componentWillMount(){
        let { id, relatedKey, objName} = this.context.router.params;
        if (objName && id && relatedKey){
            this.props.fetchMeta(objName);
            this.props.fetchObj(objName, id);
        }
    }

    renderCount() {
        let { data, queryParam } = this.props;
        let result = 0;
        if (data) {
            if (data.size >= 50 && !queryParam.load) {
                result = data.size + '+ ';
            } else {
                result = data.size;
            }
        }
        return result;
    }
    renderCrumbleTab() {
        // 关联对象的
        let pageTitle = this.props.meta ? this.props.meta.get('display_name') : '';

        let { objName, relatedKey, id, relateObjName} = this.context.router.params;
        let { metaMap, parentDetailData } = this.props;
        // 查看全部页
        if ( relateObjName && relatedKey && id ){
            // 单条对象的
            let name = parentDetailData.get('name');
            let firstName = metaMap.get(objName);
            if (firstName){
                // 标准对象的
                let parentObjectName = firstName.getIn(['display_name']);
                return (
                    <div className="mcds-media__body " key="detail" >
                        <BreadCrumbs>
                            <Crumb>
                                <Link to={`/sObject/${objName}`}>
                                    {parentObjectName}
                                </Link>
                            </Crumb>
                            <Crumb>
                                <Link to={`/sObject/${objName}/${id}`}>
                                    {name}
                                </Link>
                            </Crumb>
                        </BreadCrumbs>
                        <div className="mcds-text__line-34 mcds-pageheader__title mcds-p__b-30" >{pageTitle}</div>
                    </div>
                );
            }
            return (
                <div key="load" className="demo mcds-layout__row mcds-layout__middle mcds-layout__center" style={{height: '50%'}}>
                    <div className="mcds-layout__item-12" style={{marginTop: '40px'}}>
                        <Loading theme="logo" model="small" />
                    </div>
                </div>
            );
        }
    }

    getEditModalDefaultValue() {
        let { id, relatedKey } = this.context.router.params;
        let { schema } = this.props;
        let defaultValue = {};
        // 子对象查询条件
        // 如果关联字段不存在.或者 schema没有获取到 直接返回false
        if (!relatedKey || !schema) {
            return false;
        }


        defaultValue[relatedKey] = id;
        return defaultValue;
    }

    renderOptionalButtons(){
        let { relateObjName } = this.context.router.params;
        let defaultData = this.getEditModalDefaultValue();
        return (
            <ButtonGroup>
                <CreateModal
                    success={this.props.createSuccessBack}
                    defaultValue={I.fromJS(defaultData)}
                    objName={relateObjName}
                    trigger={<Button className="mcds-button mcds-button__item">新建</Button>}
                    className="mcds-button mcds-button__item" />
            </ButtonGroup>
        );
    }

    renderPageHeader() {
        let {schema, queryParam} = this.props;
        return (
            <div className={classnames('mcds-pageheader', style.relative)}>
                <div className="mcds-grid mcds-pageheader__header">
                    <div className="mcds-pageheader__header-left">
                        <div className="mcds-media">
                            <div className="mcds-m__r-30 mcds-p__t-6">
                                <div className="mcds-pageheader__header-left-icon" />
                            </div>
                            { this.renderCrumbleTab() }
                        </div>
                    </div>
                    <div className="mcds-pageheader__header-right">
                        {::this.renderOptionalButtons()}
                    </div>
                </div>
                <div className="mcds-grid mcds-pageheader__footer">
                    <div className="mcds-pageheader__footer-left">
                        <ul className="mcds-list__horizontal mcds-text__weak mcds-text__size-12">
                            <li className="mcds-list__item">{::this.renderCount()}个项目</li>
                            <li className="mcds-list__item mcds-p__l-7 mcds-p__r-7">•</li>
                            <li className="mcds-list__item">按{queryParam.order_by ? schema.get(queryParam.order_by).get('display_name') : '最新修改时间'}排序</li>
                            <li className="mcds-list__item mcds-p__l-7 mcds-p__r-7">•</li>
                            <li className="mcds-list__item">最后更新</li>
                            <li className="mcds-list__item mcds-p__l-5">{queryParam.update_date}</li>
                        </ul>
                    </div>
                </div>
            </div>
        );
    }

    render() {
        return (
            <div>
                {this.renderPageHeader()}
            </div>
        );
    }
}

PageHeader.propTypes = {
    objName: PropTypes.string,
    fetchObj: PropTypes.func,
    data: PropTypes.object,
    queryParam: PropTypes.object,
    meta: PropTypes.object,
    fetchMeta: PropTypes.func,
    metaMap: PropTypes.object,
    parentDetailData: PropTypes.object,
    schema: PropTypes.object,
    createSuccessBack: PropTypes.func
};

PageHeader.contextTypes = {
    router: PropTypes.object
};

export default connect(
    state => ({
        metaMap: state.getIn(['standardObject', 'meta']),
        parentDetailData: state.getIn(['standardObject', 'detailview', 'data'])
    }),
    dispatch => bindActionCreators({ fetchObj, fetchMeta }, dispatch)
)(PageHeader);

