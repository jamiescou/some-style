import I from 'immutable';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import React, { Component } from 'react';

import { Radio } from 'carbon';
import ConditionItem from './condition-item';
import EditConditionItem from './edit-item';
import styles from 'styles/modules/standard-object/index.scss';
export default class FilterCondition extends Component {
    constructor(props) {
        super(props);
        this.state = {
            condition: false,
            edit: [],
            filterForm: false,
            headerChange: false,
            filter: props.filter
        };
        this.handleOutsideMouseClick = this.handleOutsideMouseClick.bind(this);
    }
    componentWillMount(){
        this._closeItems();
    }

    componentDidMount() {
        let filterContainer = document.querySelector('#filterContainer');
        filterContainer.addEventListener('mouseup', this.handleOutsideMouseClick);
        filterContainer.addEventListener('touchstart', this.handleOutsideMouseClick);
    }
    componentWillReceiveProps(nextProps){
        if (nextProps.filter){
            this.setState({
                filter: nextProps.filter
            });
        }
    }
    componentWillUpdate(nextProps) {
        let {expressions} = nextProps.filter;
        expressions = expressions || I.fromJS([]);
        if (this.state.edit.length !== expressions.size) {
            expressions.map(() => {
                this.state.edit.push(1);
            });
        }
    }

    componentWillUnmount() {
        let filterContainer = document.querySelector('#filterContainer');
        filterContainer.removeEventListener('mouseup', this.handleOutsideMouseClick);
        filterContainer.removeEventListener('touchstart', this.handleOutsideMouseClick);
    }

    handleOutsideMouseClick(e) {
        const root = this.refs.items;
        const showData = this.refs.showData;
        if (root.contains(e.target) || showData.contains(e.target) || (e.button && e.button !== 0)) { return; }
        this._closeItems();
    }

    // 点击触发更改头部的信息
    handleChangeHeader(){
        // 添加或者删除时 头部变为筛选按钮
        if (this.props.onChangeHeader) {
            this.props.onChangeHeader('onlyFilter');
        }
    }

    // 点击删除一个筛选条件
    handleClick(index) {
        let filter = this.state.filter;
        let { expressions } = filter;
        let aryResult = this.state.edit;
        expressions = expressions.delete(index);
        aryResult.splice(index, 1);
        filter.expressions = expressions;
        // aryResult[0] = 0;
        this.setState({
            edit: aryResult,
            filter
        }, () => {
            this.handleChangeHeader();
            this.props.onChange(I.fromJS({
                expressions: this.state.filter.expressions
            }));
        });
    }
    // 创建condition
    createCondition(){
        let { schema } = this.props;
        let randomFilter = schema.toArray()[0];
        let result = {
            display_name: randomFilter.get('display_name') || randomFilter.get('name'), // 表达式显示名称
            field: randomFilter.get('name'), // 要筛选的字段名称
            operator: '',
            type: randomFilter.get('type'),
            operands: [''] // 等于（范围）需要 2 个值
        };
        return result;
    }
    handleAddCondition() {
        let {expressions} = this.state.filter;
        let ary = [];
        if ((expressions && expressions.size) >= 10) {
            return false;
        }
        let condition = this.createCondition();
        condition = I.fromJS(condition);
        // this._closeItems();
        expressions = expressions.push(condition);
        expressions.map(() => {
            ary.push(0);
        });
        ary[expressions.size - 1] = 1;
        this.setState({
            filter: {
                ...this.state.filter,
                expressions
            },
            edit: ary
        }, () => {
            this.props.onChange(I.fromJS({
                expressions: this.state.filter.expressions
            }));
            if (this.props.onPositionHeader) {
                this.props.onPositionHeader('saveFilter');
            }
            this.handleChangeHeader();
        });
    }

    // 切换为展示模式
    _closeItems() {
        let { expressions } = this.state.filter;
        let ary = [];
        expressions.map(() => {
            ary.push(0);
        });
        this.setState({
            edit: ary,
            filterForm: false
        });
    }
    //  清除所有数据
    clearData() {
        let { expressions } = this.state.filter;
        expressions = expressions.clear();
        this.handleChangeHeader();
        this.setState({
            filter: {
                ...this.state.filter,
                expressions
            }
        }, () => {
            this.props.onChange(I.fromJS({
                expressions
            }));
        });
    }

    closeCondition(){
        this.setState({condition: !this.state.condition});
    }
    // 传递线索数据
    handleValRadio(type){
        this.setState({
            filterForm: false
        }, () => {
            if (this.props.onPositionHeader) {
                this.props.onPositionHeader('saveFilter');
            }
            this.props.onChange(I.fromJS({
                filter_from: type
            }));
        });
    }
    // 点击编辑
    handleEdit(index) {
        this._closeItems();
        let expressions = this.state.filter.expressions;
        let ary = [];
        expressions.map(() => {
            ary.push(0);
        });
        ary[index] = 1;
        this.setState({
            edit: ary,
            headerChange: true
        });
    }
    handleFilterForm() {
        this.handleChangeHeader();
        this.setState({
            filterForm: true,
            headerChange: true
        });
    }

