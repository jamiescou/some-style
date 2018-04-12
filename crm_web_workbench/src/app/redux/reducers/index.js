import I from 'immutable';
import { combineReducers } from 'redux-immutable';
import { LOCATION_CHANGE } from 'react-router-redux';

import standardObject from './standard-object';
// import relatedObject from './related-object';
import vetting from './vetting';
import acl from './acl';
import setup from './setup';
import userProfile from './user-profile';

import search from './search';
import calendar from './calendar/index';
import territory from './territory/territory';
let initialState = I.fromJS({
    locationBeforeTransitions: undefined
});

let router = (state = initialState, action) => {
    if (action.type === LOCATION_CHANGE) {
        return state.merge({
            locationBeforeTransitions: action.payload
        });
    }

    return state;
};

export default combineReducers({
    router,
    acl,
    standardObject,
    vetting,
    setup,
    userProfile,
    search,
    calendar,
    territory
});
