/**
 * 这个组件的目的,是为了关联对象的时候使用.
 * 用id去找到某个对象的数据 与 get-suild-context对应使用
 */
import {connect} from 'react-redux';
import { Link } from 'react-router';
import _ from 'lodash';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';

import { default_avatar } from 'utils/user-setting';

import { fetchRelatedDataListByIds } from 'redux/reducers/standard-object/related-object/data';

/**
 * @param  {[type]} id     [相关对象的id]
 * @param  {[type]} objName[相关对象的名字]
 * @param  {[type]} key    [相关对象所要返回的文本信息]
 * @return {[type]}        [description]
 */
class RelateObjectInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            timeout: false
        };
        this.timer = null;
    }

    componentWillMount() {

    }
    componentDidMount(){
        this.mounted = true;
        let { schema, id } = this.props;
        let { object_name } = schema;
        if (object_name && id) {
            setTimeout(() => {
                let relatedItem = this.props.relatedList.getIn([object_name, id]);
                if (!relatedItem){
                    this.props.fetchRelatedDataListByIds(object_name, [id]);
                }
            }, 2000);
        }
        this.timer = setTimeout(() => {
            if (this.mounted) {
                this.setState({
                    timeout: true
                });
            }
        }, 3000);
    }
    componentWillReceiveProps(nextProps){
        let { schema, id } = nextProps;
        let { object_name } = schema;
        if (!_.isEqual(id, this.props.id)) {
            if (object_name) {
                setTimeout(() => {
                    let relatedItem = nextProps.relatedList.getIn([object_name, id]);
                    if (!relatedItem){
                        nextProps.fetchRelatedDataListByIds(object_name, [id]);
                    }
                }, 2000);
            }
        }
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    renderRelated() {
        let relatedList = this.props.relatedList;
        let { objName, id } = this.props;
        if (!id) {
            return <span />;
        }
        let relatedItem = relatedList.getIn([objName, id + '']);
        if (relatedItem && relatedItem.toJS) {
            clearTimeout(this.timer);
            return this.renderDetail(relatedItem, objName);
        }

        if (this.state.timeout) {
            return <div />;
        }

        return <div>loading</div>;
    }
    renderDetail(detail, objName) {
        let avatar = null;
        let avatarElement = null;
        let Name = detail.get('name');
        let id = detail.get('id');

        if (objName === 'User') {
            let Avatar = detail.get('Avatar');
            if (Avatar) {
                avatar = Avatar;
            } else {
                avatar = default_avatar;
            }

            avatarElement = (
                <div className="mcds-media__figure mcds-avatar__circle">
                    <span className="mcds-avatar mcds-avatar__size-18 mcds-avatar__circle">
                        <img className="mcds-avatar__circle" src={avatar} />
                    </span>
                </div>
            );
        }

        if (avatarElement) {
            return (
                <Link to={`/sObject/${objName}/${id}`} style={{dipslay: 'inline-block'}}>
                    <div className="mcds-media" style={{alignItems: 'center'}}>
                        {avatarElement}
                        <div className="mcds-truncate" style={{width: '100%'}}>{Name}</div>
                    </div>
                </Link>
            );
        }
        return <Link to={`/sObject/${objName}/${id}`} >{Name}</Link>;
    }
    render() {
        return this.renderRelated();
    }
}

RelateObjectInfo.propTypes = {
    objName: PropTypes.string,
    schema: PropTypes.object,
    id: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]),
    relatedList: PropTypes.object,
    fetchRelatedDataListByIds: PropTypes.func
};

export default connect(
    state => ({
        relatedList: state.getIn(['standardObject', 'relatedObject'])
    }),
    dispatch => bindActionCreators({ fetchRelatedDataListByIds }, dispatch)
)(RelateObjectInfo);


