import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import { default_avatar } from '../../../../utils/user-setting.js';

import classnames from 'classnames';

import styles from 'styles/modules/home/home-modal.scss';

class UserInfo extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let { username, phone, phoneTime, time, avatar } = this.props;
        return (
            <li className={classnames(styles['body-li'])}>
                <div className={classnames(styles['body-item'], 'mcds-layout mcds-layout__column mcds-p__t-12 mcds-p__b-10')}>
                    <div className={classnames(styles['item-img'], 'mcds-layout__item-3')}>
                        <img src={ avatar ? avatar : default_avatar} alt="" />
                    </div>
                    <div className="mcds-layout__item-6 mcds-layout mcds-layout__row mcds-m__l-10">
                        <span className="mcds-text__size-14">{username}</span>
                        <span>{phone}</span>
                        <span className="mcds-m__t-8">通话时长：{phoneTime}</span>
                    </div>
                    <div className="mcds-layout__item-2 mcds-p__t-12">
                        {time}
                    </div>
                    <div className={classnames(styles['item-icon'], 'mcds-layout__item-2 mcds-p__t-10')}>
                        <span className="mcds-icon__telephone-solid-24 mcds-text__size-30" />
                    </div>
                </div>
            </li>
        );
    }
}
UserInfo.propTypes = {
    username: PropTypes.string,
    phone: PropTypes.string,
    phoneTime: PropTypes.string,
    time: PropTypes.string,
    avatar: PropTypes.string
};

export default connect(
    null,
    dispatch => bindActionCreators({ }, dispatch)
)(UserInfo);

