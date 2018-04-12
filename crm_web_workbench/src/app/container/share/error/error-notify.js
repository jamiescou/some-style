import { notify } from 'carbon';
import _ from 'lodash';

// const single_promise_error = 0;
// const batch_promise_error = 1;

// const single_promise_error_keys = ['message', 'fields'];
// const batch_promise_error_keys = [];

// let _findErrorResType = (err) => {
//     let _err = err;
//     let result = [batch_promise_error_type, single_promise_error_type];


//     for (let k in _err) {
//         if (single_promise_error_keys.indexOf(k) === -1) {
//             result = _.filter(result, v => v ===)
//         }
//     }
// };
// let buildSingleNotify = (err) => {

// }
// let buildBatchNotify = (err) => {

// }
let ErrorNotify = (response) => {
    let defaultError = '操作失败';
    let defaultTheme = 'error';

    // console.log("response", response);
    let { topError } = response;
    if ( topError ) {
        _.map(topError, v => {
            if (v.desc) {
                notify.add({message: v.desc|| defaultError, theme: defaultTheme});
            }
        });
    }
    if (response && response.error) {
        notify.add({message: response.error.message || defaultError, theme: defaultTheme});
    } else {
        notify.add({message: JSON.stringify(response.message) || defaultError, theme: defaultTheme});
    }
};
export default ErrorNotify;
