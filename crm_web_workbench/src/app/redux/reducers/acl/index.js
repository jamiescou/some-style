import {combineReducers} from 'redux-immutable';

import team from './team';
import group from './group';
// 耿山想一想.这块的角色有必要放到redux上么?还是实施的去获取
// import role from './role';
// import manager from './manager';

export default combineReducers({
    team,
    group
    // role,
    // manager
});
