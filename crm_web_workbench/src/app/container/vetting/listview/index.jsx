import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import { browserHistory } from 'react-router';
import { Link } from 'react-router';

import _ from 'lodash';
import classnames from 'classnames';
import styles from 'styles/modules/vetting/index.scss';

import CreateApproval from '../modal/create-approval';
import { default_avatar } from '../../../utils/user-setting.js';
import CreateModal from '../../standard-object/modal/create';
import { convertSeconds } from '../../../utils/convert';

import {
    fetchList, // 获取页面数据
    fetchCount,
    fetchApprovalObj
} from 'redux/reducers/vetting/listview';
import { fetchMeta } from 'redux/reducers/standard-object/meta';
import { fetchLayout } from 'redux/reducers/standard-object/layout';
import { fetchRelatedDataListByIds } from 'redux/reducers/standard-object/related-object/data';

import {
    Tab,
    TabItem,
    TabContent,
    TableResize,
    Loading,
    Pagination,
    Button,
    Th
} from 'carbon';

const sortParameter=[
    {
        type: 'Duration',
        sort: 'created_at'
    },
    {
        type: 'SerialNum',
        sort: 'serial_num'
    },
    {
        type: 'Status',
        sort: 'status'
    },
    {
        type: 'Type',
        sort: 'obj_type'
    },
    {
        type: 'CreateUid',
        sort: 'create_uid'
    }
];

