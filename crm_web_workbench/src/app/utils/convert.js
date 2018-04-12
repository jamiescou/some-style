/**
 * convert-bytes.js
 * [将 bytes 转换为更大的单位]
 * @param  {number} bytes [字节]
 * @param {number} decimals [保留几位小数]
 * @return {string}
 */
export function convertBytes(bytes, decimals) {
    if (!bytes) {
        return '0 B';
    }
    let k = 1000; // 二进制时用 1024
    let new_decimals = decimals + 1 || 2; // 默认保留两位
    let sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    let i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(new_decimals)) + ' ' + sizes[i];
}


/**
 * convert-seconds.js
 * [将秒转换为更大的单位]
 * @param  {number} seconds [秒]
 * @return {string}
 */
export function convertSeconds(sec, type={}) {
    let seconds = sec;
    if (!seconds) {
        return 0;
    }
    let DisplayTimeNode = {
        day: true,
        hour: true,
        minute: true,
        second: true
    };
    Object.assign(DisplayTimeNode, type);
    let time = '';
    if (DisplayTimeNode.day && seconds >= 24 * 3600) {
        time += parseInt(seconds / (24 * 3600)) + '天';
        seconds %= (24 * 3600);
    }
    if (DisplayTimeNode.hour && seconds >= 3600) {
        time += parseInt(seconds / 3600) + '小时';
        seconds %= 3600;
    }
    if (DisplayTimeNode.minute && seconds >= 60) {
        time += parseInt(seconds / 60) + '分钟';
        seconds %= 60;
    }
    if (DisplayTimeNode.second && seconds > 0) {
        time += seconds + '秒';
    }
    return time;
}