    renderCondition(v, index) {
        let {expressions} = this.state.filter;
        if (this.state.edit[index] === 0) {
            return (
                <ConditionItem
                    label={v.get('display_name')}
                    field={v.get('field')}
                    operator={v.get('operator')}
                    operands={v.get('operands')}
                    schema={this.props.schema}
                    close={this.handleClick.bind(this, index)}
                    onClick={this.handleEdit.bind(this, index)} />
            );
        }
        return (
            <EditConditionItem
                onPositionHeader={this.props.onPositionHeader}
                onChangeHeader={this.handleChangeHeader.bind(this)}
                index={index}
                onChange={this.props.onChange}
                expressions={expressions}
                schema={this.props.schema}
                close={this.handleClick.bind(this, index)} />

        );
    }
    renderFilterFrom(){
        let {
            filter_from
        } = this.state.filter;
        let pageTitle = this.props.pageTitle;
        return (
            <div className="mcds-layout__column">
                <div className="mcds-layout__item-12">
                    <p className="mcds-text__weak mcds-text__size-12 mcds-m__t-10 mcds-m__b-10">显示这些数据</p>
                </div>
                <div className="mcds-filter__field pointer" ref="showData">
                    <div className={classnames('mcds-p__l-12 mcds-p__t-13', styles['filter-h__32'], this.state.filterForm ? 'hide' : '')} onClick={::this.handleFilterForm}>
                        <p className=" mcds-text__weak mcds-text__size-13">{filter_from === 'all' ? `所有${pageTitle}` : `个人${pageTitle}`}</p>
                    </div>
                    <div className={classnames('mcds-layout__column mcds-p__l-12 mcds-p__t-9 mcds-p__t-13', styles['filter-h__32'], this.state.filterForm ? '' : 'hide')}>
                        <div className="mcds-layout__item-6">
                            <Radio
                                onClick={this.handleValRadio.bind(this, 'all')}
                                label={`所有${pageTitle}`}
                                id="everying"
                                name="filterFrom"
                                checked={filter_from === 'all'} ref="everying" />
                        </div>
                        <div className="mcds-layout__item-6">
                            <Radio
                                onClick={this.handleValRadio.bind(this, 'private')}
                                label={`个人${pageTitle}`}
                                id="personal"
                                name="filterFrom"
                                checked={filter_from === 'private'} ref="personal" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    render() {
        let {
            expressions
        } = this.state.filter;
        return (
            <div className={classnames('mcds-filter__condition', styles['filter-wrap'])} ref={(node) => { this.node = node; }} onClick={this.props.onClickFun.bind(this, this.state.headerChange)}>
                <div className={classnames('mcds-layout__column', {'mcds-m__b-6': !this.state.condition}, styles['filter-position__relative'])}>
                    <p className={classnames('mcds-text__size-13', this.state.condition ? 'mcds-text__link' : '' )}>筛选条件</p>
                    <i className={classnames('mcds-icon__arrow-line-20  mcds-text__size-14 mcds-filter__icon', this.state.condition ? 'mcds-icon__rotate-270' : 'mcds-icon__rotate-360')} onClick={::this.closeCondition} style={{top: '4px', right: '-4px'}} />
                </div>
                <div className={classnames('animated', {'mcds-filter__close fadeOut': this.state.condition, fadeIn: !this.state.condition})}>
                    {this.renderFilterFrom()}
                    <div className="mcds-m__t-19">
                        <p className="mcds-text__weak mcds-text__size-12 mcds-m__t-10 mcds-m__b-10">匹配这些筛选条件</p>
                        <div className="mcds-layout__column">
                            <ul className="mcds-list" ref="items">
                                {expressions.map((v, index)=>{
                                    return (
                                        <li key={v.get('field') + index} className="mcds-list__item mcds-m__b-10 pointer" >
                                            {::this.renderCondition(v, index)}
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    </div>
                    <div className="mcds-m__t-19">
                        <div className="mcds-layout__column">
                            <div className="mcds-layout__item-6 mcds-layout__column mcds-layout__left">
                                <a className={classnames('mcds-text__size-13', {'mcds-text__weak mcds-disabled': expressions.size >= 10 })} href="javascript:;" onClick={::this.handleAddCondition}>添加筛选条件</a>
                            </div>
                            <div className="mcds-layout__item-6 mcds-layout__column mcds-layout__right">
                                <a className="mcds-text__size-13" href="javascript:;" onClick={::this.clearData}>全部清除</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

FilterCondition.defaultProps = {
    onClickFun: ()=>{}
};

FilterCondition.propTypes = {
    filter: PropTypes.object,
    schema: PropTypes.object,
    onClickFun: PropTypes.func,
    onChange: PropTypes.func,
    onPositionHeader: PropTypes.func,
    onChangeHeader: PropTypes.func,
    pageTitle: PropTypes.string
};
