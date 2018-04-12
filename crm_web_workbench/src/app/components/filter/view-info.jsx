import I from 'immutable';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import React, { Component } from 'react';

import {
    InputRequird,
    Radio
} from 'carbon';
import styles from 'styles/modules/standard-object/index.scss';

export default class ViewInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: true,
            showView: true,
            showHeader: false,
            display_name: this.props.filter.display_name,
            visible_to: this.props.filter.visible_to
        };
    }
    // showView => 展开收缩整个视图信息块
    // showHeader => 只在筛选器组件用到
    componentWillMount(){
        if (this.props.viewHeader){
            this.setState({
                showHeader: false,
                show: false
            });
        } else {
            this.setState({
                showHeader: true,
                show: true
            });
        }
    }

    handleValInput(type, val){
        this.handleChangeHeader();
        this.props.onChange(I.fromJS({
            [type]: val
        }));
    }

    handleValRadio(type){
        this.setState({
            visible_to: type
        }, () => {
            this.props.onChange(I.fromJS({
                visible_to: type
            }));
        });
        this.handleChangeHeader();
    }
    handleHeader(){
        this.handleChangeHeader();
        this.closeView();
    }
    // 点击触发更改头部的信息
    handleChangeHeader(){
        // 添加或者删除时 头部变为筛选并保存
        if (this.props.onChangeHeader) {
            this.props.onChangeHeader('saveFilter');
        }
        if (this.props.onPositionHeader) {
            this.props.onPositionHeader('saveFilter');
        }
    }

    closeView() {
        this.setState({show: !this.state.show});
    }
    // 这块只在筛选器组件用到 (入口: Search组件)
    renderSaveBtn(){
        if (!this.state.showHeader){
            return (<div className={classnames('mcds-p__l-20 mcds-p__r-20 mcds-p__t-10', styles['filter-position__relative'])} >
                <a className={classnames('mcds-filter__inline-block mcds-text__size-13', {'mcds-text': this.state.show})} href="javascript:;" >
                    <i className="mcds-text__size-20 mcds-icon__add-line-20 mcds-filter__vertical-sub" />
                    <span className="mcds-text__size-12 mcds-p__l-13" onClick={::this.handleHeader}>保存为视图</span>
                </a>
                {this.state.show ? <i className={classnames('mcds-icon__arrow-line-20 mcds-filter__icon mcds-text__size-14', {'mcds-icon__rotate-360': this.state.show})} onClick={::this.closeView} style={{top: '16px'}} /> : null }
            </div>);
        }
    }
    render() {
        let {display_name, visible_to} = this.state;
        return (
            <div>
                {this.renderSaveBtn()}
                <div className={classnames('mcds-filter__condition', {'mcds-filter__close': !this.state.showView}, styles['filter-position__relative'])}>
                    <div className={classnames('mcds-layout__column', {'mcds-m__b-10': this.state.show}, {'mcds-filter__close': !this.state.showHeader})}>
                        <p className={classnames('mcds-text__size-13', {'mcds-text__link': !this.state.show} )}>视图信息</p>
                        <i className={classnames('mcds-icon__arrow-line-20 mcds-filter__icon mcds-text__size-14', {'mcds-icon__rotate-270': !this.state.show})} onClick={::this.closeView} style={{top: '22px'}} />
                    </div>
                    <div className={classnames('mcds-layout__column', {'mcds-filter__close': !this.state.show})}>
                        <div className="mcds-layout__item-12">
                            <InputRequird onChange={this.handleValInput.bind(this, 'display_name')} ref="viewName" label="视图名称" required="required" value={display_name} />
                        </div>
                        <div className="mcds-layout__column mcds-p__t-15">
                            <div className="mcds-layout__item-12">
                                <div className="mcds-label">
                                    谁可见
                                </div>
                            </div>
                            <div className="mcds-layout__item-6 mcds-p__t-10">
                                <Radio
                                    onClick={this.handleValRadio.bind(this, 'personal')}
                                    ref="viewPersonal"
                                    id="name1"
                                    className="mcds-white__space"
                                    label="个人视图"
                                    name="visible_to"
                                    checked={visible_to === 'personal'} />
                            </div>
                            <div className="mcds-layout__item-6 mcds-p__l-10 mcds-p__t-10">
                                <Radio
                                    ref="viewPublic"
                                    onClick={this.handleValRadio.bind(this, 'public')}
                                    id="name2"
                                    className="mcds-white__space"
                                    label="公共视图"
                                    name="visible_to"
                                    checked={visible_to === 'public'} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

ViewInfo.propTypes = {
    viewHeader: PropTypes.bool, // 视图是否可收回
    filter: PropTypes.object,
    onChange: PropTypes.func,
    onPositionHeader: PropTypes.func,
    onChangeHeader: PropTypes.func
};

