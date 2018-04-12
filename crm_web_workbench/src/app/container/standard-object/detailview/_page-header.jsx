/* eslint-disable react/no-find-dom-node */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import ReactDOM from 'react-dom';

import { browserHistory } from 'react-router';

import DetailField from './base-field';
import { fetchObj } from 'redux/reducers/standard-object/detailview/data';
import { updateDetailviewData, claimDetailviewTerritory } from 'redux/reducers/standard-object/detailview/data';
import { checkEditable, checkTransferable, checkDelable } from '../build-field';
import { deleteData } from 'redux/reducers/standard-object/listview/list';

import ConvertModal from '../modal/convert';
import CreateModal from '../modal/create';
import UpdateModal from '../modal/update';
import DeleteModal from '../modal/delete';
import TransferModal from '../modal/transfer';

import AllocateModal from './modal/allocate';
import ErrorNotify from 'container/share/error/error-notify';
import {
    Button,
    ButtonGroup,
    StatefulButton,
    notify
} from 'carbon';

import style from 'styles/modules/standard-object/index.scss';

// @connect(
//     state => ({}),
//     dispatch => bindActionCreators({ buttonCommonRequest, fetchRelatedObjectsData, deleteObject }, dispatch)
// )
class pageHeader extends Component {
    constructor() {
        super();
    }

    componentDidMount() {
        let { info } = this.props;
        if (info && info.action === 'update' && !info.curObjName) {
            let update = ReactDOM.findDOMNode(this.refs.updateModal);
            update.click();
        }
    }

    _handleOptionalButtonsOnClick(action) {
        let { type } = action;
        switch (type) {
        case 'api':
            break;
        case 'modal':
            // 这层的判断可能会没用,原想三个button都走同一个方法
            // 然后用过一个公共的function去找打开Modal
            // 可以考虑一下.哪个更好
            // this.props.openModal('modalName');
            console.log('this is modal');
            break;
        case 'jump':
            // jumptopage
            console.log('this is modal');
            break;
        default:
            console.log('default', 'default');
        }
    }
    // 海的领取操作
    handleClaimRecord(id){
        let { objName } = this.context.router.params;
        this.props.claimDetailviewTerritory(id).then(() => {
            this.props.fetchObj(objName, id);
            notify.add('领取成功');
        }, error => ErrorNotify(error));
    }

    // 生成statefull button
    renderDefaultButton(props = this.props) {
        // 临时从props上去获取.以后可能换成函数去获取
        let configs = props.config;
        let _onClick = () => {};
        let defaultButtonsName = '';

        if (configs.get('defaultButtons')) {
            defaultButtonsName = configs.getIn(['defaultButtons', 'name']);
            _onClick = this._handleOptionalButtonsOnClick.bind(this, configs.getIn(['defaultButtons', 'action']), {});
            return <StatefulButton onClick={_onClick}>{defaultButtonsName}</StatefulButton>;

        }
        return null;
    }

    // 生成 简要的数据 table
    renderFields(props = this.props) {
        // 临时从props上去获取.以后可能换成函数去获取
        let schemas = props.schema;
        let data = props.data;
        let configs = props.config;
        let { objName } = this.context.router.params;
        // console.log("props.schema renderFields", schemas);
        let getFields = (config = configs, schema = schemas) => {
            let fds = config.get('fields');
            if (!fds || fds.size === 0) {
                return false;
            }

            let tableTitle =[];
            let tableBody = [];
            fds.toArray().map((v, i) => {
                if (i === 0) {
                    style.paddingLeft = 0;
                }
                let th = <div className="mcds-flex2 mcds-truncate" key={v}>{schema.getIn([v, 'display_name'])}</div>;
                let td = (
                    <div className="mcds-flex2 mcds-truncate" key={v}>
                        {
                            new DetailField({
                                data: data,
                                objName: objName,
                                value: data.get(v),
                                schema: schema.get(v),
                                needDetailPopover: true
                            }).render()
                        }
                    </div>
                );

                tableTitle.push(th);
                tableBody.push(td);
            });

            return (
                <div className="mcds-flex__table table mcds-m__t-28">
                    <div className="mcds-table__title">
                        {tableTitle.slice(0, 5)}
                    </div>
                    <div className="mcds-table__content">
                        {tableBody.slice(0, 5)}
                    </div>
                </div>
            );
        };

        return getFields();
    }

