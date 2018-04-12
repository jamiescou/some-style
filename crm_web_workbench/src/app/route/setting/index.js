export default {
    path: 'setting',
    getComponent(location, cb) {
        require.ensure([], (require) => {
            cb(null, require('../../container/setting/setting'));
        });
    },
    indexRoute: {
        component: require('../../container/setting/personal-info')
    },
    childRoutes: [
        {
            path: 'personal-info',
            getComponent(location, cb) {
                require.ensure([], (require) => {
                    cb(null, require('../../container/setting/personal-info'));
                });
            }
        },
        {
            path: 'invite',
            getComponent(location, cb) {
                require.ensure([], (require) => {
                    cb(null, require('../../container/setting/invite-user'));
                });
            }
        }
    ]
} ;
