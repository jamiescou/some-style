/**
 * action生成器, 使用:
 * let addAction = createAction('ADD', 'id') 等同与 function addAction(id){ return {type: 'ADD', id: id} }
 * @param type
 * @param argNames
 */
let createAction = (type, ...argNames) => (...args) => {
    let action = {type};
    argNames.forEach((arg, index) => {
        action[argNames[index]] = args[index];
    });
    return action;
};

/**
 * reducer 生成器, 使用
 * let userReducer = createReducer(initState, {['ADD'](state, action){ return state}});
 * @param initState
 * @param handlers
 */
let createReducer = (initState, handlers = {}) => (state = initState, action = {}) => {
    if (handlers.hasOwnProperty(action.type)) {
        return handlers[action.type](state, action);
    }

    return state;
};

export {createAction, createReducer};
export default {
    createAction,
    createReducer
};
