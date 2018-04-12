module.exports = {
    path: 'object',
    indexRoute: {
        getComponent(location, cb) {
            require.ensure([], (require) => {
                cb(null, require('../../../../container/setup/object/index.jsx'));
            });
        }
    },
    childRoutes: [
        {
            path: 'create',
            getComponent(location, cb) {
                require.ensure([], (require) => {
                    cb(null, require('../../../../container/setup/object/create-object.jsx'));
                });
            }
        },
        {
            path: 'detail/:objName',
            getComponent(location, cb) {
                require.ensure([], (require) => {
                    cb(null, require('../../../../container/setup/object/detail'));
                });
            }
        },
        {
            path: 'detail/:objName/field',
            getComponent(location, cb) {
                require.ensure([], (require) => {
                    cb(null, require('../../../../container/setup/object/create-object-field'));
                });
            }
        },
        {
            path: 'detail/:objName/field-setting/:fieldName',
            getComponent(location, cb) {
                require.ensure([], (require) => {
                    cb(null, require('../../../../container/setup/object/object-field-setting.jsx'));
                });
            }
        }
    ]
};
