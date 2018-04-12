/**
 * 单独的一个模块, 用来显示关联列表
 */
import _ from 'lodash';
import {connect} from 'react-redux';
import I from 'immutable';
import classnames from 'classnames';
import { Link } from 'react-router';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';

import { BuildNameLinkContext } from '../get-suit-context';

import DetailField from '../base-field';
import ErrorNotify from 'container/share/error/error-notify';
import { checkEditable, checkDelable } from '../build-field';


// 请求方法
import { fetchDataRequest, deleteDataRequest } from 'requests/common/standard-object';
import {  fetchMetaRequest } from 'requests/common/meta';
import {  fetchLayoutRequest } from 'requests/common/layout';
import PopoverPanel from './detail-popover-panel';

import {
    Button,
    Loading,
    ButtonSmallIcon,
    DropDownTrigger,
    DropDownList,
    DropDownItem,
    DropDown,
    notify
} from 'carbon';

import CreateModal from '../modal/create';
import EditModal from '../modal/update';
import DeleteDataModal from '../modal/delete';

const findShowFields = (layout) => {
    let components = layout.components;
    let result = [];
    if (components) {
        let pageHeader = _.find(components, v => {
            if (v.name === 'pageHeader') {
                return true;
            }
        });
        result = pageHeader.config.fields;
    }
    result.splice(3);
    if (result && result.length === 0) {
        result = ['id', 'name'];
    }
    return result;
};

class RelatedObject extends Component {
    constructor(props) {
        super(props);
        this.state = {
            objName: '',
            layout: {},
            data: [],
            schema: {},
            defaultLength: props.defaultLength, // 默认子对象展示三条,
            errorInfo: null,
            loading: true
        };
    }

    componentDidMount() {
        this.requestRelatedObject();
    }
    // 非法折object报错方法.
    // 以后需要配合layout中显示的objName做处理
    illegalObject(objId) {
        this.setState({
            loading: false
        });
        if (!objId) {
            console.log(`the illegal objId:${objId} inlayout, its not exist in meta`);
        }
    }

    refresh() {
        this.setState({
            loading: true
        });
        this.requestRelatedObject();
    }

    handleOnCreateSuccess(item) {
        let itemInfo = item;
        let { data } = this.state;

        if (itemInfo) {
            data.unshift(itemInfo[0]);
        }
        this.setState({
            data
        });
    }
    handleOnDelete(objName, data, closeModal) {
        let detelRequest = deleteDataRequest(objName, data.id, data.version);
        detelRequest().then(() => {
            notify.add('删除成功');
        }, response => ErrorNotify(response)).then(() => {
            closeModal();
            this.refresh();
        });
    }
    requestRelatedObject() {
        let { currentObjName, currentObjId, relateObjName, relatedKey, defaultLength } = this.props;
        // 子对象查询条件
        let params = {order_by: 'updated_at', order_flag: 'DESC', limit: defaultLength + 1, offset: 0};

        params.view_filter = `{
                "filter_from": "all",
                "filter": {
                    "expressions": [
                        {
                            "field":"${relatedKey}",
                            "operator":"==",
                            "operands": ["'${currentObjId}'"]
                        }
                    ],
                    "logical_relation": "1"
                }
        }`;


        let requestLayout =  fetchLayoutRequest(relateObjName, 'detail');
        let requestSchema = fetchMetaRequest(relateObjName);

        let requestRelatedData = fetchDataRequest(relateObjName, params);

        Promise.all([
            requestLayout(),
            requestSchema(),
            requestRelatedData()
        ]).then((res) => {
            let state = {};
            if (res[0].body) {
                state.layout = res[0].body;
            }
            if (res[1].body) {
                state.schema = res[1].body.schema;
                state.display_name = res[1].body.display_name;
            }

            if (res[2].body) {
                state.data = res[2].body.objects || [];
            }

            this.setState({
                ...state,
                objName: currentObjName,
                loading: false,
                errorInfo: null
            });

        }, error => {
            this.setState({
                loading: false,
                errorInfo: error
            });
        });
    }

