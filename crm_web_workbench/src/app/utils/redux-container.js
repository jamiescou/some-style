// 这个文件用来存放一些常用的变量

let _redux;


export default {
    setRedux: (store) => {
        if (store) {
            _redux = store;
        }
    },

    getRedux: () => {
        return _redux;
    }
};
