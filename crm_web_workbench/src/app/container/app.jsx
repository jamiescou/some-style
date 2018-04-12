import _ from 'lodash';
import moment from 'moment';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {Notifications} from 'carbon';
import GlobalHeader from './global-header';
import ExpiresModal from './__base/expires';
import { eventEmitter } from '../utils/event';


window.moment = moment;
require('styles/global/style.scss');
require('styles/modules/base/index.scss');

export default class App extends Component {
    static propTypes = {
        children: PropTypes.object.isRequired
    };

    constructor() {
        super();
        this.state = {
            showSigninModal: false
        };
    }

    componentDidMount() {
        // window.onbeforeunload = function () {
        //     return '您确定要退出页面吗？';
        // };
        eventEmitter.on('loginExpired', () => {
            this.setState({
                showSigninModal: true
            });
        });
    }

    componentDidUpdate() {
    }

    render() {
        let props: Object = _.assign({}, this.state, this.props);
        delete props.children;
        return (
            <div id="container">
                <div id="header">
                    <GlobalHeader />
                </div>
                <section id="main">
                    <div id="wrap">
                        {this.props.children && React.cloneElement(this.props.children, props)}
                    </div>
                </section>
                <Notifications />
                <ExpiresModal showSigninModal={this.state.showSigninModal} />
            </div>
        );
    }
}
