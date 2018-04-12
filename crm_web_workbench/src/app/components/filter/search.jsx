import _ from 'lodash';
import classnames from 'classnames';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import I from 'immutable';
import FilterCondition from './filter-condition';
import ViewInfo from './view-info';
import FilterLogic from './filter-logic';
import styles from 'styles/modules/standard-object/index.scss';
import {
    Button
} from 'carbon';

export default class Search extends Component {
    constructor(props) {
        super(props);
        this.state = {
            filter: props.filter,
            headerInfo: 'default',
            notChooseFilter: true
        };
    }
    // headerInfo 判断头部信息
    // 默认值 default 显示默认筛选器
    // onlyFilter  显示筛选
    // saveFilter 保存并筛选
    // notChooseFilter 点击保存视图后 再点击添加或者删除时 header 扔为保存并筛选
    handleChange(filter) {
        filter.map((val, key) => {
            switch (key){
            case 'display_name':
            case 'filter_from' :
            case 'visible_to':
                this.setState({
                    filter: this.state.filter.merge(filter)
                }, () => { console.log('filter', this.state.filter.toJS()); });
                break;
            case 'expressions':
                let logical_relation = '';
                if (val.size) {
                    logical_relation = '1';
                    if (val.size > 1) {
                        for (let i = 2; i <= val.size; i++){
                            logical_relation += ' AND ' + i;
                        }
                    }
                }
                this.setState({
                    filter: this.state.filter.mergeIn(['filter'], I.fromJS({expressions: val, logical_relation: logical_relation}))
                }, () => {
                    console.log(' search after setState filter is', this.state.filter.toJS());
                });
                break;
            case 'logical_relation':
                this.setState({
                    filter: this.state.filter.mergeIn(['filter'], filter)
                }, () => {
                    console.log(' search after setState filter is ', this.state.filter.toJS());
                });
                break;
            default:
                throw new Error(`not fount the ${key} of ${filter}`);
            }
        });
    }

    // 保存并筛选
    _commit() {
        this.props.onCommit(this.state.filter);
    }
    // 仅仅筛选操作
    _commitFilter(){
        let filter = this.state.filter.toJS();
        let newFilter = _.pick(filter, 'filter', 'filter_from');
        this.props.onFilterCommit(I.fromJS(newFilter));
    }
    // 更改头部信息
    _handleHeader(info){
        if (!this.state.notChooseFilter){ return; }
        if (info === 'saveFilter'){
            this.setState({
                headerInfo: info,
                notChooseFilter: false
            });
        } else {
            this.setState({
                headerInfo: info
            });
        }
    }
    renderFilterHeader() {
        switch (this.state.headerInfo){
        case 'default' :
            // Todo: 这是不确定只是筛选做什么处理
            return (
                <div className="mcds-layout__column mcds-filter__title">
                    <p className="mcds-m__l-20 mcds-text__size-16">筛选器</p>
                    <i className="mcds-icon__close-line-20 mcds-filter__icon mcds-text__size-20" onClick={this.props.onCancel} />
                </div>
            );
        case 'saveFilter' :
            return (
                <div className="mcds-layout__column mcds-filter__title">
                    <div className="mcds-layout__item-6 mcds-layout__left mcds-p__l-20">
                        <Button className="mcds-button__neutral mcds-btn__right" onClick={this.props.onCancel}>
                            取消
                        </Button>
                    </div>
                    <div className="mcds-layout__right mcds-p__r-20">
                        <Button className="mcds-button__brand close" onClick={this._commit.bind(this)}>
                            保存并筛选
                        </Button>
                    </div>
                </div>
            );
        case 'onlyFilter' :
            return (
                <div className="mcds-layout__column mcds-filter__title">
                    <div className="mcds-layout__item-6 mcds-layout__left mcds-p__l-20">
                        <Button className="mcds-button__neutral mcds-btn__right" onClick={this.props.onCancel}>
                            取消
                        </Button>
                    </div>
                    <div className="mcds-layout__right mcds-p__r-20">
                        <Button className="mcds-button__brand close" onClick={this._commitFilter.bind(this)}>
                            筛选
                        </Button>
                    </div>
                </div>
            );
        default :
            throw new Error(`not found the information about ${this.state.headerInfo}`);
        }
    }

    // {slideInRight: this.state.header, slideOutRight: !this.state.header}

    render() {
        let filter = this.state.filter;
        if (!filter){
            throw new Error(`parent conponent props filter is ${filter}`);
        }
        let expressions = filter.getIn(['filter', 'expressions']);
        let filter_from = filter.get('filter_from');
        let logical_relation = filter.getIn(['filter', 'logical_relation']);
        let visible_to = filter.get('visible_to');
        let display_name = filter.get('display_name');
        return (
            <div className={classnames('mcds-divider__top mcds-filter mcds-divider__left animated mcds-layout__row slideInRight', styles['view-filter__position'])} >
                {this.renderFilterHeader()}
                <div id="filterContainer" className={classnames('mcds-filter__body', styles['filter-scrollbar'])}>
                    <FilterCondition
                        onChangeHeader={this._handleHeader.bind(this)}
                        onChange={this.handleChange.bind(this)}
                        filter={{
                            expressions,
                            filter_from
                        }}
                        pageTitle={this.props.pageTitle}
                        schema={this.props.schema} />
                    <FilterLogic
                        filter={{
                            logical_relation
                        }}
                        onChangeHeader={this._handleHeader.bind(this)}
                        flag={true}
                        onChange={this.handleChange.bind(this)} />
                    <ViewInfo
                        filter={{
                            display_name,
                            visible_to
                        }}
                        onChange={this.handleChange.bind(this)}
                        onChangeHeader={this._handleHeader.bind(this)}
                        viewHeader={true} />
                </div>
            </div>
        );
    }
}

Search.defaultProps = {
    onCommit: function() {} // 搜索,或者保存
};

Search.propTypes = {
    filter: PropTypes.object,
    onCommit: PropTypes.func,
    schema: PropTypes.object,
    onFilterCommit: PropTypes.func,
    onCancel: PropTypes.func,
    pageTitle: PropTypes.string
};

