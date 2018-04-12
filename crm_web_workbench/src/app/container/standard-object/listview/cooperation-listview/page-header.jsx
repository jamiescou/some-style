import PropTypes from 'prop-types';
import { Link } from 'react-router';
import {connect} from 'react-redux';
import classnames from 'classnames';
import {bindActionCreators} from 'redux';
import React, { Component } from 'react';

import CreateCooperatorModal from '../../detailview/modal/create-cooperator';
import { fetchObj } from 'redux/reducers/standard-object/detailview/data';
import {
    BreadCrumbs,
    Crumb,
    Button,
    ButtonGroup
} from 'carbon';

let style = require('styles/modules/standard-object/index.scss');

class PageHeader extends Component {
    constructor(){
        super();
    }

    componentWillMount(){
        let { id, cooperationObjName, objName} = this.context.router.params;
        if (objName && id && cooperationObjName){
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
    renderOptionalButtons(){
        let { objName} = this.context.router.params;
        let { dataDetail } = this.props;
        return (
            <ButtonGroup>
                <CreateCooperatorModal
                    successBack={this.props.successBack}
                    objName={objName}
                    record={dataDetail}
                    userFilter={[dataDetail.get('id')]}
                    button={<Button className="mcds-button mcds-button__item">添加协作成员</Button>}
                    className="mcds-button mcds-button__item" />
            </ButtonGroup>
        );
    }

    renderCrumbleTab() {
        // 标准对象的
        let pageTitle = this.props.meta ? this.props.meta.get('display_name') : '';
        let { objName, id, cooperationObjName} = this.context.router.params;
        let { parentDetailData } = this.props;
        // 查看全部页
        if ( cooperationObjName && id && objName ){
            // 单条对象的
            let name = parentDetailData.get('name');
            return (
                <div className="mcds-media__body " key="detail" >
                    <BreadCrumbs>
                        <Crumb>
                            <Link to={`/sObject/${objName}`}>
                                {pageTitle}
                            </Link>
                        </Crumb>
                        <Crumb>
                            <Link to={`/sObject/${objName}/${id}`}>
                                {name}
                            </Link>
                        </Crumb>
                    </BreadCrumbs>
                    <div className="mcds-text__line-34 mcds-pageheader__title mcds-p__b-30" >协作者</div>
                </div>
            );
        }
    }

    renderPageHeader() {
        let { queryParam } = this.props;
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
                            <li className="mcds-list__item">按最新修改时间排序</li>
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
    data: PropTypes.any,
    queryParam: PropTypes.object,
    meta: PropTypes.object,
    parentDetailData: PropTypes.object,
    dataDetail: PropTypes.object,
    successBack: PropTypes.func
};

PageHeader.contextTypes = {
    router: PropTypes.object
};

export default connect(
    state => ({
        parentDetailData: state.getIn(['standardObject', 'detailview', 'data'])
    }),
    dispatch => bindActionCreators({ fetchObj }, dispatch)
)(PageHeader);

