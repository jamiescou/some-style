import React, { Component } from 'react';
import classnames from 'classnames';
import { Link } from 'react-router';
import SettingFieldSafety from './components/base-components/setting-field-safety';
import AddPageLayout from './components/base-components/add-page-layout';
import AddCustomList from './components/base-components/add-custom-list';
let style = require('styles/modules/setup/object.scss');

export default class ObjectFieldSetting extends Component {
    static propTypes = {};
    constructor(){
        super();
        this.state = {
            component: 'setting-field-safety'
        };
    }
    hangleComponent(type){
        this.setState({
            component: type
        });
    }
    renderPageHeader(){
        return (
            <div className={classnames('mcds-pageheader', style['create-field__header'])}>
                <div className="mcds-grid mcds-pageheader__header">
                    <div className="mcds-pageheader__header-left">
                        <div className="mcds-media">
                            <div className="mcds-m__r-30 mcds-p__t-6">
                                <div className={classnames('mcds-pageheader__header-left-icon mcds-p__t-4 mcds-p__l-4', style['bg-gray'])} >
                                    <span className={classnames('mcds-text__size-24 mcds-icon__settings-solid-24', style['color-white'])} />
                                </div>
                            </div>
                            <div className="mcds-media__body">
                                <div className="mcds-pageheader__header-left-text mcds-text__size-13">
                                    <Link to="/setup">
                                        设置首页
                                    </Link>
                                    <i className={classnames('mcds-icon__arrow-line-20 mcds-text__size-13 mcds-icon__rotate-270 mcds-m__l-5 mcds-m__r-5', style['detail-icon'])} />
                                    <Link to="/setup/object">
                                        对象设置
                                    </Link>
                                    <i className={classnames('mcds-icon__arrow-line-20 mcds-text__size-13 mcds-icon__rotate-270 mcds-m__l-5 mcds-m__r-5', style['detail-icon'])} />
                                    <Link to="/setup/object/test">
                                        客户
                                    </Link>
                                </div>
                                <div className="mcds-text__line-28 mcds-pageheader__title">
                                    字段名称
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    renderContainer(){
        let component = this.state.component;
        switch (component){
        case 'setting-field-safety' :
            return <SettingFieldSafety onCommit={this.hangleComponent.bind(this)} />;
        case 'add-page-layout' :
            return <AddPageLayout onCommit={this.hangleComponent.bind(this)} />;
        case 'add-custom-list' :
            return <AddCustomList onCommit={this.hangleComponent.bind(this)} />;
        default :
            throw new Error(`No matching components were found about ${component}`);
        }
    }
    render(){
        return (
            <div>
                {this.renderPageHeader()}
                {this.renderContainer()}
            </div>
        );
    }
}