    // 生成 右上角的 buttonGroup;
    renderOptionalButtons(props = this.props) {
        // 临时从props上去获取.以后可能换成函数去获取
        let data = props.data;
        let configs = props.config;
        let user_id = props.user_id;
        let { objName, id } = this.context.router.params;
        let getOptionalButtons = (config = configs) => {
            let result = [];
            let optionalButtons = config.get('optionalButtons');
            if (!optionalButtons) {
                return false;
            }
            result = optionalButtons.toArray().map((v, i) => {
                // TODO
                // 三种不同的action:type 可以想一下抽像成一个类,怎么做,我暂时不想想
                let type = v.get('type');
                let displayName = v.get('displayName');
                if (type === 'modal') {
                    let layoutObjName = v.get('objName');
                    let operation = v.get('operation');
                    let order = v.get('order');
                    switch (operation){
                    case 'create':
                        return (<CreateModal
                            fromPage="detail"
                            key={i}
                            trigger={<Button className="mcds-button__item">{displayName}</Button>}
                            className="mcds-button__item"
                            order={order ? order.toJS() : null}
                            objName={layoutObjName || objName} />);
                    case 'edit':
                        return checkEditable(data) ? <UpdateModal
                            ref="updateModal"
                            fromPage="detail"
                            key={i}
                            trigger={<Button id={objName} className="mcds-button__item">{displayName}</Button>}
                            className="mcds-button__item"
                            objName={objName}
                            id={id}
                            success={this.props.updateDetailviewData}
                            order={order ? order.toJS() : null} /> : null;
                    case 'delete':
                        return checkDelable(data) ? <DeleteModal
                            key={i} trigger={<Button className="mcds-button__item">{displayName}</Button>} className="mcds-button__item" objName={objName} id={id}
                            success={() => { browserHistory.push(`/sObject/${objName}`); }} /> : null;
                    case 'transfer':
                        return checkTransferable(data) ? <TransferModal key={i} trigger={<Button className="mcds-button__item">{displayName}</Button>} className="mcds-button__item" objName={objName} id={id} /> : null;
                    default:
                        throw new Error(`not found ${operation} about modal operation`);
                    }
                }
                if (type === 'convert') {
                    let actionName = v.get('actionName');
                    return objName === 'Leads' ? <ConvertModal
                        key={i} trigger={<Button className="mcds-button__item">{displayName}</Button>} className="mcds-button__item" objName={objName} detail={data}
                        actionName={actionName} /> : null;
                }
            });
            return result;
        };
        // eslint-disable-next-line
        let getTerritoryButton = () => {
            let hasTransferPermission = checkTransferable(data);
            if (hasTransferPermission && (data.get('owner') === user_id)) {
                return (
                    <AllocateModal
                        success={() => { browserHistory.push(`/sObject/${objName}`); }}
                        id={id}
                        objName={objName}
                        trigger={<Button className="mcds-button__item">退回公海</Button>} />
                );
            } else if (!data.get('owner')) {
                return (<Button className="mcds-button__item" onClick={this.handleClaimRecord.bind(this, id)}>领取</Button>);
            }
        };
        return <ButtonGroup>{/* {getTerritoryButton()} */}{getOptionalButtons()}</ButtonGroup>;
    }
    routerBack(objName) {
        this.context.router.push(`/sObject/${objName}`);
    }

    render(){
        let { data, meta } = this.props;
        let pageName = meta.get('display_name');
        return (
            <div className={`mcds-pageheader ${style['detail-pageheader']}`} >
                <div className="mcds-grid mcds-pageheader__header">
                    <div className="mcds-pageheader__header-left" style={{width: 0 }}>
                        <div className="mcds-media">
                            <div className="mcds-media__figure mcds-p__t-6 mcds-m__r-30">
                                <div className="mcds-pageheader__header-left-icon" />
                            </div>
                            <div className="mcds-media__body">
                                <span className="mcds-pageheader__header-left-text">{pageName}详情</span>
                                <div className="mcds-pageheader__title mcds-truncate">
                                    {data.get('name')}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mcds-pageheader__header-right">
                        {this.renderDefaultButton()}
                        {this.renderOptionalButtons()}
                    </div>
                </div>
                <div className="mcs-m__t-20">
                    {this.renderFields()}
                </div>
            </div>
        );
    }
}

pageHeader.propTypes = {
    updateDetailviewData: PropTypes.func,
    data: PropTypes.object,
    meta: PropTypes.object,
    info: PropTypes.object,
    fetchObj: PropTypes.func, // 获取单条数据
    claimDetailviewTerritory: PropTypes.func, // 领取数据
    user_id: PropTypes.string // 用户id
};

pageHeader.contextTypes = {
    router: PropTypes.object.isRequired
};

export default connect(
    state => ({
        user_id: state.getIn(['userProfile', 'userId']),
        info: state.getIn(['vetting', 'listview', 'info']) // 审批页面的信息，取来是为了用action区分弹update的modal还是create的modal
    }),
    dispatch => bindActionCreators({ deleteData, updateDetailviewData, claimDetailviewTerritory, fetchObj }, dispatch)
)(pageHeader);
