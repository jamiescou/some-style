export default {
    path: 'setup',
    getComponent(location, cb) {
        require.ensure([], (require) => {
            cb(null, require('../../container/setup/setup'));
        });
    },
    indexRoute: {
        component: require('../../container/setup/index')
    },
    childRoutes: [
        require('./children/group'),
        require('./children/object'),
        require('./children/queue'),
        require('./children/role'),
        require('./children/user'),
        require('./children/vetting'),
        require('./children/workflow')
    ]
};
