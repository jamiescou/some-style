import React, { Component } from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import UserInfo from './user-info';
import { default_avatar } from '../../../../utils/user-setting.js';

import classnames from 'classnames';
import {
    DropDownTrigger,
    DropDown,
    DropDownList,
    DropDownItem
} from 'carbon';
import styles from 'styles/modules/home/home-modal.scss';

class customerService extends Component {
    constructor(props) {
        super(props);
        this.state = {
            handleBox: false,
            pilotLampType: {
                name: '通话中',
                lamp: '/public/img/state-on-line.png'
            }
        };
    }
    handleBoxTaggle () {
        this.setState({
            handleBox: !this.state.handleBox
        });
    }
    handleType (v) {
        this.setState({
            pilotLampType: v
        });
    }

    renderLampType(type) {
        let pilotLampType = [
            {
                name: '通话中',
                lamp: '/public/img/state-on-line.png'
            },
            {
                name: '忙碌',
                lamp: '/public/img/state-leave.png'
            },
            {
                name: '下线',
                lamp: '/public/img/state-off-line.png'
            },
            {
                name: '空闲',
                lamp: '/public/img/state-invisible.png'
            }
        ];
        if (type === 'inside') {
            return pilotLampType.map((v, i) => {
                return (
                    <DropDownItem key={i} onClick={this.handleType.bind(this, v)} className="close">
                        <img src={v.lamp} className={classnames(styles['type-lamp'], 'mcds-m__r-5 mcds-m__b-2')} />
                        <span className={classnames(styles['type-lamp'], 'mcds-m__r-8')} />
                        <span>{v.name}</span>
                    </DropDownItem>
                );
            });
        }
        return pilotLampType.map((v, i) => {
            return (
                <DropDownItem key={i} onClick={this.handleType.bind(this, v)} className={classnames(styles['type-width'], 'close')}>
                    <img src={v.lamp} />
                </DropDownItem>
            );
        });
    }
    renderUserInfo () {
        let abc = false;
        if (abc) {
            return (
                <ul>
                    <UserInfo
                        avatar={null}
                        username="张小姐"
                        phone="15110097611"
                        phoneTime="12分钟"
                        time="09:34:03" />
                </ul>
            );
        }
        return (
            <div className={classnames(styles['body-info'], 'mcds-layout mcds-layout__row mcds-layout__center')}>
                <div className="mcds-m__t-30 mcds-text__size-20"><span>15110097611</span></div>
                <div className="mcds-m__t-8 mcds-text__size-12"><span>四川 成都</span></div>
                <div className={classnames(styles['img-size'], 'mcds-m__t-35')}><img src={default_avatar} alt="" /></div>
                <div className="mcds-m__t-15">张小姐</div>
                <div className="mcds-m__t-40">正在呼叫</div>
                <div className={classnames(styles['icon-size'], 'mcds-layout__item-2 mcds-m__t-10')}>
                    <span className="mcds-icon__telephone-solid-24 mcds-text__size-26 mcds-icon__rotate-180" />
                </div>
            </div>
        );

    }

    renderCustomer () {
        let { pilotLampType, handleBox } = this.state;
        if (handleBox) {
            return (
                <div className={classnames(styles['home__customer-box'])}>
                    <div className={classnames(styles['home__customer-header'])}>
                        <div className={classnames(styles['header-text'], 'pull-left mcds-p__t-15 mcds-p__l-15')}>
                            <span>
                                最近通话
                            </span>
                        </div>
                        <div className={classnames(styles['header-icon'], 'pull-right mcds-p__r-9 mcds-p__t-9')} onClick={::this.handleBoxTaggle}>
                            <span className="mcds-icon__arrow-line-20" />
                        </div>
                    </div>
                    <div className={classnames(styles['home__customer-type'])}>
                        <div className={classnames(styles['type-text'], 'pull-left')}>
                            当前状态
                        </div>
                        <DropDownTrigger className="pull-right" autoCloseTag="close">
                            <div className={classnames(styles['type-text'])}>
                                <img src={pilotLampType.lamp} className={classnames(styles['type-lamp'], 'mcds-m__r-5')} />
                                <span className={classnames(styles['type-name'])}>{pilotLampType.name}</span>
                                <span className="mcds-icon__arrow-line-20 mcds-m__l-5" />
                            </div>
                            <DropDown className={classnames(styles['type-minWidth'])}>
                                <DropDownList>
                                    {this.renderLampType('inside')}
                                </DropDownList>
                            </DropDown>
                        </DropDownTrigger>
                    </div>
                    <div className={classnames(styles['home__customer-body'])}>
                        { this.renderUserInfo() }
                    </div>
                </div>
            );
        }
        return (
            <div className={classnames(styles['home__customer-phone'])}>
                <div className={classnames(styles['phone-icon'])}>
                    <span className="mcds-icon__telephone-solid-24 mcds-text__size-30" onClick={::this.handleBoxTaggle} />
                </div>
                <DropDownTrigger placement="left-top" autoCloseTag="close" className={classnames(styles['phone-type'])}>
                    <img src={pilotLampType.lamp} className={classnames(styles['type-lamp'], 'mcds-m__r-5')} />
                    <DropDown className={classnames(styles['type-left'], 'mcds-dropdown__min-no')}>
                        {this.renderLampType()}
                    </DropDown>
                </DropDownTrigger>
            </div>
        );
    }
    render() {
        return this.renderCustomer();
    }
}
export default connect(
    null,
    dispatch => bindActionCreators({ }, dispatch)
)(customerService);

