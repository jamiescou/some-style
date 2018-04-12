import classnames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';

import styles from 'styles/modules/vetting/vet-card.scss';

const AvatarIcon = ({agreest, className}) => {
    let avatarIcon;
    if (agreest === 'Approval') {
        avatarIcon = <i className={classnames(styles['vet-icon'], styles['icon-pos__check'], 'mcds-icon__check-12', 'mcds-text__size-16')} />;
    } else if (agreest === 'Reject'){
        avatarIcon = <i className={classnames(styles['vet-icon'], styles['icon-pos__close'], 'mcds-icon__close-12', 'mcds-text__size-16')} />;
    } else {
        avatarIcon = null;
    }
    return (
        <span className={classnames(className, styles['vet-icon__common'])}>
            {avatarIcon}
        </span>
    );
};

AvatarIcon.propTypes = {
    className: PropTypes.string,
    agreest: PropTypes.any
};

export default AvatarIcon;

