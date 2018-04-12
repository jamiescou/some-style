import React from 'react';

import { Link } from 'react-router';

function BuildNameLinkContext(name, id, objName, others = {}) {
    if (!name || !id || !objName) {
        return '';
    }
    return <Link to={`/sObject/${objName}/${id}`} {...others}>{name}</Link>;
}

export default {
    BuildNameLinkContext
};
