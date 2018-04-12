import { isAvailable } from '../util';

function doubleType(value) {
    if (!isAvailable(value)) {
        return '';
    }
    return value;
}
export default doubleType;
