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
                queue  页面,队列页面
            </div>
        );
    }
}
