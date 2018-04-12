import classnames from 'classnames';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

import {
    Checkbox,
    TextArea,
    Radio,
    Popover,
    PopoverBody,
    PopoverTrigger
} from 'carbon';

import FilterCondition from './_filterCondition';
let style = require('styles/modules/setup/object.scss');

export default class BuildFilter extends Component {
    constructor(){
        super();
        this.state = {
            filterFlag: true
        };
        this.getValue = this.getValue.bind(this);
    }
    getValue(){
        // let lookupFilterData = this.refs.lookupFilter.getValue();
        return {aaa: '阿斯达撒大'};
    }
    handleFilter(){
        this.setState({
            filterFlag: !this.state.filterFlag
        });
    }
    // 设置必选可选
    handleRequireRadio(bool){
        this.setState({
            data: {
                ...this.state.data,
                strict_obey: bool
            }
        });
    }
    // 启用筛选器
    // 字段不知道是哪个 暂时用startUsing表示  后期改
    // TODO
    handleCheckboxData(val){
        if (val) {
            this.setState({
                data: {
                    ...this.state.data,
                    startUsing: val
                }
            }, () => {
                console.log('false', this.state);
            });
        } else {
            let data = this.state.data;
            delete data.startUsing;
            this.setState({
                data
            }, () => {
                console.log('false', this.state);
            });
        }
    }
    // 查找窗口文本
    handleLookupText(val){
        this.setState({
            data: {
                ...this.state.data,
                result_help_text: val
            }
        });
    }
    // 渲染查找筛选器
    renderLookupFilter(){
        if (this.state.filterFlag){
            return (
                <div className="mcds-p__t-20 mcds-p__l-40 mcds-p__r-40 mcds-p__b-30">
                    <FilterCondition ref="lookupFilter" type="lookupFilter" />
                    {this.renderFilterType()}
                    {this.renderLookupText()}
                </div>
            );
        }
    }
    // 筛选器类型
    renderFilterType(){
        return (
            <div className="mcds-m__t-20">
                <span className={classnames('mcds-text__size-12', style['text-color'])}>筛选器类型</span>
                <PopoverTrigger triggerBy="click" placement={'right'} overlay={<PopoverDemoThemeInfo value="用户若要为主记录创建子记录，至少需要的权限。" />}>
                    <span className={classnames('mcds-icon mcds-filter__inline-block mcds-icon__info-solid-14 mcds-filter__logic-icon mcds-p__l-5', style['margin-top__2'])} />
                </PopoverTrigger>
                <div className={classnames('mcds-m__t-5 clearfix')}>
                    <Radio className="mcds-m__r-30 pull-left" label="必填" name="filterType" onChange={this.handleRequireRadio.bind(this, true)} />
                    <Radio className="pull-left" label="可选" name="filterType" onChange={this.handleRequireRadio.bind(this, false)} />
                </div>
            </div>
        );
    }
    // 查找文本
    renderLookupText(){
        return (
            <div className="mcds-m__t-20">
                <span className={classnames('mcds-text__size-12', style['text-color'])}>查找窗口文本</span>
                <PopoverTrigger triggerBy="click" placement={'right'} overlay={<PopoverDemoThemeInfo value="没看到在哪里" />}>
                    <span className={classnames('mcds-icon mcds-filter__inline-block mcds-icon__info-solid-14 mcds-filter__logic-icon mcds-p__l-5', style['margin-top__2'])} />
                </PopoverTrigger>
                <div className={classnames('mcds-m__t-10', style['create-filter__textarea'])}>
                    <TextArea />
                </div>
                <div className="mcds-m__t-10">
                    <Checkbox className={classnames(style['create-position__checkbox'])} label="启动该筛选器" onChange={this.handleCheckboxData.bind(this)} />
                </div>
            </div>
        );
    }
    render(){
        return (
            <div>
                <div className={classnames('mcds-p__t-15 mcds-p__b-15 mcds-p__l-16 mcds-text__size-16', style['font-weight__300'], style['border-b__shadow'])} >
                    <i className={classnames('mcds-icon__arrow-line-20 mcds-text__size-16 mcds-m__l-5 mcds-m__r-5', {'mcds-icon__rotate-270': !this.state.filterFlag})} />
                    <span className="mcds-cursor__pointer" onClick={::this.handleFilter}>
                        查找筛选器
                    </span>
                    <PopoverTrigger triggerBy="click" placement={'right'} overlay={<PopoverDemoThemeInfo value="该筛选器将限制用户在 {查找字段} 中可用的记录。" />}>
                        <span className={classnames('mcds-icon mcds-filter__inline-block mcds-icon__info-solid-14 mcds-filter__logic-icon mcds-p__l-5', style['margin-top__2'])} />
                    </PopoverTrigger>
                </div>
                {this.renderLookupFilter()}
            </div>
        );
    }
}

let PopoverDemoThemeInfo = props => (
    <Popover theme="info" className={classnames(props.className)}>
        <PopoverBody>
            {props.value}
        </PopoverBody>
    </Popover>
);
PopoverDemoThemeInfo.propTypes = {
    className: PropTypes.string,
    value: PropTypes.string
};


