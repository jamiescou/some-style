export default {
    path: 'calendar',
    indexRoute: {
        getComponent(location, cb) {
            require.ensure([], (require) => {
                cb(null, require('../../container/calendar-view/index'));
            });
        }
    },
    childRoutes: [
        {
            path: 'detail/:id',
            getComponent(location, cb) {
                require.ensure([], (require) => {
                    cb(null, require('../../container/calendar-view/detail'));
                });
            }
        }
    ]
};
