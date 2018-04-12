/**
 * Created by listen1013 on 17/5/1.
 */

import {combineReducers} from 'redux-immutable';

import listview from './listview';
import detailview from './detailview';

export default combineReducers({
    listview,
    detailview
});

