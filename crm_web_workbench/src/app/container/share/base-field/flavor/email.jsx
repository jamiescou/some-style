import React from 'react';

let email = (value) => {
    if (!value) {
        return '';
    }
    return <a href={`mailto:${value}`}>{value}</a>;
};

export default email;
