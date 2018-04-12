import I from 'immutable';
import ViewInfo from './view-info';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import React, { Component } from 'react';

import FilterLogic from './filter-logic';
import FilterCondition from './filter-condition';
import styles from 'styles/modules/standard-object/index.scss';

import {
    Button
} from 'carbon';

let defaultFilter = {
    display_name: '',
    visible_to: 'personal', // 有效值: 'personal' 或 'public'
    filter_from: 'private', // 有效值: 'private' 或 'all'
    filter: {
        expressions: [],
        logical_relation: ''
    }
};
export default class Create extends Component {
    constructor(props) {
        super(props);
        this.state = {
            filter: I.fromJS(defaultFilter),
            headerInfo: 'default'
        };
    }
    handleChange(filter) {
        filter.map((val, key) => {
            switch (key){
            case 'display_name':
            case 'filter_from' :
            case 'visible_to':
                this.setState({
                    filter: this.state.filter.merge(filter)
                });
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
                    console.log(' create after setState filter is', this.state.filter.toJS());
                });
                break;
            case 'logical_relation':
                this.setState({
                    filter: this.state.filter.mergeIn(['filter'], filter)
                }, () => {
                    console.log('create after setState filter is', this.state.filter.toJS());
                });
                break;
            default:
                throw new Error(`not fount the ${key} of ${filter}`);
            }
        });
    }

    // 更改头部信息
    _handleHeader(info){
        this.setState({
            headerInfo: info
        });
    }

    _commit() {
        this.props.onCommit(this.state.filter);
    }

    renderFilterHeader() {
        switch (this.state.headerInfo){
        case 'default' :
            return (
                <div className="mcds-layout__column mcds-filter__title">
                    <p className="mcds-m__l-20 mcds-text__size-16">新建视图</p>
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
                        <Button className="mcds-button__brand close" onClick={::this._commit}>
                            保存并筛选
                        </Button>
                    </div>
                </div>
            );
        default :
            throw new Error(`not found the information about ${this.state.headerInfo}`);
        }
    }

    //  {slideInRight: this.state.header, slideOutRight: !this.state.header}

    render() {
        let filter = this.state.filter;
        let expressions = filter.getIn(['filter', 'expressions']);
        let filter_from = filter.get('filter_from');
        let logical_relation = filter.getIn(['filter', 'logical_relation']);
        let visible_to = filter.get('visible_to');
        let display_name = filter.get('display_name');
        return (
            <div className={classnames('mcds-divider__top mcds-filter mcds-divider__left animated mcds-layout__row slideInRight', styles['view-filter__position'])} >
                {this.renderFilterHeader()}
                <div id="filterContainer" className={classnames('mcds-filter__body', styles['filter-scrollbar'])}>
                    <ViewInfo
                        onPositionHeader={this._handleHeader.bind(this)}
                        filter={{
                            display_name,
                            visible_to
                        }}
                        onChange={this.handleChange.bind(this)}
                        viewHeader={false} />
                    <FilterCondition
                        onChange={this.handleChange.bind(this)}
                        filter={{
                            expressions,
                            filter_from
                        }}
                        pageTitle={this.props.pageTitle}
                        onPositionHeader={this._handleHeader.bind(this)}
                        schema={this.props.schema} />
                    <FilterLogic
                        filter={{
                            logical_relation
                        }}
                        flag={true}
                        onPositionHeader={this._handleHeader.bind(this)}
                        onChange={this.handleChange.bind(this)} />
                </div>
            </div>
        );
    }
}



Create.defaultProps = {
    onClose: function() {}, // 关闭当前面板
    onCommit: function() {} // 搜索,或者保存
};

Create.propTypes = {
    filter: PropTypes.object,
    onClose: PropTypes.func,
    onCommit: PropTypes.func,
    schema: PropTypes.object,
    onCancel: PropTypes.func,
    pageTitle: PropTypes.string
};

