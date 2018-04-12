/**
 * 这个base-field只给detail界面使用.listView只禁止调用这个文件
 */
import React from 'react';
import {connect} from 'react-redux';
import { Link } from 'react-router';
import {bindActionCreators} from 'redux';
import _ from 'lodash';

import { default_avatar } from 'utils/user-setting';
import BaseContext from 'container/share/base-field/base-field';
import { fetchRelatedDataListByIds } from 'redux/reducers/standard-object/related-object/data';

import PopoverPanel from '../../modal/popover-panel';

class DetailContext extends BaseContext {
    constructor(props) {
        super(props);
    }
    componentDidMount(){
        let { relatedList, schema, value } = this.props;
        let { object_name } = schema;
        if (object_name) {
            let relatedItem = relatedList.getIn([object_name, value]);
            if (!relatedItem && value){
                this.props.fetchRelatedDataListByIds(object_name, [value]);
            }
        }
    }
    componentWillReceiveProps(nextProps){
        let { relatedList, schema, value } = nextProps;
        let { object_name } = schema;
        if (!_.isEqual(value, this.props.value)) {
            if (object_name) {
                let relatedItem = relatedList.getIn([object_name, value]);
                if (!relatedItem && value){
                    this.props.fetchRelatedDataListByIds(object_name, [value]);
                }
            }
        }
    }
    commonLookup(value, schema) {
        let { object_name } = schema;
        let { relatedList, needDetailPopover = true } = this.props;
        let nameLink = null;
        let avatar = null;
        let avatarElement = null;
        if (value && object_name === 'User' && relatedList.size) {
            if (relatedList.getIn(['User', value])){
                let Avatar = relatedList.getIn(['User', value, 'Avatar']);
                if (Avatar){
                    avatar = Avatar;
                } else {
                    avatar = default_avatar;
                }
            }
            avatarElement = (
                <div className="mcds-media__figure mcds-avatar__circle">
                    <span className="mcds-avatar mcds-avatar__size-18 mcds-avatar__circle">
                        <img className="mcds-avatar__circle" src={avatar} />
                    </span>
                </div>
            );
        }
        // 是否需要弹窗显示更多
        if (needDetailPopover) {
            nameLink = this.popover(value, schema);
        } else {
            nameLink = super.master(value, schema);
        }
        return (
            <div className="mcds-media" >
                {avatarElement}
                <div className="mcds-media__body mcds-p__t-3">
                    {nameLink}
                </div>
            </div>
        );
    }
    popover(val, schema) {
        let { relatedList } = this.props;
        let { object_name } = schema;
        if (!val) {
            return <div />;
        }
        let relatedItem = relatedList.getIn([object_name, val]);
        if (relatedItem && relatedItem.toJS) {
            let Name = relatedItem.get('name');
            return (<PopoverPanel
                objName={object_name}
                id={val}
                trigger={<span>
                    <Link to={`/sObject/${object_name}/${val}`} >{Name}</Link>
                </span>} />);
        }
    }

    extend_master(value, schema) {
        return this.commonLookup(value, schema);
    }
    extend_lookup(value, schema) {
        return this.commonLookup(value, schema);
    }
    extend_external_id(value, schema) {
        return this.commonLookup(value, schema);
    }
    extend_hierarchy(value, schema) {
        return this.commonLookup(value, schema);
    }
}

export default connect(
    state => ({
        relatedList: state.getIn(['standardObject', 'relatedObject'])
    }),
    dispatch => bindActionCreators({ fetchRelatedDataListByIds }, dispatch)
)(DetailContext);
