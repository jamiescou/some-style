export default {
    path: '/search',
    indexRoute: {
        onEnter: () => {},
        component: require('container/global-search')
    },
    childRoutes: [
        {
            path: ':objName',
            getComponent(location, cb) {
                require.ensure([], (require) => {
                    cb(null, require('container/global-search/_table'));
                });
            }
        }
    ]
};
