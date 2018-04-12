import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

import { trim } from 'utils/dom';
import { zone as Zone } from 'constants/zone';

import {
    Cascader,
    Input
} from 'carbon';

export default class BaseAddress extends Component {
    constructor(props) {
        super(props);
    }

    handleOnCascaderChange(param) {
        let { onChange } = this.props;
        let formatAddress = this.formatArrayAddress(param);
        onChange(formatAddress);
        // 让街道信息输入框聚集
        this.refs.street_input.refs.node.focus();
    }

    handleOnStreetChange(param) {
        let { value, onChange } = this.props;
        let result = {};

        if (typeof value === 'string') {
            result.street = param;
        } else {
            result = {
                ...value,
                street: param
            };
        }

        onChange(result);
    }
    /**
     * 格式化数组形式的地址
     * Cascader onChange函数返回的是[country, state, city]的形式
     * @return {[Object]} [地址对象]
     */
    formatArrayAddress(v) {
        let result = {country: '', state: '', city: '', street: ''};
        let index = 0;
        _.map(result, (item, key) => {
            result[key] = v[index] || '';
            index++;
        });
        return result;
    }

    buildAddressInput = v => {
        if (!v) {
            return '';
        }
        let keys = ['country', 'state', 'city'];
        let context = '';
        for (let i = 0; i < keys.length; i++) {
            if (v[keys[i]]) {
                context += v[keys[i]] + ' ';
            }
        }
        return context;
    }

    buildField() {
        // placeholder, onChange, className,
        let { value, error = false, active } = this.props;
        // 级联中的input的值
        let addressCascaderInputValue = this.buildAddressInput(value);

        // 街道部份的input的值
        let addressStreetValue = value && value.street ? value.street : '';

        // 级联的值
        let defaultValue = value && value.city ? value.city : '';
        return (
            <div className="mcds-layout__column">
                <div className="mcds-layout__item-12">
                    <Cascader
                        data={Zone}
                        onChange={::this.handleOnCascaderChange}
                        defaultValue={trim(defaultValue)}
                        type="single"
                        placement="right" >
                        <Input active={active} error={error} ref="address_one" placeholder="请选择地区" value={addressCascaderInputValue} />
                    </Cascader>
                </div>
                <div className="mcds-layout__item-12 mcds-m__t-10">
                    <Input
                        error={error}
                        value={trim(addressStreetValue)}
                        onChange={::this.handleOnStreetChange}
                        placeholder="请添加街道信息"
                        ref="street_input" />
                </div>
            </div>
        );
    }

    render() {
        return this.buildField();
    }
}

BaseAddress.defaultProps = {
    value: {
        country: null,
        state: null,
        city: null,
        street: null
    }
};

BaseAddress.propTypes = {
    onChange: PropTypes.func,
    placeholder: PropTypes.string,
    className: PropTypes.string,
    value: PropTypes.any,
    error: PropTypes.bool,
    active: PropTypes.bool
};

