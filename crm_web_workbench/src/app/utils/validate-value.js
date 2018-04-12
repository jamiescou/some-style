/**

*/
import _ from 'lodash';
import { getRequire } from 'container/standard-object/build-field';

// function getObjectSchema(schema){
//     let result = {};
//     _.map(schema, v => {
//         result[v.name] = v;
//     });
//     return result;
// }

function validation(schema, param){
    // let objectSchema = getObjectSchema(schema);
    let requireSchema = getRequire(schema);
    let nameList = [];
    _.map(requireSchema, v => {
        let name = v.get('name');

        if (param[name] === null || param[name] === undefined){
            nameList.push(name);
        }
    });

    return nameList;
}

export default {
    validation
};
