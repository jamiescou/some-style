export default {
    path: 'sObject/:objName',
    getComponent(location, cb) {
        require.ensure([], (require) => {
            cb(null, require('../../container/standard-object/index'));
        });
    },
    indexRoute: {
        getComponent(location, cb) {
            require.ensure([], (require) => {
                cb(null, require('../../container/standard-object/listview/standard-listview'));
            });
        }
    },
    childRoutes: [
        {
            path: 'territory/:territory_id',
            getComponent(location, cb) {
                require.ensure([], (require) => {
                    cb(null, require('../../container/territory/index'));
                });
            }
        },
        {
            path: 'multi-add',
            getComponent(location, cb) {
                require.ensure([], (require) => {
                    cb(null, require('../../container/standard-object/multi-add'));
                });
            }
        },
        {
            path: ':id',
            getComponent(location, cb) {
                require.ensure([], (require) => {
                    cb(null, require('../../container/standard-object/detailview'));
                });
            }
        },
        {
            path: 'relatedList/:relateObjName/:relatedKey/:id',
            getComponent(location, cb) {
                require.ensure([], (require) => {
                    cb(null, require('../../container/standard-object/listview/related-listview'));
                });
            }
        },
        {
            path: 'cooperationList/:cooperationObjName/:id',
            getComponent(location, cb) {
                require.ensure([], (require) => {
                    cb(null, require('../../container/standard-object/listview/cooperation-listview'));
                });
            }
        }
    ]
};
