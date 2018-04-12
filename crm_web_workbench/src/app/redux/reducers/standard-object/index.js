/**
 * Created by listen1013 on 17/3/29.
 */

import {combineReducers} from 'redux-immutable';

import schema from './schema';
import action from './action';
import layout from './layout';
import listview from './listview';
import dependency from './dependency';
import relatedObject from './related-object';
import detailview from './detailview';
import teamRole from './team-role';
import meta from './meta';
import allObjects from './all-obj';
import enterpriseInfo from './enterprise-info';

export default combineReducers({
    action,
    layout,
    schema,
    meta,
    allObjects,
    listview,
    dependency,
    detailview,
    teamRole,
    relatedObject,
    enterpriseInfo
});
