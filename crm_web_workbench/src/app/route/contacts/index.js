/**
 * Created by lvhaibin on 2017/8/30.
 */
export default {
    path: '/contacts/:objName',
    indexRoute: {
        getComponent(location, cb) {
            require.ensure([], (require) => {
                cb(null, require('container/contacts/listview/standard-listview'));
            });
        }
    },
    childRoutes: [
        {
            path: ':id',
            getComponent(location, cb) {
                require.ensure([], (require) => {
                    cb(null, require('container/contacts/detailview'));
                });
            }
        }
    ]
};
