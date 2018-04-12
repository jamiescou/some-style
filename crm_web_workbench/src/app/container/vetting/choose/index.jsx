import {connect} from 'react-redux';
import { Link } from 'react-router';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';

import style from 'styles/modules/vetting/choose.scss';
import { fetchSchema } from 'redux/reducers/standard-object/schema';
import { fetchOneGroup } from 'redux/reducers/acl/group';
import { fetchOneRole } from 'redux/reducers/acl/role';
import { fetchOneRequest } from 'requests/common/standard-object';
import { fetchRelatedDataListByIds } from 'redux/reducers/standard-object/related-object/data';

import Points from '../modal/Points';
import ModalCondition from '../modal/condition';
import VettingSkipModal from '../modal/skip-modal';
import { resetApprovalParam } from '../../__base/approval';
import { fetchTempDataRequest } from 'requests/common/vetting';

import {
    Table,
    Crumb,
    BreadCrumbs,
    Radio
} from 'carbon';

import VettingFooter from '../components/footer';

class VettingChoose extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: props.data.getIn([0, 'Id']),
            showSkipModal: false
        };
    }

    componentWillMount() {
        let { data } = this.props;
        if (data.size === 1) { // 如果只有一个审批模板时，直接到发起审批页面；
            let { id } = this.state;
            this.props.router.push(`/vetting/approval/${id}`);
            return;
        }
        let { info } = this.props;
        let currentPath = this.context.router.getCurrentLocation().pathname;
        if (!info) {
            // 如果用没有有 objName 直接返回到主页
            this.props.router.push('/');
        } else {
            if (info.curId && info.curObjName && info.page === 'detail') {
                this.previousPage = `/sObject/${info.curObjName}/${info.curId}`;
            } else if (info.objId && info.curObjName && info.page === 'detail') {
                this.previousPage = `/sObject/${info.curObjName}/${info.objId}`;
            } else if (info.objId && info.page === 'detail') {
                this.previousPage = `/sObject/${info.objName}/${info.objId}`;
            } else if (info.page === 'vetting') {
                this.previousPage = '/vetting';
            } else {
                this.previousPage = `/sObject/${info.objName}`;
            }
            this.unListen = this.context.router.listenBefore((a, b) => {
                if (currentPath === '/vetting/choose') {
                    this.giveup(a, b);
                }
            });
        }
    }
    componentDidMount () {
        let { objName } = this.props.info;
        if (objName) {
            this.props.fetchSchema(objName);
        }
    }
    componentWillUnmount() {
        if (this.unListen && typeof this.unListen === 'function') {
            this.unListen();
        }
    }
    giveup(a, cb) {
        this._cb = cb;
        let { id } = this.state;
        let nextPage = `/vetting/approval/${id}`;
        if (a.pathname === this.previousPage || a.pathname === nextPage) {
            cb(true);
        } else {
            this.setState({
                showSkipModal: true
            });
        }
    }
    skipPage() {
        let { info } = this.props;
        this._cb(true);
        resetApprovalParam(info.action);
    }
    _handleId(id) {
        this.setState({
            id: id
        });
    }
    renderTab() {
        return (
            <Table className={style['vetting-choose__table']}>
                <thead>
                    <tr className="mcds-text-title__caps">
                        <th className="mcds-truncate">
                            审批流
                        </th>
                        <th className="mcds-truncate">
                            审批字段
                        </th>
                        <th className="mcds-truncate" />
                    </tr>
                </thead>
                <tbody>
                    {this.renderTabBody()}
                </tbody>
            </Table>
        );
    }
    // 处理检验复合字段 如Price.value 处理成 Price ，特殊的单独处理
    getFieldData(fieldName, objName){
        let { schema } = this.props;
        let name = '';
        let fieldArr = fieldName.split('.');
        if ( fieldArr[0] === 'Price' && fieldArr[1] === 'symbol') {
            name = '套餐价格单位';
        } else {
            name = schema.getIn([objName, fieldArr[0], 'display_name']);
        }
        return name;
    }
    renderTabBody() {
        let {data, info, user, userId, schema } = this.props;
        if (!info || !data) {
            return false;
        }
        let list = data.toArray();
        let objName = info.objName;
        let recordText = (d) => {
            let recordList = d.getIn(['RecordCond', 'Exps']);
            let result = '';
            recordList.forEach( val =>{
                let type = val.getIn(['Stmt', 'FieldName']);
                let name = this.getFieldData(type, objName);
                result = result + ' ' + name;
            });
            return result;
        };
        if (schema) {
            return list.map( item => (
                <tr key={item.get('Id')}>
                    <td className="mcds-truncate">
                        <div className="mcds-truncate mcds-p__l-1">
                            <Radio
                                id={`radio${item.get('Id')}`}
                                label={<div className={`mcds-truncate ${style['vetting-choose__table-label']}`}>{item.get('Name')}</div>}
                                name="tempList"
                                onClick={this._handleId.bind(this, item.get('Id'))}
                                checked={item.get('Id') === this.state.id}
                                defaultValue={item.get('Id')} />
                        </div>
                    </td>
                    <td className="mcds-truncate">
                        <div className="mcds-truncate">
                            {recordText(item)}
                        </div>
                    </td>
                    <td>
                        <div className="mcds-truncate">
                            <ModalCondition
                                trigger={<Link className="mcds-m__r-30">检验条件</Link>}
                                record={item.get('RecordCond')}
                                user={item.get('UserCond')}
                                schema={schema.get(objName)}
                                fetchOneRequest={this.props.fetchOneRequest}
                                fetchOneGroup={this.props.fetchOneGroup}
                                fetchOneRole={this.props.fetchOneRole} />
                            <Points
                                trigger={<Link>审批流节点</Link>}
                                info={info}
                                id={item.get('Id')}
                                user={user}
                                userId={userId}
                                fetchRelatedDataListByIds={this.props.fetchRelatedDataListByIds}
                                fetchOneRequest={this.props.fetchOneRequest} />
                        </div>
                    </td>
                </tr>
            ));
        }
    }

    renderReturnLink() {
        return <Link className="pull-left" to={this.previousPage} >返回编辑</Link>;
    }
    renderNextLink() {
        let { id } = this.state;
        return <Link className="pull-right" to={`/vetting/approval/${id}`} >下一步</Link>;

    }

    render() {
        return (
            <div>
                <VettingSkipModal showSkipModal={this.state.showSkipModal} onConfirm={::this.skipPage} />
                <div className="mcds-pageheader">
                    <div className="mcds-grid mcds-pageheader__header">
                        <div className="mcds-pageheader__header-left">
                            <div className="mcds-media">
                                <div className="mcds-media__figure mcds-m__r-30 mcds-m__t-7">
                                    <div className={`mcds-pageheader__header-left-icon ${style['vetting-choose__pageheader-rectangle']}`}>
                                        <i className={`mcds-icon__seal-solid-24 ${style['vetting-choose__pageheader-logo']}`} />
                                    </div>
                                </div>
                                <div className="mcds-media__body" key="detail" >
                                    <BreadCrumbs>
                                        <Crumb className={style['vetting-choose__pageheader-crumb']}>
                                            审批
                                        </Crumb>
                                    </BreadCrumbs>
                                    <div className="mcds-text__line-34 mcds-pageheader__title mcds-p__b-30" >选择审批</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mcds-grid mcds-pageheader__body" />
                    <div className="mcds-grid mcds-pageheader__footer">
                        <div className="mcds-pageheader__footer-left">
                            <p className={style['vetting-choose__pageheader-footer-text']}>
                                你的保存操作经过检验条件判断后需要审批，请在以下审批中选择一个只有通过审批后，才会对相应的审批字段进行保存（<span>其余字段不会保存</span>）。
                            </p>
                        </div>
                    </div>
                </div>
                <div className="mcds-container" >
                    {this.renderTab()}
                </div>
                <VettingFooter>
                    {::this.renderReturnLink()}
                    {::this.renderNextLink()}
                </VettingFooter>
            </div>
        );
    }
}
VettingChoose.propTypes = {
    // data为空的时候是array 有值得时候是object
    data: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.array
    ]),
    shcema: PropTypes.object,
    info: PropTypes.object,
    users: PropTypes.object,
    router: PropTypes.object,
    recordText: PropTypes.string,
    user: PropTypes.string,
    schema: PropTypes.object,
    relatedUsers: PropTypes.object,
    fetchSchema: PropTypes.func,
    fetchOneRole: PropTypes.func,
    fetchOneGroup: PropTypes.func,
    userId: PropTypes.string,
    fetchOneRequest: PropTypes.func,
    fetchTempDataRequest: PropTypes.func,
    fetchRelatedDataListByIds: PropTypes.func
};
VettingChoose.contextTypes = {
    router: PropTypes.object
};
export default connect(
    state => ({
        users: state.getIn(['setup', 'user', 'data']),
        userId: state.getIn(['userProfile', 'userId']),
        schema: state.getIn(['standardObject', 'schema']),
        data: state.getIn(['vetting', 'listview', 'data']),
        info: state.getIn(['vetting', 'listview', 'info'])
    }),
    dispatch => bindActionCreators({fetchSchema, fetchOneRequest, fetchOneRole, fetchOneGroup, fetchTempDataRequest, fetchRelatedDataListByIds}, dispatch))(VettingChoose);
