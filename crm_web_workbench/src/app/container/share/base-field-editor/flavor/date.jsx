import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import {
    Input,
    DatePicker
} from 'carbon';

export default class BaseDate extends Component {
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
                <DatePicker
                    className="mcds-p__r-10"
                    init={timeInit}
                    closeOnOutsideClick={true}
                    placement="bottom-right"
                    onChange={this.handleOnDateChange.bind(this)}>
                    <Input
                        error={error}
                        iconRight={<span className="mcds-icon__data-line-20" />}
                        value={moment(timeInit).format('YYYY-MM-DD')} />
                </DatePicker>
            </div>
        );
    }

    render() {
        return this.buildField();
    }
}
BaseDate.propTypes = {
    onChange: PropTypes.func,
    value: PropTypes.any,
    error: PropTypes.bool
};
