import _ from 'lodash';

const Address = (value) => {
    let address = '';
    let keys = ['country', 'state', 'city', 'street'];
    _.map(keys, v => {
        address += value[v] ? value[v] + ' ' : '';
    });
    return address;
};
export default Address;
