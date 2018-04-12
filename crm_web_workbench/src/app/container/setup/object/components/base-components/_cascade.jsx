import _ from 'lodash';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import React, { Component } from 'react';
let style = require('styles/modules/setup/object.scss');
import CheckboxComponent from '../base-components/_checkbox';

import {
    Radio,
    Popover,
    PopoverBody,
    PopoverTrigger
} from 'carbon';

export default class Cascade extends Component {
    constructor(){
        super();
        this.state = {
            delete_option: 'NoAction'
        };
        this.getValue = this.getValue.bind(this);
    }
    getValue(){
        let nullable = this.refs.nullable.getValue();
        let delete_option = this.state;
        let mergeDate = _.merge({}, nullable, delete_option);
        return mergeDate;
    }
    // 级联删除设置
    handleCascade(type){
        this.setState({
            delete_option: type
        });
    }

    render(){
        return (
            <div className="mcds-layout__item-6 mcds-m__t-20">
                <div className={classnames(style['position-relative'])}>
                    <span className={classnames('mcds-text__size-12', style['text-color'])}>
                        级联删除设置
                    </span>
                    <div className={classnames(style['cascade-delete__icon'])}>
                        <PopoverTrigger triggerBy="click" placement={'right'} overlay={<PopoverDemoThemeInfo />}>
                            <span className={classnames('mcds-icon mcds-filter__inline-block mcds-icon__info-solid-14 mcds-filter__logic-icon mcds-p__l-5', style['margin-top__2'])} />
                        </PopoverTrigger>
                    </div>
                </div>
                <div className={classnames('clearfix mcds-m__t-10')}>
                    <div className="clearfix">
                        <Radio checked={this.state.delete_option === 'NoAction'} className="pull-left mcds-m__r-31" label="无变化" name="cascade" onChange={this.handleCascade.bind(this, 'NoAction')} />
                        <Radio checked={this.state.delete_option === 'SetNull'} className="pull-left mcds-m__r-31" label="置空" name="cascade" onChange={this.handleCascade.bind(this, 'SetNull')} />
                        <Radio checked={this.state.delete_option === 'Restrict'} className="pull-left mcds-m__r-31" label="限制删除" name="cascade" onChange={this.handleCascade.bind(this, 'Restrict')} />
                        <Radio checked={this.state.delete_option === 'Cascade'} className="pull-left mcds-m__r-31" label="级联删除" name="cascade" onChange={this.handleCascade.bind(this, 'Cascade')} />
                    </div>
                    <CheckboxComponent className="mcds-m__t-20" ref="nullable" type="nullable" />
                </div>
            </div>
        );
    }
}

let PopoverDemoThemeInfo = props => (
    <Popover theme="info" className={classnames(props.className)}>
        <PopoverBody>
            <div className="mcds-text__size-13">
                <p>若查找记录被删除，本记录的级联删除设置；</p>
                <p>无变化：查找记录被删除，本记录无变化；</p>
                <p>置空：查找记录被删除，本记录查找字段置为空；</p>
                <p>限制删除：不允许查找记录被删除；</p>
                <p>级联删除：查找记录被删除，本记录级联删除。</p>
            </div>
        </PopoverBody>
    </Popover>
);

PopoverDemoThemeInfo.propTypes = {
    className: PropTypes.string
};
