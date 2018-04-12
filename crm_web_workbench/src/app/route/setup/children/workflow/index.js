module.exports = {
    path: 'workflow',
    indexRoute: {
        getComponent(location, cb) {
            require.ensure([], (require) => {
                cb(null, require('../../../../container/setup/automation/workflow/index.jsx'));
            });
        }
    }
};
