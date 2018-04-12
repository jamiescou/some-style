import React from 'react';

import { Link } from 'react-router';

import { default_avatar } from 'utils/user-setting';

function BuildNameLinkContext(name, id, avatar, objName, others = {}) {
    if (!name || !id || !objName) {
        return '';
    }
    return (
        <div className="mcds-media" >
            <div className="mcds-media__figure mcds-avatar__circle" style={{transform: 'translateY(-2px)'}}>
                <span className="mcds-avatar mcds-avatar__size-18 mcds-avatar__circle">
                    <img className="mcds-avatar__circle" src={avatar ? avatar : default_avatar} />
                </span>
            </div>
            <div className="mcds-truncate">
                <Link to={`/contacts/${objName}/${id}`} {...others}>{name}</Link>
            </div>
        </div>
    );
}

export default {
    BuildNameLinkContext
};
