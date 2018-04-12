import { isAvailable } from '../util';
import moment from 'moment';

export default function date(value) {
    if (!isAvailable(value) || !value) {
        return '';
    }

    return moment(value).format('YYYY-MM-DD');
}

