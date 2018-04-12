
// import _ from 'lodash';
import PropTypes from 'prop-types';

import React, { Component } from 'react';
import {
    DatePicker
} from 'carbon';
export default class MiniCalendar extends Component {

    constructor(){
        super();
    }
    componentDidMount(){
        let button = this.refs.btn;
        button.click();
    }
    handleDate(v){
        this.props.onChangeDate(v);
    }
    render(){
        let { current } = this.props;
        return (
            <div>
                <DatePicker
                    value={current}
                    placement="bottom"
                    onChange={::this.handleDate}>
                    <button
                        ref="btn"
                        className="mcds-button__brand">
                        时间选择器
                    </button>
                </DatePicker>
            </div>
        );
    }
}
MiniCalendar.propTypes = {
    onChangeDate: PropTypes.func,
    current: PropTypes.any
};
