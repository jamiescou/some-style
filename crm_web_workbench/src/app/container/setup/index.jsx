import React, { Component } from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

@connect(
    null,
    dispatch => bindActionCreators({}, dispatch)
)
export default class Home extends Component {
    static propTypes = {
    };

    render() {
        return (
            <div>
                index 页面,这个页面没有东西
            </div>
        );
    }
}