class VettingList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            approvalObjName: props.info && props.info.objName,
            order: null
        };
        this.getObjName = this.getObjName.bind(this);
        this.handleCurrentSize = this.handleCurrentSize.bind(this);
    }
    componentWillMount () {
        this.resetRoute();
    }

    componentDidMount() {
        let { info, location } = this.props;
        if (info) {
            this.renderCreate(info.objName);
        }
        let data = this.handlerParams(location.query);
        if (data) {
            this._refData(data);
        }
    }

    componentWillReceiveProps (nextProps) {
        let { query } = nextProps.location;
        if (!_.isEqual(query, this.props.location.query)) {
            if (!_.isEqual(query, {})) { // 判断是够为空对象，为空对象时添加默认值
                let data = this.handlerParams(query);
                this._refData(data);
            } else {
                this.resetRoute();
            }
        }
    }

    resetRoute () {
        browserHistory.push({pathname: '/vetting', query: {
            listtype: 'Vote',
            orderfield: 'created_at',
            odtype: 'Desc',
            previous: 0,
            perpage: 20
        }});
    }

    handlerParams (query) {
        return {
            listtype: query.listtype,
            orderfield: query.orderfield,
            odtype: query.odtype,
            previous: query.previous,
            perpage: query.perpage
        };
    }

    _refData(params) {
        Promise.all([
            this.props.fetchList(params),
            this.props.fetchCount(),
            this.props.fetchApprovalObj()
        ]).then(() => {
            this.setState({loading: false});
            let data = this.props.data.get('AwList');
            if ( data && !_.isEmpty(data)) {
                let list = data.toArray();
                let value = [];
                list.forEach((d)=>{
                    value.push(d.get('CreateUid'));
                });
                this.props.fetchRelatedDataListByIds('User', value);
            }
        }, (err)=>{
            console.log('err', err);
        });
    }

    // 分页
    renderPageination() {
        let { data, location } = this.props;
        let { query } = location;
        let ceil = Math.ceil(data.get('Count')/query.perpage);
        return (
            <Pagination
                perPage={[10, 20, 50]}
                options={{showPrevious: true, showNext: true, showJumpPage: false, showPerPageCount: false}}
                perPageCountValue={parseInt(query.perpage)}
                onPerPageChange={this.handleCurrentSize}
                current={parseInt(query.previous)+1}
                onChange={this.handlePage.bind(this)}
                total={ceil} />
        );
    }
    handlerRouterPath (params) {
        let { query } = this.props.location;
        browserHistory.push({pathname: '/vetting', query: {
            listtype: params.listtype || query.listtype,
            orderfield: params.orderfield || query.orderfield,
            odtype: params.odtype || query.odtype,
            previous: (params.previous || query.previous)-1,
            perpage: params.perpage || query.perpage
        }});
    }

    handlePage(i) {
        this.setState({
            loading: true
        }, ()=>{
            this.handlerRouterPath({previous: i});
        });
    }

    handleCurrentSize(v) {
        this.setState({
            loading: true
        }, ()=>{
            this.handlerRouterPath({
                perpage: v,
                previous: 1
            });
        });
    }

    changeItem(type) {
        if (!_.isEqual(type, this.props.location.query.listtype)) {
            this.setState({
                loading: true
            }, ()=>{
                this.handlerRouterPath({
                    listtype: type,
                    orderfield: 'created_at',
                    perpage: 20,
                    previous: 1
                });
            });
        }
    }

    renderLoading(){
        return (
            <div
                className="demo mcds-layout__row mcds-layout__middle mcds-layout__center"
                style={{
                    height: '50%'
                }}>
                <div className="mcds-layout__item-12">
                    <Loading theme="logo" model="small" />
                </div>
            </div>
        );
    }
    renderTab() {
        let tabItemArr = [
            {
                name: '我提交的',
                type: 'Submit'
            },
            {
                name: '待我审批',
                type: 'Vote'
            },
            {
                name: '我已审批',
                type: 'Approved'
            },
            // {
            //     name: '我的审批',
            //     type: 'OwnerAws'
            // },
            {
                name: '抄送给我',
                type: 'Carboncopy'
            }
        ];
        let tabItemList = tabItemArr.map(item=>{
            let {name, type} = item;
            return (<TabItem
                key={type}
                className={classnames(this.props.location.query.listtype === type ? 'mcds-tab__active' : null)}
                onClick={this.changeItem.bind(this, type)}>
                <span className="mcds-tab-left__icon mcds-icon__open-folder" />
                {name}{this.getTypeCount(type)}
                <span className="mcds-tab-right__icon mcds-icon__close-medium" />
            </TabItem>);
        });
        return (
            <Tab className={`${styles['index-tab__header']} mcds-tab__default`}>
                {tabItemList}
                <TabContent
                    className={`${styles['tab-content']} mcds-tab__active`}>
                    {this.state.loading ? this.renderLoading() : this.renderTabCon()}
                </TabContent>
            </Tab>
        );
    }

    getTypeCount(type) {
        let { listTypeCount } = this.props;
        let result = null;
        if (listTypeCount) {
            listTypeCount.toArray().forEach(v => {
                if (v.get('LType') === type){
                    result = v.get('Count');
                }
            });
        }
        return result ? `(${result})` : null;
    }

    renderTabCon(){
        let { data } = this.props;
        let count = data.get('Count');
        let thArr = [
            {
                name: '审批流名称',
                type: 'Name'
            },
            {
                name: '提交人',
                type: 'CreateUid'
            },
            {
                name: '审批流编号',
                type: 'SerialNum'
            },
            {
                name: '描述',
                type: 'Description'
            },
            {
                name: '类型',
                type: 'Type'
            },
            {
                name: '当前审批点',
                type: 'CurrentPoint'
            },
            {
                name: '状态',
                type: 'Status'
            },
            {
                name: '审批用时',
                type: 'Duration'
            }
        ];
        let ths = thArr.map((v, i)=>{
            return (
                <Th
                    key={i}
                    className={this.renderClass(v.type)}
                    onClick={this.handlerSort.bind(this, v.type)}
                    icon={this.renderIcon(v.type)}
                    resizable={true}>
                    { v.name }
                </Th>
            );
        });
        return (
            <div className={styles['table-wrapper']}>
                <TableResize className={styles['table-fixed']}>
                    <thead>
                        <tr className="mcds-text-title__caps">
                            {ths}
                        </tr>
                    </thead>
                    <tbody>
                        {this.renderTabBody()}
                    </tbody>
                </TableResize>
                {count ? null : <div className={`mcds-text__weak mcds-text__size-18 ${styles.fixedLayout}`}>暂无数据</div>}
            </div>
        );
    }
    returnSortResult (type) {
        let result;
        switch (type) {
        case 'Duration':
            result = 'created_at';
            break;
        case 'SerialNum':
            result = 'serial_num';
            break;
        case 'Status':
            result = 'status';
            break;
        case 'Type':
            result = 'obj_type';
            break;
        case 'CreateUid':
            result = 'create_uid';
            break;
        default:
            break;
        }
        return result;
    }

    // 排序时请求的数据
    sortValue (result, order) {
        let { query } = this.props.location;
        this.setState({
            loading: true
        }, ()=>{
            this.handlerRouterPath({
                odtype: order,
                orderfield: result,
                previous: parseInt(query.previous) + 1
            });
        });
    }

    // 排序
    handlerSort (type) {
        let { query } = this.props.location;
        let result = this.returnSortResult(type);
        if (result) {
            if (query.odtype === 'Desc') {
                this.sortValue(result, 'Asc');
            } else {
                this.sortValue(result, 'Desc');
            }
        }
    }

    // 判断不能排序字段鼠标划上去不变成小手
    renderClass (type) {
        let name=null;
        if (type === 'Name' || type === 'Description' || type === 'CurrentPoint') {
            name = `mcds-table__truncate ${styles.cursorAuto}`;
        } else {
            name = 'mcds-table__truncate';
        }
        return name;
    }

    // 渲染排序时显示的箭头
    renderIcon (types) {
        let { query } = this.props.location;
        let icon = null;
        sortParameter.forEach( v =>{
            if (v.type === types && v.sort === query.orderfield) {
                icon = 'mcds-icon__arrow-solid-14';
                if (query.odtype === 'Asc') {
                    icon = 'mcds-icon__arrow-solid-14 mcds-icon__rotate-180';
                }
            }
        });
        return icon;
    }

    renderTime (item) {
        let times;
        if (item.get('FinishTime')) {
            times = item.get('FinishTime')-item.get('CreateTime');
        } else {
            times = new Date().getTime()/1000-item.get('CreateTime');
        }
        return convertSeconds(times<=60 ? 60 : parseInt(times), {second: false});
    }

    // 渲染body
    renderTabBody() {
        let getStatus = (status) => {
            let type = null;
            switch (status) {
            case 'Voting' :
                type = '待审批';
                break;
            case 'Approval' :
                type = '已同意';
                break;
            case 'Reject':
                type = '已拒绝';
                break;
            default :
                type = '待审批';
                break;
            }
            return type;
        };
        let data = this.props.data.get('AwList');
        if (!data) {
            return null;
        }
        let { user, objNames } = this.props;
        let getMetaName = (m) =>{
            let reslut = 'loading';
            if (objNames) {
                objNames.forEach(v => {
                    if (v.get('name') === m) {
                        reslut = v.get('display_name');
                    }
                });
            }
            return reslut;
        };

        let getUserAvatar = (id) => {
            if (user) {
                return user.getIn([id, 'Avatar']);
            }
            return 'loading';
        };

        return data.toArray().map((item, i) => (
            <tr key={i}>
                <td>
                    <div className="mcds-truncate">
                        <Link title={item.get('Name')} to={`/vetting/${item.get('AwId')}`}>
                            { item.get('Name') }
                        </Link>
                    </div>
                </td>
                <td>
                    <div className="mcds-truncate">
                        <span className="mcds-avatar mcds-avatar__circle mcds-m__r-10">
                            <img
                                className="mcds-avatar__size-24"
                                src={getUserAvatar(item.get('CreateUid')) ? getUserAvatar(item.get('CreateUid')) : default_avatar}
                                alt="头像" />
                        </span>
                        <span>
                            {user ? user.getIn([item.get('CreateUid'), 'name']) : null}
                        </span>
                    </div>
                </td>
                <td>
                    <div className="mcds-truncate">
                        {item.get('SerialNum')}
                    </div>
                </td>
                <td>
                    <div className="mcds-truncate">
                        {item.get('Description')}
                    </div>
                </td>
                <td>
                    <div className="mcds-truncate">
                        {getMetaName(item.get('Type'))}
                    </div>
                </td>
                <td>
                    <div className="mcds-truncate">
                        {`${item.get('CurrentPoint')}/${item.get('PointCount')}`}
                    </div>
                </td>
                <td>
                    <div className="mcds-truncate">
                        {getStatus(item.get('Status'))}
                    </div>
                </td>
                <td>
                    <div className="mcds-truncate">
                        {this.renderTime(item)}
                    </div>
                </td>
            </tr>
        ));
    }

    async getObjName(objName) {
        await this.props.fetchLayout(objName, 'list');
        this.renderCreate(objName);
    }

    renderCreate(objName) {
        let { layout } = this.props;
        let _layout = layout.get(objName);
        if (_layout) {
            let componentId = _layout.getIn(['layout', 'children', 0, 'id']);
            let order = _layout.getIn(['components', componentId, 'config', 'optionalButtons', 0, 'order']);
            this.setState({
                order,
                approvalObjName: objName
            }, () => {
                document.getElementById('createModal').click();
            });
        }
    }

    render() {
        let { approvalObjName, order } = this.state;
        let { objNames }= this.props;
        return (
            <div className={classnames(styles['index-flex'])}>
                <div className={classnames('mcds-pageheader', styles['index-pageheader'])}>
                    <div className="mcds-grid mcds-pageheader__header">
                        <div className="mcds-pageheader__header-left">
                            <div className="mcds-media">
                                <div className="mcds-media__figure">
                                    <div
                                        className={classnames('mcds-pageheader__header-left-icon', styles['index-rounded__rectangle'])}>
                                        <i className={classnames('mcds-icon__seal-solid-24', styles['index-seal__solid-24'])} />
                                    </div>
                                </div>
                                <div className="mcds-media__body">
                                    <div
                                        className={classnames('mcds-pageheader__header-left-text', styles['index-layer'])}>
                                        审批
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mcds-pageheader__header-right">
                            {!this.state.loading ? <CreateApproval
                                trigger={<Button className="mcds-button__neutral">新建</Button>}
                                objNames={objNames}
                                getObjName={this.getObjName} /> : null}
                        </div>
                    </div>
                </div>
                <div className={classnames('mcds-container ', styles['index-tab'])}>
                    {this.renderTab()}
                </div>
                {approvalObjName ? <CreateModal
                    fromPage="vetting"
                    ref="createModal"
                    order={order ? order.toJS() : null}
                    trigger={<Button id="createModal" className="mcds-button__item hide">新建</Button>}
                    className="mcds-button__item"
                    objName={approvalObjName} /> : null}
                {this.props.data.get('Count') ? <div className={`mcds-p__t-22 mcds-p__b-22 ${styles.height62}`}>
                    {this.renderPageination()}
                </div> : null}
            </div>
        );
    }
}

