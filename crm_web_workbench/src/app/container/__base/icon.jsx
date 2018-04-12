/**
 * Created by listen1013 on 17/1/4.
 */
import React from 'react';
import PropTypes from 'prop-types';

const prefix = 'mcds-icon__';

const Icon = ({
    name,
    size,
    color,
    className,
    style,
    onClick,
    ...others
    }) => (
        <i
            className={`${prefix}${name}${className ? ' ' + className : ''}`}
            style={mergeStyle({color, size, style})}
            onClick={onClick}
            {...others} />
);

export default Icon;

Icon.propTypes = {
    name: PropTypes.string.isRequired,
    className: PropTypes.string,
    color: PropTypes.string,
    size: PropTypes.string,
    style: PropTypes.object,
    onClick: PropTypes.func
};

const resolvedMap = {
    size: 'fontSize'
};

const mergeStyle = ({...options}) => {
    let styles = {};
    const style = options.style;
    delete options.style;
    for (const v in options) {
        if (options.hasOwnProperty(v) && options[v] !== undefined) {
            styles[resolvedMap[v] || v] = options[v];
        }
    }
    if (!/px/.test(styles.fontSize)) {
        styles.fontSize += 'px';
    }
    return Object.assign({}, styles, style);
};