    getEditModalDefaultValue() {
        let { relatedKey, currentObjId } = this.props;
        let { schema } = this.state;
        let defaultValue = {};
        // 子对象查询条件

        // 如果关联字段不存在.或者 schema没有获取到 直接返回false
        if (!relatedKey || !schema) {
            return false;
        }


        defaultValue[relatedKey] = currentObjId;
        return defaultValue;
    }

    renderHeaderOptions() {
        // let { layout } = this.state;
        let { relateObjName, currentObjName, currentObjId, data } = this.props;
        let defaultData = this.getEditModalDefaultValue();
        // console.log("datadata", data)
        // 用来区分审批是从哪个对象过去的

        if (data && !checkEditable(data)){
            return null;
        }
        return (
            <CreateModal
                fromPage="detail"
                objId={currentObjId}
                defaultValue={I.fromJS(defaultData)}
                onOpenModal={this.props.onOpenModal}
                onCloseModal={this.props.onCloseModal}
                trigger={<Button className="mcds-button__neutral">新建</Button>}
                curObjName={currentObjName}
                success={this.refresh.bind(this)}
                objName={relateObjName} />
        );
    }

    renderLoadingStatus() {
        return (
            <div className="mcds-layout__row mcds-layout__middle mcds-layout__center mcds-loading ">
                <div className="mcds-layout__item-12">
                    <Loading theme="logo" model="small" />
                </div>
            </div>
        );
    }
    renderViewAll() {
        let { data, defaultLength } = this.state;
        let { relateObjName, relatedKey, currentObjId, currentObjName } = this.props;
        if (data.length < defaultLength) {
            return null;
        }
        return <Link to={`/sObject/${currentObjName}/relatedList/${relateObjName}/${relatedKey}/${currentObjId}`}>查看全部</Link>;

    }
    buildDropDownArray(data, relateObjName, item) {
        let result = [];
        let { currentObjId } = this.props;
        if (checkEditable(data)) {
            result.push(<EditModal
                fromPage="detail"
                curObjName={this.state.objName}
                onOpenModal={this.props.onOpenModal}
                onCloseModal={this.props.onCloseModal}
                objId={currentObjId}
                objName={relateObjName}
                id={item.id}
                key="edit"
                trigger={<DropDownItem className="close">编辑</DropDownItem>}
                success={this.refresh.bind(this)} /> );
        }
        if (checkDelable(data)) {
            result.push(<DeleteDataModal
                key="delete"
                onOpenModal={this.props.onOpenModal}
                onCloseModal={this.props.onCloseModal}
                objName={relateObjName}
                id={item.id}
                trigger={<DropDownItem className="close">删除</DropDownItem>}
                success={this.refresh.bind(this)} />);
        }
        return result;
    }

