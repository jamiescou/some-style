import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import AvatarIcon from './vet-avatar-icon.jsx';
import styles from 'styles/modules/vetting/vet-card.scss';

const Avatar = ({agreest, className, avatar}) => {
    let type = 'Voting';
    if (!agreest){
        return null;
    }
    if (typeof agreest === 'string'){
        switch (agreest){
	        case 'Approval':
	            type= 'Approval';
	            break;
	        case 'Reject':
	            type= 'Reject';
	            break;
	        default:
	            type = 'Voting';
            break;
	        }
    } else {
        agreest.map( v =>{
            type = v;
        });
    }
    return (
        <span className={classnames(className, 'mcds-avatar mcds-avatar__small mcds-media__figure mcds-avatar__circle', styles['vet-avatar'])}>
            <AvatarIcon agreest={type} className={classnames('mcds-avatar__size-16', styles['vet-icon__pos'])} />
            <img className="mcds-avatar__size-24" src={avatar} alt="" />
        </span>
    );
};

Avatar.propTypes = {
    className: PropTypes.string,
    avatar: PropTypes.any,
    agreest: PropTypes.any
};

export default Avatar;
