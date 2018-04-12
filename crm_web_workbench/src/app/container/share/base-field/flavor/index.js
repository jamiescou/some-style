import address from './address.js';
import textarea from './textarea.js';
import currency from './currency.js';

import percent from './percent';
import checkbox from './checkbox';
import phone from './phone';
import date from './date';
import datetime from './datetime';
import doubleType from './double';
import email from './email';
import file from './file';
import time from './time';
import url from './url';
import richtext from './richtext';

import relatedObject from './related-object';
export default {
    address,
    checkbox,
    currency,
    date,
    datetime,
    double: doubleType,
    email,
    external_id: relatedObject,
    file,
    hierarchy: relatedObject,
    lookup: relatedObject,
    master: relatedObject,
    percent,
    phone,
    richtext,
    textarea,
    time,
    url
};
