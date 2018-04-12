
export default ({dispatch, getState}) => next => action => {

    if (typeof action === 'function') {
        return action(dispatch, getState);
    }

    const {promise, types, ...rest} = action;
    if (!promise) {
        return next(action);
    }

    return new Promise((resolve, reject) => {

        let [REQUEST, SUCCESS, FAILURE] = types;

        // 判断一下，有一些不需要REQUEST状态
        if (REQUEST) {
            next({...rest, type: REQUEST});
        }

        let resultPromise = promise(getState, dispatch);

        resultPromise.then(
            result => {
                if (SUCCESS) {
                    next({...rest, result, type: SUCCESS});
                }
                return resolve({...rest, result, type: 'success'});
            },
            error => {
                if (FAILURE) {
                    next({...rest, error, type: FAILURE || 'FAKE_REQUEST'});
                }
                return reject({...rest, error, type: 'error'});
            }
        );
    });
};
