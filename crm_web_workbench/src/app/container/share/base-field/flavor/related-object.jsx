import React from 'react';
import RelateObject from '../related-object';
const relatedObject = (value, schema = {}) => {
    let { object_name } = schema;
    if (!value || !object_name) {
        return <div />;
    }
    return <RelateObject objName={object_name} id={value} schema={schema} />;
};


export default relatedObject;

