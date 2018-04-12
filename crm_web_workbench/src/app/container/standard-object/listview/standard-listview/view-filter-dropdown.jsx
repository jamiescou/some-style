/**
 * Created by listen1013 on 17/7/18.
 */
import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import DeleteModal from '../../modal/delete-filter';
let style = require('styles/modules/standard-object/index.scss');
import { browserHistory } from 'react-router';
import { transferToTree } from 'container/territory/utils';
const pinyin = window.pinyin;

import {
    Button,
    DropDown,
    DropDownList,
    DropDownItem,
    DropDownTrigger,
    DropDownItemDivider,
    DropDownItemHeader,
    InputSearch
} from 'carbon';

export default class ViewFilterDropdown extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            keyword: '',
            filterArray: this.sortFilter(),
            isSearch: false
        };
    }
    componentWillReceiveProps(){
        this.setState({
            keyword: '',
            filterArray: this.sortFilter(),
            isSearch: false
        });
    }
    // 视图列表排序
    sortFilter(){
        let filter = this.props.filter.toJS().view_filters;
        let filterData = _.map(filter, (val, key)=>{
            return {
                key,
                val,
                sort: pinyin(val.display_name)[0][0]
            };
        });
        filterData = _.toArray(filterData);
        filterData.sort((a, b) => a.sort.localeCompare(b.sort));

        return filterData;
    }
    getNewKeyWord(keyword){
        let reg = /[~!#$^&*()+=|{}:;,\[.<>/\\?~！#￥……&*（）——|{}【】‘；：”。，、？‘’]/g;
        return keyword.replace(reg, $0 => {
            return `\\${$0}`;
        });
    }
    // 渲染下拉列表
    renderView(hasSelected) {
        let filter = this.props.filter;
        let { keyword } = this.state;
        let newKeyword = this.getNewKeyWord(keyword);
        if (!filter) { return false; }
        let view_filter = this.props.view_filter;
        let { filterArray } = this.state;
        let reg = new RegExp(newKeyword, 'i');
        return filterArray.map(v => {
            let isSelected = view_filter && (view_filter.id === v.key);
            let displayName = !this.state.isSearch ? v.val.display_name : v.val.display_name.replace(reg, ($0) => { return (`<u><strong>${$0}</strong></u>`); });
            return (
                <DropDownItem
                    key={v.key}
                    className={!hasSelected || !isSelected ? 'mcds-text__indent-2 close' : 'close'}
                    iconLeft={isSelected ? <span className="mcds-icon__left mcds-icon__checked-line-20 mcds-text__size-20" /> : null}
                    onClick={() => this.props.onSelectView(v.key)} >
                    <span dangerouslySetInnerHTML={{__html: displayName}} />
                </DropDownItem>
            );
        });
    }

    // 渲染删除当前视图的下拉选项
    renderDeleteItem() {
        let { objName, view_filter, onDelete } = this.props;
        let clickFlag = view_filter && view_filter.id;
        let trigger = (
            <DropDownItem
                className={classnames(!clickFlag ? style['text-disabled__false'] : null, {close: clickFlag}, !clickFlag ? style['list-pageHeader__disabled'] : null)}
                iconLeft={<span className="mcds-icon__left mcds-icon__delete-solid-14 mcds-text__size-20" />} >
                删除当前视图
            </DropDownItem>
        );

        if (!view_filter || !view_filter.id) {
            return trigger;
        }
        return (
            <DeleteModal
                trigger={trigger}
                objName={objName}
                id={view_filter.id}
                fail={() => {}}
                success={onDelete} />
        );
    }
    searchChange(v){
        let val = v.replace(/\s/g, '');
        this.setState({
            keyword: val
        });
        let filterArray = this.sortFilter();
        let filterArr = [];
        let newKeyWord = this.getNewKeyWord(val);
        let reg = new RegExp(newKeyWord, 'i');
        if (val !== ''){
            filterArr = _.filter(filterArray, (value) => {
                return reg.test(value.val.display_name);
            });
            this.setState({
                filterArray: filterArr,
                isSearch: true
            });
        } else {
            this.setState({
                filterArray: this.sortFilter(),
                isSearch: false
            });
        }
    }
    dropDownClose(){
        this.setState({
            filterArray: this.sortFilter(),
            isSearch: false,
            keyword: ''
        });
    }
    // 跳转到海的页面
    handleTerritoryRecord(territory_id, e){
        e.stopPropagation();
        let { objName } = this.props;
        this.refs.downTrigger.close();
        browserHistory.push({ pathname: `/sObject/${objName}/territory/${territory_id}`});
    }
    renderCascaderList(data, key){
        let { territory_id } = this.context.router.params;
        if (data.get('children')) {
            return (
                <DropDownItem
                    key={key}
                    onClick={this.handleTerritoryRecord.bind(this, data.get('territory_id'))}
                    className={classnames(territory_id === data.get('territory_id') ? style['view-filter__indent'] : 'mcds-text__indent-2')}
                    iconLeft={territory_id === data.get('territory_id') ? <span className="mcds-icon__left mcds-icon__checked-line-20 mcds-text__size-20" /> : null}>
                    {data.get('name')}
                    <DropDown>
                        <DropDownList>
                            {data.get('children').map((v, k) => this.renderCascaderList(v, k))}
                        </DropDownList>
                    </DropDown>
                </DropDownItem>
            );
        }
        return (
            <DropDownItem
                key={key}
                onClick={this.handleTerritoryRecord.bind(this, data.get('territory_id'))}
                className={classnames(territory_id === data.get('territory_id') ? style['view-filter__indent'] : 'mcds-text__indent-2')}
                iconLeft={territory_id === data.get('territory_id') ? <span className="mcds-icon__left mcds-icon__checked-line-20 mcds-text__size-20" /> : null}>
                {data.get('name')}
            </DropDownItem>
        );
    }
    // 渲染海的树形结构
    renderTerritoryList(){
        let { territory_list } = this.props;
        if (territory_list && territory_list.size) {
            territory_list = transferToTree(territory_list, 'territory_id', 'parent_id', 'children');
            // territory_list的最外层包裹为缓冲海,不在用户界面显示
            return (
                territory_list.toArray()[0].get('children').map((v, k) => this.renderCascaderList(v, k))
            );
        }
    }
    // 渲染海
    renderTerritory(){
        let { model } = this.props;
        if (model && model.size) {
            return (
                <DropDownList>
                    <DropDownItemHeader>{model.get('name')}</DropDownItemHeader>
                    {this.renderTerritoryList()}
                </DropDownList>
            );
        }
    }
    render() {
        let { view_filter, view_filters, pageTitle } = this.props;
        let { territory_id } = this.context.router.params;
        let hasSelected = view_filters && view_filters.has((view_filter && view_filter.id) ? view_filter.id : '');
        let viewFilterName = hasSelected ? view_filters.getIn([view_filter.id, 'display_name']) : `全部${pageTitle}`;
        let ItemHeaderName = !this.state.isSearch ? '我的视图' : '搜索结果';

        return (
            <div className="mcds-media__body" key="list">
                <div className="mcds-pageheader__header-left-text">{this.props.pageTitle}</div>
                <DropDownTrigger autoCloseTag="close" target="self" ref="downTrigger" synchWidth={false} onClose={ ()=> this.dropDownClose()}>
                    <Button className={classnames('mcds-text__line-28 mcds-pageheader__title', style['list-border__none'])}>
                        <span className={classnames('mcds-truncate', style['view-name__overflow'])}>{viewFilterName}</span>
                        <i className="mcds-icon__triangle-solid-14" />
                    </Button>
                    <DropDown className={style['border-none']}>
                        <DropDownList>
                            <InputSearch
                                ref="search"
                                value={this.state.keyword}
                                searchCallback={(v) => { this.searchChange(v); }}
                                className="mcds-p__l-15 mcds-p__r-15 mcds-p__t-5 mcds-p__b-5"
                                placeholder="搜索"
                                search="right" />
                            <DropDownItemDivider />
                            <DropDownList className={classnames(style['view-filter__wrap'])}>
                                <DropDownItemHeader>{ItemHeaderName}</DropDownItemHeader>
                                {!this.state.isSearch ? <DropDownItem
                                    iconLeft={hasSelected || territory_id ? null : <span className="mcds-icon__left mcds-icon__checked-line-20 mcds-text__size-20" />}
                                    className={classnames('close', hasSelected || territory_id ? 'mcds-text__indent-2' : null)}
                                    onClick={() => this.props.onSelectDefault()} >
                                    {`全部${pageTitle}`}
                                </DropDownItem> : null}
                                {this.renderView(hasSelected)}
                            </DropDownList>
                            <DropDownItemDivider />
                            {/* 海的渲染 */}
                            {/* {this.renderTerritory()} */}
                            {/* <DropDownItemDivider /> */}
                            <DropDownItem
                                onClick={() => this.props.onEdit()}
                                className={classnames(!hasSelected ? style['text-disabled__false'] : null, {close: hasSelected}, !hasSelected ? style['list-pageHeader__disabled'] : null)}
                                iconLeft={<span className="mcds-icon__left mcds-icon__edit-line-20 mcds-text__size-20" />} >
                                编辑当前视图
                            </DropDownItem>
                            {this.renderDeleteItem()}

                            <DropDownItem className="close" onClick={() => this.props.onCreate()} iconLeft={<span className="mcds-icon__left mcds-icon__add-line-20 mcds-text__size-20" />} >
                                新建自定义视图
                            </DropDownItem>
                        </DropDownList>
                    </DropDown>
                </DropDownTrigger>
            </div>
        );
    }
}
ViewFilterDropdown.contextTypes = {
    router: PropTypes.object
};

ViewFilterDropdown.propTypes = {
    objName: PropTypes.string,
    pageTitle: PropTypes.string,
    filter: PropTypes.object,
    view_filter: PropTypes.object,
    view_filters: PropTypes.object,
    onSelectView: PropTypes.func,
    onDelete: PropTypes.func,
    onSelectDefault: PropTypes.func,
    onEdit: PropTypes.func,
    onCreate: PropTypes.func,
    model: PropTypes.object, // 海的列表
    territory_list: PropTypes.object // 海的节点列表
};