    renderList() {
        let { data, schema, layout, defaultLength } = this.state;
        let { relateObjName, needDetailPopover } = this.props;
        let detail = this.props.data;
        let fields = findShowFields(layout);

        if (data && data.length === 0) {
            return <div />;
        }
        // data, fields
        let Components = (d, f) => _.map(d, (item, index) => {
            let drondwonTriggerArray = this.buildDropDownArray(detail, relateObjName, item);
            let row = _.map(f, (field, i) => {
                if (i + 1 > defaultLength) {
                    return null;
                }
                let tmp = [];
                tmp.push(
                    <dt key="dt" className="mcds-tile__item-label mcds-truncate" title="First Label">
                        {schema[field].display_name}
                    </dt>);
                tmp.push(
                    <dd key="dd" className="mcds-tile__item-detail mcds-layout__column">
                        <span className="mcds-layout__item mcds-truncate">
                            {new DetailField({
                                value: item[field],
                                needDetailPopover: needDetailPopover,
                                schema: schema[field],
                                data: detail,
                                objName: relateObjName}).render()}
                        </span>
                    </dd>
                );
                return tmp;
            });
            let trigger = (
                <span className="mcds-truncate">
                    {BuildNameLinkContext(item.name, item.id, relateObjName)}
                </span>
            );
            let panel = (
                <PopoverPanel
                    objName={relateObjName}
                    trigger={trigger}
                    id={item.id} />
            );
            return (
                <div className="mcds-tile__detail mcds-m__b-20" key={index}>
                    <h3 className="mcds-tile__head mcds-tile__fun" title="title">
                        <div className="mcds-tile__fun-block mcds-text__line-20 mcds-p__r-30 mcds-truncate" style={{width: '0'}}>
                            {needDetailPopover ? panel : trigger}
                        </div>
                        { drondwonTriggerArray.length !== 0 ? <DropDownTrigger target="self" autoCloseTag="close" placement="bottom-left">
                            <ButtonSmallIcon icon="mcds-icon__triangle-solid-14" />
                            <DropDown className="mcds-dropdown__min-no">
                                <DropDownList>
                                    {drondwonTriggerArray}
                                </DropDownList>
                            </DropDown>
                        </DropDownTrigger> : null}
                    </h3>
                    <dl className="mcds-tile__detail-list">
                        {_.map(row, (v) => v)}
                    </dl>
                </div>
            );
        });

        if (fields && fields.length) {
            data.splice(defaultLength);
            return Components(data, fields);
        }
        return false;
    }
    render() {
        // 涉及到任何问题.这个模块就直接隐藏掉
        if (this.state.errorInfo) {
            return null;
        }

        let BgColorTmp = ['#fe6471', '#f4b2a6', '#ecccb3', '#bcefd0', '#a1e8e4'];
        let colorIndex = parseInt(Math.random() * 10 / 2);
        let numbers = this.props.defaultLength;
        if (this.state.data.length > this.state.defaultLength) {
            numbers = `${this.state.defaultLength}+`;
        } else {
            numbers = this.state.data.length;
        }

        return (
            <article className="mcds-card mcds-card__small mcds-m__b-20 mcds-p__t-5">
                <div className="mcds-card__header mcds-grid">
                    <header className="mcds-media mcds-card__media">
                        <div className="mcds-media__figure mcds-icon__container mcds-bg__green" style={{background: BgColorTmp[colorIndex]}} />
                        <div className="mcds-media__body">

                            {this.state.display_name}({numbers})

                        </div>
                    </header>
                    <div>
                        {!this.state.loading ? this.renderHeaderOptions() : ''}
                    </div>
                </div>
                <div className="mcds-card__body mcds-card__body-loading">
                    { this.state.loading ? this.renderLoadingStatus() : <div className="mcds-tile">{this.renderList()}</div> }
                </div>
                <div className={classnames(numbers === 0 ? 'mcds-p__t-5' : 'mcds-card__footer')}>
                    {this.renderViewAll()}
                </div>
            </article>
        );
    }
}

RelatedObject.propTypes = {
    // 是否需要弹窗显示更多
    // 这个是字段级别,是否显示更加详细面板的配置项
    // 当value==true时,鼠标hover会触发右侧pannel弹出,并显示其详细信息
    // 当value==false, 则只显示这个字段的外键name的连接
    // 当前使用场景中,详情页为true,列表页为false
    needDetailPopover: PropTypes.bool,
    // 默认显示的条数,超出后显示defaultLength+
    defaultLength: PropTypes.number,
    // 当前显示的对象名称
    currentObjName: PropTypes.string.isRequired,
    // 当前显示的对象id
    currentObjId: PropTypes.string.isRequired,
    // 关联到的对象的名称
    relateObjName: PropTypes.string.isRequired,
    // 关联到的对象的字段名称
    relatedKey: PropTypes.string.isRequired,
    // 当前对象的属性
    data: PropTypes.object.isRequired,

    // 这两个是预览卡控制modal的
    onCloseModal: PropTypes.func,
    onOpenModal: PropTypes.func
};

RelatedObject.defaultProps = {
    defaultLength: 3,
    needDetailPopover: true
};

export default connect(
    null,
    dispatch => bindActionCreators({}, dispatch)
)(RelatedObject);
