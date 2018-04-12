import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import style from 'styles/modules/vetting/detail.scss';

const VetResult = ({agreest, className, time}) => {
    let vetAgreest;
    let className_color;
    switch (agreest){
    case 'Wait' :
        return <div />;
    case 'Voting' :
        return <div />;
    case 'Approval' :
        vetAgreest = '审批通过';
        className_color = style.pass;
        break;
    case 'Reject' :
        vetAgreest = '审批被拒';
        className_color = style.reject;
        break;
    case 'Closed' :
        return <div />;
    default :
        vetAgreest = '审批撤回';
        className_color = style.revoke;
    }
    return (
        <div className={classnames(style['node-agreest'], className, className_color)}>
            <div className="mcds-m__r-10" style={{display: 'inline-block'}}>
                <p className="mcds-text__right mcds-text__size-12">{vetAgreest}</p>
                <p className="mcds-text__size-12">{time}</p>
            </div>
            <i className={classnames('mcds-icon__large', {'mcds-icon__approved-48': agreest, 'mcds-icon__denied-48': !agreest })} />
        </div>
    );
};

VetResult.propTypes = {
    className: PropTypes.string,
    time: PropTypes.string,
    agreest: PropTypes.string
};

export default VetResult;


