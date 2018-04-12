module.exports = {
    path: 'role',
    indexRoute: {
        getComponent(location, cb) {
            require.ensure([], (require) => {
                cb(null, require('../../../../container/setup/user/role/index.jsx'));
            });
        }
    }
};
