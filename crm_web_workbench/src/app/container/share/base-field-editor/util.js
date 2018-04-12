import PropTypes from 'prop-types';

function buildDependenField (opts = {}, relatedValue) {
    let options = {};
    let { related, list } = opts;
    try {
        // 为了兼容
        if (typeof opts === 'string') {
            options = opts.split(';');
        } else if (related) {
            if (relatedValue && relatedValue !== -1) {
                options = list[relatedValue].options_value;
            } else {
                options = [];
            }
        } else {
            options = list.all.options_value;
        }
    } catch (err) {
        console.warning('buildDependenField failed');
        options = [];
    }
    return options;
}

let commonPtys = {
    // typeof ['immutable', 'object'],
    schema: PropTypes.object.isRequired,

    // 初始值
    value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
        PropTypes.object
    ]),
    active: PropTypes.bool,

    // 依赖关联字段的value值,只有picklist/mpicklist几个字段使用
    relatedValue: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]),
    // error 状态
    error: PropTypes.bool,

    // handleOnchangle
    onChange: PropTypes.func,

    // 交互窗内的文字提醒
    placeholder: PropTypes.string
};
export default {
    buildDependenField,
    commonPtys
};
