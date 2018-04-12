import classnames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';

import {
    Line,
    Avatar
} from './components';
import styles from 'styles/modules/vetting/vet-card.scss';

const VetCard = ({className, avatar, userName, agreestTime, agreest}) => {
    let agreestHTML;
    switch (agreest){
    case 'Approval' :
        agreestHTML = <p className={classnames(styles['vet-agreest__check'])}>已同意</p>;
        break;
    case 'Reject' :
        agreestHTML = <p className={classnames(styles['vet-agreest__close'])}>拒绝</p>;
        break;
    case 'Closed' :
        agreestHTML = <p className={classnames(styles['vet-agreest__null'])}>待审批</p>;
        break;
    default :
        agreestHTML = <p className={classnames(styles['vet-agreest__null'])}>待审批</p>;
    }
    return (
        <div className={className}>
            <header className={classnames(styles['vet-card'], 'mcds-card mcds-card__medium')}>
                <Line agreest={agreest} />
                <div className={classnames(styles['vet-header'], 'mcds-card__header mcds-grid')}>
                    <header className="mcds-media mcds-card__media">
                        <Avatar
                            agreest={agreest}
                            avatar={avatar} />
                        <div className="mcds-media__body">
                            <span className={classnames(styles['vet-username'])}>{userName ? userName : '***'}</span>
                            {agreestHTML}
                        </div>
                    </header>
                    <div className={classnames(styles['vet-dateTime'])}>{agreestTime}</div>
                </div>
            </header>
        </div>
    );
};

VetCard.propTypes = {
    className: PropTypes.string,
    avatar: PropTypes.string.isRequired,
    userName: PropTypes.string.isRequired,
    agreestTime: PropTypes.string,
    agreest: PropTypes.string
};

export default VetCard;

