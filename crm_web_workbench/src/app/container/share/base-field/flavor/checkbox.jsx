import React from 'react';

const checkbox = (value) => {
    let icon = value ? <span className="mcds-icon__check-12 mcds-text__base" /> : null;
    let checkedClasss = value ? 'mcds-select__multi-checkbox' : '';
    // 这是用icon模拟出来的
    return (
        <span className={`mcds-icon__container mcds-icon__container-14 ${checkedClasss}`} style={{background: 'white'}}>
            {icon}
        </span>
    );
};

export default checkbox;
