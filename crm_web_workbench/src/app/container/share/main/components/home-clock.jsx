import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {bindActionCreators} from 'redux';
import classnames from 'classnames';

import moment from 'moment';
import { convertSeconds } from 'utils/convert';
import styles from 'styles/modules/home/home-modal.scss';
import Cookies from 'cookies-js';

import { fetchEnterpriseData } from 'redux/reducers/standard-object/enterprise-info';
import {
    Loading
} from 'carbon';

class Clock extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            date: new Date()
        };
    }
    componentDidMount () {
        let id = Cookies.get('_tenant_id');
        if (id) {
            this.props.fetchEnterpriseData(id).then(()=> {
                this.setState({loading: false});
            });
        }
        this.timerID = setInterval(() => this.updateTime(), 3000);
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
    }

    renderEnterpriseInfo () {
        let { enterpriseInfo } = this.props;
        if (enterpriseInfo) {
            let times = new Date().getTime()/1000-enterpriseInfo.get('created_at');
            let parameter = {
                hour: false,
                minute: false,
                second: false
            };
            return (
                <div className={classnames(styles['home__clock-font'], 'mcds-m__t-40')}>
                    <div>
                        <span className="mcds-m__r-8">公司人数:</span>
                        <span>{enterpriseInfo.get('user_count')}</span>
                    </div>
                    <div>
                        <span className="mcds-m__r-8">使用天数:</span>
                        <span>{convertSeconds(times, parameter)}</span>
                    </div>
                </div>
            );
        }
        return (
            <div className="demo mcds-layout__row mcds-layout__middle mcds-layout__center" style={{height: '50%'}}>
                <div className="mcds-layout__item-12">
                    <Loading theme="logo" model="small" />
                </div>
            </div>
        );
    }
    updateTime () {
        this.setState({
            date: new Date()
        });
    }
    render() {
        return (
            <div className={classnames(styles['home__clock-box'], 'mcds-p__t-34 mcds-p__l-25 mcds-m__r-40 mcds-m__b-40')}>
                <div className={classnames(styles['home__clock-time'])}>
                    {moment(this.state.date).format('HH:mm')}
                </div>
                {this.renderEnterpriseInfo()}
            </div>
        );
    }
}
Clock.propTypes = {
    fetchEnterpriseData: PropTypes.func.isRequired, // 获取公司基本信息
    enterpriseInfo: PropTypes.object // 公司基本信息
};
export default connect(state => ({
    enterpriseInfo: state.getIn(['standardObject', 'enterpriseInfo', 'enterprise']) // 公司信息
}),
dispatch => bindActionCreators({ fetchEnterpriseData }, dispatch))(Clock);
