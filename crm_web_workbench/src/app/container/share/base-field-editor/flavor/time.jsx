import React, { Component } from 'react';
import { commonPtys } from '../util';
import moment from 'moment';
import {
    TimePicker
} from 'carbon';

export default class BaseTime extends Component {
    static propTypes = {
        ...commonPtys
    };
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        let { onChange, value } = this.props;
        if (!value) {
            onChange(parseInt(this.formatDatePickerTime()));
        }
    }

    handleOnDateChange(param) {
        let { onChange } = this.props;
        onChange(parseInt(param));
    }

    formatDatePickerTime(value) {
        let DatePickerInit;
        if (value) {
            if (parseInt(value) - value === 0) {
                DatePickerInit = moment(parseInt(value)).format('x'); // 传入的value 是时间戳的字符串
            }
            DatePickerInit = moment(value).format('x'); // 传入的value 是utc时间
        } else {
            DatePickerInit = moment().format('x'); // 未传入时间,默认使用当前时间
        }
        return parseInt(DatePickerInit);
    }

    buildField() {
        let { value, error = false } = this.props;
        let timeInit = this.formatDatePickerTime(value);
        return (
            <div className="mcds-layout__column">
                <TimePicker
                    error={error}
                    className=""
                    onChange={this.handleOnDateChange.bind(this)}
                    init={timeInit} />
            </div>
        );
    }

    render() {
        return this.buildField();
    }
}
