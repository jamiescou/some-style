import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import {
    Input,
    DatePicker,
    TimePicker
} from 'carbon';

export default class BaseDateTime extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        let { onChange, value } = this.props;
        if (!value) {
            onChange(parseInt(this.formatDatePickerTime()));
        }
    }

    handleOnDateChange (param) {
        let { onChange } = this.props;
        onChange(parseInt(param));
    }

    formatDatePickerTime(value) {
        let DatePickerInit;
        if (value) {
            if (parseInt(value) - value === 0) {
                DatePickerInit = moment(parseInt(value)).format('x');// 传入的value 是时间戳的字符串
            } else {
                DatePickerInit = moment(value).format('x');// 传入的value 是utc时间
            }
        } else {
            DatePickerInit = moment().format('x');// 未传入时间,默认使用当前时间
        }
        return parseInt(DatePickerInit);
    }

    buildField() {
        let { value, error = false, active } = this.props;
        let timeInit = this.formatDatePickerTime(value);
        return (
            <div className="mcds-layout__column">
                <div className="mcds-layout__item-6">
                    <DatePicker
                        className="mcds-p__r-10"
                        init={timeInit}
                        closeOnOutsideClick={true}
                        placement="bottom-right"
                        onChange={::this.handleOnDateChange} >
                        <Input
                            active={active}
                            error={error}
                            iconRight={<span className="mcds-icon__data-line-20" />}
                            value={moment(timeInit).format('YYYY-MM-DD')} />
                    </DatePicker>
                </div>
                <div className="mcds-layout__item-6">
                    <TimePicker
                        error={error}
                        className="mcds-p__l-10"
                        onChange={::this.handleOnDateChange}
                        init={timeInit} />
                </div>
            </div>
        );
    }

    render() {
        return this.buildField();
    }
}

BaseDateTime.propTypes = {
    onChange: PropTypes.func,
    value: PropTypes.any,
    error: PropTypes.bool,
    active: PropTypes.bool
};
