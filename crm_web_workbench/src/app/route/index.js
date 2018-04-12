
export default {
    component: require('container/app'),
    // indexRoute: {
    //    onEnter: () => {},
    //    component: require('../container/home/index')
    // },
    childRoutes: [
        require('./home'),
        require('./global-search'),
        require('./standard-object'),
        require('./vetting'),
        require('./setup'),
        require('./setting'),
        require('./calendar-view'),
        require('./contacts'),

        // not found router must at last
        {
            path: '/demo',
            component: require('../container/home/index')
        },
        {
            path: '/token-manager',
            component: require('../container/token-manager/index')
        },
        {
            path: '*',
            component: require('../container/home/home')
        }
    ]
};
