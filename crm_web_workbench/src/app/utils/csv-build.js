/**
 * 生成 csv 文件, 接收二维数组
 * [[1,3,],[41,41],[123,123]]
 */

export default array => {
    let csvContent = 'data:text/csv;charset=utf-8,\uFEFF';
    array.forEach((infoArray, index) => {
        let content = [];
        infoArray.forEach(value => {
            let v = value;
            if (typeof v === 'string') {
                let reg = /[ ，,]/g;
                v = v.replace(reg, '');
            }
            content.push(v);
        });
        let dataString = content.join(',');

        csvContent += index < array.length ? dataString + '\n' : dataString;
    });
    return csvContent;
};
