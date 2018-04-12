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
                role  页面,角色页面
            </div>
        );
    }
}
