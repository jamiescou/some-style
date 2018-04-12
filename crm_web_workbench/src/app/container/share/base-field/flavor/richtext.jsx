import React from 'react';

let createMarkup = (v) => {
    return {__html: v};
};

const richtext = (val) => {
    let value = null;
    if (!val) {
        value = '';
    } else {
        value = val;
    }
    return <div dangerouslySetInnerHTML={createMarkup(value)} />;
};

export default richtext;



