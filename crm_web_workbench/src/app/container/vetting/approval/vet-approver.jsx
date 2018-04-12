import React from 'react';
import PropTypes from 'prop-types';

import classnames from 'classnames';
import { default_avatar } from '../../../utils/user-setting.js';

import style from 'styles/modules/vetting/approval.scss';

/* 审批人组件，有头像和审批人名称 */
const Approver = ({name, url, showIcon, deleteCallback}) => {
    return (
        <div className={classnames(style['approval-point__approver'], style['vet-avatar'], 'mcds-m__b-10')}>
            {showIcon && <AvatarIcon deleteCallback={deleteCallback} agreest={false} className={classnames('mcds-avatar__size-16', style['vet-icon__pos2'])} />}
            <div className={style['approval-point__approver-wrapper']}>
                <div>
                    <Avatar url={url} className="mcds-m__r-5 mcds-m__b-5" />

                    <span className="mcds-text__line-24 mcds-text__size-13">{name}</span>
                </div>
            </div>
        </div>
    );
};

Approver.propTypes = {
    name: PropTypes.string,
    url: PropTypes.string,
    showIcon: PropTypes.bool,
    deleteCallback: PropTypes.func
};

/* 用户头像组件 */
const Avatar = ({className, showIcon, deleteCallback, url }) => {
    return (
        <span onClick={deleteCallback} className={classnames('mcds-avatar  mcds-avatar__size-24 mcds-avatar__circle', className, style['vet-avatar'])}>
            {showIcon && <AvatarIcon agreest={false} className={classnames('mcds-avatar__size-16', style['vet-icon__pos'])} />}
            <img src={url ? url : default_avatar} alt="avatar" />
        </span>
    );
};

Avatar.propTypes = {
    url: PropTypes.string,
    className: PropTypes.string,
    showIcon: PropTypes.bool,
    deleteCallback: PropTypes.func
};

/* 头像上的删除图标，如果是审批人，删除图标在外侧边框右上角 */
const AvatarIcon = ({className, deleteCallback}) => {
    return (
        <span onClick={deleteCallback} className={classnames(className, style['vet-icon__common'])}>
            <i className={classnames(style['vet-icon'], style['icon-pos__close'], 'mcds-icon__close-12', 'mcds-text__size-16')} />
        </span>
    );
};

AvatarIcon.propTypes = {
    className: PropTypes.string,
    deleteCallback: PropTypes.func
};

export default {
    Approver,
    Avatar
};

