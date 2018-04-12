import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Phone } from 'carbon';

export default class BasePhone extends Component {
    static propTypes = {
        placeholder: PropTypes.string,
        className: PropTypes.string,
        onChange: PropTypes.func,
        value: PropTypes.string,
        error: PropTypes.bool,
        active: PropTypes.bool
    }
    constructor(props) {
        super(props);
    }
    handleOnChange(val) {
        let { onChange } = this.props;
        onChange(val);
    }
    render() {
        let dictionary = {CN: '中国', RU: '俄罗斯', US: '美国'};
        let country = 'CN';
        let countries = ['CN', 'US', 'RU'];
        let { error=false, active = false, value, placeholder = '请输入手机号或座机号' } = this.props;
        return (
            <Phone
                error={error}
                active={active}
                dictionary={dictionary}
                international={false}
                onChange={::this.handleOnChange}
                country={country}
                countries={countries}
                nativeExpanded={false}
                value={value}
                placeholder={placeholder} />
        );
    }
}
