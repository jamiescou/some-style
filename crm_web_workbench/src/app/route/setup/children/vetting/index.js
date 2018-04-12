module.exports = {
    path: 'vetting',
    indexRoute: {
        getComponent(location, cb) {
            require.ensure([], (require) => {
                cb(null, require('../../../../container/setup/automation/vetting/index.jsx'));
            });
        }
    }
};