VettingList.propTypes = {
    location: PropTypes.object,
    user: PropTypes.object, // 添加人员默认人数
    meta: PropTypes.object, // 布局
    info: PropTypes.object, // 审批页面的信息，取来是为了用action区分弹update的modal还是create的modal
    data: PropTypes.object, // 数据源
    layout: PropTypes.object, // 布局数据
    objNames: PropTypes.object, // 获取有审批模板的标准对象数据
    fetchList: PropTypes.func, // 列表页请求 （这里标注一下，是审批列表页，和模版列表页区分开）
    fetchMeta: PropTypes.func, // 获取meta数据请求
    fetchCount: PropTypes.func, // 获取审批列表每个类型的审批总条目
    fetchLayout: PropTypes.func, // 获取标准对象布局数据
    listTypeCount: PropTypes.object, // 获取审批列表每个类型的审批总条目
    fetchApprovalObj: PropTypes.func, // 获取有审批模板的标准对象请求
    fetchRelatedDataListByIds: PropTypes.func // 关联对象请求
};
export default connect(state => ({
    data: state.getIn(['vetting', 'listview', 'list']),
    user: state.getIn(['standardObject', 'relatedObject', 'User']),
    info: state.getIn(['vetting', 'listview', 'info']), // 审批页面的信息，取来是为了用action区分弹update的modal还是create的modal
    layout: state.getIn(['standardObject', 'layout', 'list']),
    listTypeCount: state.getIn(['vetting', 'listview', 'listTypeCount']),
    meta: state.getIn(['standardObject', 'meta']),
    objNames: state.getIn(['vetting', 'listview', 'approvalObjName'])
}), dispatch => bindActionCreators({
    fetchList,
    fetchCount,
    fetchMeta,
    fetchLayout,
    fetchApprovalObj,
    fetchRelatedDataListByIds
}, dispatch))(VettingList);
