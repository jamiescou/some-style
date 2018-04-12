import React from 'react';
import PropTypes from 'prop-types';
import style from 'styles/modules/vetting/other.scss';
const VettingFooter = ({children, ...others}) => {
    return (
        <div {...others} className={style['vetting-footer']}>
            {children}
        </div>
    );
};
VettingFooter.propTypes = {
    children: PropTypes.any
};
export default VettingFooter;
