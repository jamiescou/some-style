module.exports = {
    path: 'queue',
    indexRoute: {
        getComponent(location, cb) {
            require.ensure([], (require) => {
                cb(null, require('../../../../container/setup/user/queue/index.jsx'));
            });
        }
    }
};
