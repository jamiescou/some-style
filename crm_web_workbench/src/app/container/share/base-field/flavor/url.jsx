import React from 'react';
import { Link } from 'react-router';

function Url(value) {
    if (!value) {
        return '';
    }
    let str = String(value).toLowerCase();
    let re = /(http?s:\/\/)?([A-Za-z0-9]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]\':+!]*([^<>\"\"])*)/g;
    let url;
    str.replace(re, (a, b, c) => {
        url = <Link to={`http:\/\/${c}`} target="_blank">{a}</Link>;
    });
    return url;
}
export default Url;
