import {combineReducers} from 'redux-immutable';

import object from './object';
import vetting from './vetting';

export default combineReducers({
    object,
    vetting
});
