import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import { Link } from 'react-router';
import classnames from 'classnames';

import BaseEditor from 'container/share/base-field-editor';
import { updataField } from 'redux/reducers/vetting/detailview';
import ErrorNotify from 'container/share/error/error-notify';
import { formatValueBySchema } from 'utils/format-value';
import DetailContext from './fetch-name';
import DetailPopoverPannel from 'container/standard-object/panel/detail-popover-panel';

import {
    notify
} from 'carbon';
import style from 'styles/modules/vetting/detail.scss';

@connect(
    state => ({
        data: state.getIn(['vetting', 'detailview', 'data']),
        ownerId: state.getIn(['userProfile', 'userId'])
    }),
    dispatch => bindActionCreators({ updataField }, dispatch)
)
export default class EditItem extends Component {
    static propTypes = {
        data: PropTypes.object, // 详细信息数据
        title: PropTypes.string, // 标题
        info: PropTypes.any, // 内容
        val: PropTypes.string,
        schema: PropTypes.object, // 模板
        updataField: PropTypes.func, // 修改编辑字段的请求
        edit: PropTypes.bool, // 判断是否有权限修改
        ownerId: PropTypes.string // 当前登录的用户ID
    };
    constructor(props) {
        super(props);
        this.state = {
            isEditMode: false,
            manualClick: false,
            value: null
        };
        this.manualClick = this.manualClick.bind(this);
        this.handleChenge = this.handleChenge.bind(this);
        this.handleEditing = this.handleEditing.bind(this);
    }

    handleEditing(e) {
        e.nativeEvent.stopImmediatePropagation();
        let { info } = this.props;
        this.setState({
            isEditMode: true,
            value: info
        }, ()=> {
            let examination = document.getElementById('examination');
            examination.addEventListener('click', this.manualClick, false);
        });
    }
    manualClick (e) {
        let { schema } = this.props;
        let range = document.querySelector(`.${schema.get('name')}`);
        if (!range.contains(e.target)) {
            this.setState({
                isEditMode: false
            }, ()=> {
                let examination = document.getElementById('examination');
                examination.removeEventListener('click', this.manualClick, false);
                this.handleOnBlurSaveChange();
            });
        }
    }

    handleOnBlurSaveChange() {
        let { data, val, schema } = this.props;
        let { value } = this.state;
        let id = data.getIn(['Aw', 'Id']);
        let pointid = data.getIn(['VoteObj', 'PointId']);
        let params = {};
        params[val] = formatValueBySchema(value, schema);
        if (value) {
            this.props.updataField(id, pointid, params).then(() => { notify.add('操作成功'); }, err => ErrorNotify(err));
        }
    }

    handleChenge(val) {
        this.setState({
            value: val
        });
    }

    determineUserRights () { // 添加判断当前用户是否在本审批节点有审批的权限
        let { data, ownerId } = this.props;
        let point = data.getIn(['Aw', 'Points']);
        let currentPoint = data.getIn(['Aw', 'CurrentPoint']); // 当前审批节点
        let pointNodeInfo = point.get(currentPoint-1);
        let usersId=[];
        let result = false;
        if (pointNodeInfo.get('Groups')) {
            pointNodeInfo.get('Groups').forEach(v => {
                v.get('Members').forEach( item =>{
                    usersId.push(item.get('UserId'));
                });
            });
        }
        if (pointNodeInfo.get('PointMembers')) {
            pointNodeInfo.get('PointMembers').forEach( v => {
                usersId.push(v.get('UserId'));
            });
        }
        usersId.forEach( v => {
            if (v === ownerId) {
                result = true;
            }
        });
        return result;
    }
    renderName() {
        let textVal = this.state.value;
        let { info, schema, data } = this.props;
        return (<DetailContext value={textVal ? textVal : info} schema={schema.toJS()} objName="vetting" data={data} />);
    }
    renderItem () {
        let { isEditMode } = this.state;
        let { title, info, edit, schema, data } = this.props;
        let pointid = data.getIn(['VoteObj', 'PointId']);
        let textVal = this.state.value;
        let writable = schema.get('writable');
        let readable = schema.get('readable');
        let status = data.getIn(['Aw', 'Status']);
        let userRights = this.determineUserRights();
        let type = false;
        if (status === 'Wait' || status === 'Voting') {
            type = true;
        }
        let result = !isEditMode && writable && edit && type && pointid && userRights;

        if (schema.get('name') === 'name' && data.getIn(['Aw', 'RelationId'])) {
            let trigger = (
                <div className="mcds-truncate">
                    <Link to={`sObject/${data.getIn(['Aw', 'RelationType'])}/${data.getIn(['Aw', 'RelationId'])}`}> {info} </Link>
                </div>
            );
            return (
                <div className={`mcds-layout__column mcds-layout__middle mcds-p__t-11  ${style['edit-item']}`}>
                    <div className="mcds-p__b-5 mcds-text__size-12 mcds-text__weak">{title}</div>
                    <div className={`mcds-text mcds-text__size-13 mcds-p__l-12 ${style.list}`}>
                        <DetailPopoverPannel
                            id={data.getIn(['Aw', 'RelationId'])}
                            objName={data.getIn(['Aw', 'RelationType'])}
                            trigger={trigger} />
                    </div>
                </div>
            );
        }
        if (readable) {
            return (
                <div className={`mcds-layout__column mcds-layout__middle mcds-p__t-11 ${schema.get('name')} ${style['edit-item']}`}>
                    <div className="mcds-p__b-5 mcds-text__size-12 mcds-text__weak">{title}</div>
                    <div className={classnames(`mcds-text mcds-text__size-13 mcds-p__l-12 ${style.list}`, {[style.height]: isEditMode})}>
                        { isEditMode ? <BaseEditor
                            ref={schema.get('name')}
                            onChange={this.handleChenge}
                            defaultValue={textVal ? textVal : info}
                            schema={schema}
                            value={ textVal ? textVal : info } /> : this.renderName()}
                        { result ? <span className="mcds-icon__edit-line-20 pull-right mcds-text__size-20" onClick={this.handleEditing} /> : null}
                    </div>
                </div>
            );
        }
    }

    render() {
        let { schema } = this.props;
        if (!schema) {
            return null;
        }
        return (
            <span className={`${style['edit-wrap']}`}>{this.renderItem()}</span>
        );
    }
}
