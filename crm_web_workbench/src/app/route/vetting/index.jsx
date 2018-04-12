export default {
    path: 'vetting',
    getComponent(location, cb) {
        require.ensure([], (require) => {
            cb(null, require('../../container/vetting/index'));
        });
    },
    indexRoute: {
        getComponent(location, cb) {
            require.ensure([], (require) => {
                cb(null, require('../../container/vetting/listview'));
            });
        }
    },
    childRoutes: [
        {
            path: 'approval/:id',
            getComponent(location, cb) {
                require.ensure([], (require) => {
                    cb(null, require('../../container/vetting/approval'));
                });
            }
        },
        {
            path: 'choose',
            getComponent(location, cb) {
                require.ensure([], (require) => {
                    cb(null, require('../../container/vetting/choose'));
                });
            }
        },
        {
            path: ':id',
            getComponent(location, cb) {
                require.ensure([], (require) => {
                    cb(null, require('../../container/vetting/detailview'));
                });
            }
        }
    ]
};
