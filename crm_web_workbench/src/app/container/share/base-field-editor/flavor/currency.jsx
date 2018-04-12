import _ from 'lodash';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    Select,
    Input
} from 'carbon';

import { currency as CurrencyData } from 'constants/currency';

export default class BaseText extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: props.value || {symbol: '', value: '0'}
        };
    }
    handleOnSymboxChange(v) {
        let { value, onChange } = this.props;
        let result = {symbol: '', value: this.state.value};
        if (typeof value === 'string') {
            result.symbol = v;
        } else {
            result = {
                ...value,
                symbol: v
            };
        }
        onChange(result);
    }
    handleOnPriceChange(_v) {
        let v = _v;
        let { value, onChange } = this.props;
        let result = value;
        let reg = /((^[+-]?([1-9]\d*)*)|^[+-]?0)(\.\d+)?$|(^[-]0\.\d+$)/;
        if (v[0] === '.'){
            v = '0.'+v.substr(1);
        }
        if (v[0] === '+' || v[0] === '-'){
            if (v[1] === '.'){
                v = v[0]+'0.'+v.substr(2);
            }
            if (v[1] === '0' && v[2] !== '.'){
                v = v[0]+v[1];
            }
        }
        if (v.indexOf('.') !== -1 && v.match(/\./g).length >= 2){
            return;
        }
        let val = '';
        if (reg.test(Number(v)) || reg.test(v)){
            val = v;
        } else {
            return;
        }
        if (val[0] === '0' && val.indexOf('.') === -1 ){
            val = Number(val);
        }
        this.setState({
            value: val
        }, () => {
            if (typeof value === 'string') {
                result = {
                    value: this.state.value
                };
            } else {
                result = {
                    ...value,
                    value: this.state.value
                };
            }
            onChange(result);
        });
    }
    handleOnPriceFocus(){
        let value = this.state.value;
        if (typeof value === 'string'){
            this.setState({
                value: value === '0' ? '' : value
            });
        } else {
            this.setState({
                value: {
                    ...value,
                    value: value.value === '0' ? '' : value.value
                }
            });
        }
    }
    buildField() {
        let { value, error = false, active } = this.props;
        // 如果用户编辑时更改了数量,会将value改为string类型，这里需要判断
        let val = typeof this.state.value === 'string' ? this.state.value : this.state.value.value ;
        let symbolValue = value && value.symbol ? value.symbol : undefined;
        if (parseInt(symbolValue) === -1) {
            symbolValue = undefined;
        }
        let options = _.map(CurrencyData, (v) => <option error={error} key={v.symbol} value={v.symbol}>{v.text}</option>);
        options = [<option error={error} value={-1} key={-1}>请选择</option>].concat(options);

        return (
            <div className="mcds-layout__column">
                <Select
                    error={error}
                    onChange={this.handleOnSymboxChange.bind(this)}
                    value={symbolValue}
                    className="mcds-layout__item-4 mcds-p__r-10">
                    {options}
                </Select>
                <Input
                    active={active}
                    error={error}
                    onFocus={this.handleOnPriceFocus.bind(this)}
                    placeholder="请输入价格"
                    value={val}
                    className="mcds-layout__item-8 mcds-p__l-10"
                    onChange={this.handleOnPriceChange.bind(this) } />
            </div>
        );
    }

    render() {
        return this.buildField();
    }
}

BaseText.propTypes = {
    onChange: PropTypes.func,
    value: PropTypes.any,
    error: PropTypes.bool,
    active: PropTypes.bool
};

