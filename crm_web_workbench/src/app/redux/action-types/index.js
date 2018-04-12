/**
 * Created by listen1013 on 17/1/13.
 * 按照页面抽象的模块来分,如 layout listview detailview 这些同时只能存在一个,schema 可以存放各种对象的 schema ,是一个大的集合
 */

let actions = [].concat(
    require('./standard-object/layout'),
    require('./standard-object/action'),
    require('./standard-object/schema'),
    require('./standard-object/dependency-by'),
    require('./standard-object/meta'),
    require('./standard-object/team-role'),
    require('./standard-object/detailview'),
    require('./standard-object/listview'),
    require('./standard-object/related-data'),
    require('./standard-object/enterprise-info'),
    require('./vetting/vetting'),
    require('./acl/team'),
    require('./acl/group'),
    require('./acl/role'),
    require('./acl/manager'),
    require('./setup/object'),
    require('./search/search'),
    require('./setup/vetting'),
    require('./setting/setting'),
    require('./territory/territory'),
    require('./calendar/calendar')
);
const _actions = {};
actions.forEach((action) => _actions[action] = action);
export default _actions;
