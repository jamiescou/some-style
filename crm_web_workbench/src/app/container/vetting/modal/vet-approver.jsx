import React from 'react';
import PropTypes from 'prop-types';

import classnames from 'classnames';

import style from 'styles/modules/vetting/approval.scss';
import { default_avatar } from '../../../utils/user-setting.js';

/* 审批人组件，有头像和审批人名称 */
const Approver = ({name, url}) => {
    return (
        <div className={classnames(style['approval-point__approver'], style['vet-avatar'])}>
            <div className={style['approval-point__approver-wrapper']}>
                <div>
                    <Avatar url={url ? url : default_avatar} className="mcds-m__r-5" />
                    <span className="mcds-text__line-24 mcds-text__size-13">{name}</span>
                </div>
            </div>
        </div>
    );
};

Approver.propTypes = {
    name: PropTypes.string,
    url: PropTypes.string
};

/* 用户头像组件 */
const Avatar = ({className}) => {
    return (
        <span className={classnames('mcds-avatar  mcds-avatar__size-24 mcds-avatar__circle', className, style['vet-avatar'])}>
            <img src={default_avatar} alt="avatar" />
        </span>
    );
};

Avatar.propTypes = {
    url: PropTypes.string,
    className: PropTypes.string
};

export default {
    Approver,
    Avatar
};

