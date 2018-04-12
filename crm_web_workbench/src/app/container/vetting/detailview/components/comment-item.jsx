import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import { default_avatar } from 'utils/user-setting.js';

import { fetchRelatedDataListByIds } from 'redux/reducers/standard-object/related-object/data';

@connect(
    state => ({
        relatedUsers: state.getIn(['standardObject', 'relatedObject', 'User'])
    }),
    dispatch => bindActionCreators({ fetchRelatedDataListByIds }, dispatch)
)

export default class CommentItem extends Component {
    static propTypes ={
        date: PropTypes.string, // 评论的时间显示
        text: PropTypes.any, // 评论的内容
        fetchRelatedDataListByIds: PropTypes.func, // 通过ID获取user信息
        userid: PropTypes.string, // 父组件传递过来的评论的作者的ID
        relatedUsers: PropTypes.object // 
    }
    constructor(props) {
        super(props);
        this.state = {
            user: null
        };
    }
    componentDidMount() {
        let { userid } = this.props;
        if (userid) {
            this.props.fetchRelatedDataListByIds('User', [userid]);
        }
    }

    hasAvatar (type) { // 这个方法if判断位置不能修改，首先是判断的type的类型，其次判断当前用户有没有权限看到这条评论的作者信息。
        let { userid, relatedUsers } = this.props;
        let userInfo = null;
        if (type === 'Avatar') {
            userInfo = default_avatar;
            if (relatedUsers && relatedUsers.get(userid)) {
                userInfo = relatedUsers.getIn([userid, type]) || default_avatar; // 这个位置是是给头像的默认值（如果用户没有上传头像）
            }
        }
        if (type === 'name') {
            userInfo = '***';
            if (relatedUsers && relatedUsers.get(userid)) {
                userInfo = relatedUsers.getIn([userid, type]) || '***';
            }
        }
        return userInfo;
    }

    returnText (text) {
        let texts = text.split('');
        for (let i = 0; i< texts.length; i++) {
            if (texts[i].charCodeAt(0) === 10) {
                texts[i] = '<br />';
            }
        }
        texts = texts.join('');
        return {__html: texts};
    }
    render() {
        let { date, text } = this.props;
        // let texts = text.replace(/\u21b5/g, '<br />')
        return (
            <li>
                <div className="mcds-tile mcds-media">
                    <div className="mcds-media__figure" >
                        <span className="mcds-avatar mcds-avatar__small mcds-avatar__circle">
                            <img src={this.hasAvatar('Avatar')} />
                        </span>
                    </div>
                    <div className="mcds-media__body mcds-tile__detail">
                        <h3 className="mcds-truncate mcds-tile__head" style={{color: '#2a3541'}}>
                            {this.hasAvatar('name')}
                            {/* <div className="pull-right mcds-media__figure--reverse">
                                <div className="mcds-timeline__actions">
                                    <DropDownTrigger>
                                        <ButtonSmallIcon icon="mcds-icon__triangle-solid-14" />
                                        <DropDown className="mcds-timeline__actions-dropdown mcds-dropdown__min-no">
                                            <DropDownList>
                                                <DropDownItem>
                                                    编辑
                                                </DropDownItem>
                                                <DropDownItem>
                                                    删除
                                                </DropDownItem>
                                            </DropDownList>
                                        </DropDown>
                                    </DropDownTrigger>
                                </div>
                            </div>*/}
                        </h3>
                        <div className="mcds-tile__detail">
                            <span className="mcds-text__weak">{date}</span>
                        </div>

                        <div className="mcds-p__t-15 mcds-p__b-15" style={{wordBreak: 'break-all'}}>
                            <div dangerouslySetInnerHTML={this.returnText(text)} />
                        </div>
                    </div>
                </div>
            </li>
        );
    }
}


