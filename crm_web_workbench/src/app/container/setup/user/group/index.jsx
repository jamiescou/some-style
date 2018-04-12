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
                group  页面,小组页面
            </div>
        );
    }
}
