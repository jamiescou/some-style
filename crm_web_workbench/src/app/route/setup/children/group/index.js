module.exports = {
    path: 'group',
    indexRoute: {
        getComponent(location, cb) {
            require.ensure([], (require) => {
                cb(null, require('../../../../container/setup/user/group/index.jsx'));
            });
        }
    }
};
