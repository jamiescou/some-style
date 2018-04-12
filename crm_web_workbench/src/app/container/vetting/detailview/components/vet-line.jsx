import classnames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';

import styles from 'styles/modules/vetting/vet-card.scss';

const Line = ({agreest, lineWidth, ...others}) => {
    let line = [];
    if (!agreest){
        return null;
    }
    if (typeof agreest === 'string') {
        switch (agreest){
        case 'Approval' :
            line.push(<div {...others} key={agreest} style={{width: lineWidth}} className={classnames(styles['vet-line'], styles['vet-line__check'])} />);
            break;
        case 'Reject':
            line.push(<div {...others} key={agreest} style={{width: lineWidth}} className={classnames(styles['vet-line'], styles['vet-line__close'])} />);
            break;
        default:
            line.push(null);
        }
    } else {
        agreest.forEach( (v, i) => {
            switch (v){
            case 'Approval' :
                line.push(<div {...others} key={i} style={{width: lineWidth}} className={classnames(styles['vet-line'], styles['vet-line__check'])} />);
                break;
            case 'Reject':
                line.push(<div {...others} key={i} style={{width: lineWidth}} className={classnames(styles['vet-line'], styles['vet-line__close'])} />);
                break;
            default:
                line.push(null);
                break;
            }
        });
    }
    return (
        <div className={classnames(styles['vet-line__common'])}>
            {line}
        </div>
    );
};

Line.propTypes = {
    lineWidth: PropTypes.string,
    agreest: PropTypes.any
};

export default Line;

