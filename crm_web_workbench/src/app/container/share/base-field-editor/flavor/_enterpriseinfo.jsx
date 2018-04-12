import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import {
    Input,
    DropDown,
    DropDownTrigger,
    DropDownList,
    DropDownItem,
    Tab,
    TabItem,
    TabContent
} from 'carbon';

let style = require('styles/modules/standard-object/enterprise-info.scss');


export default class EnterpriseInfoBase extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // 输入框部份的id
            id: Math.random().toString(36).substring(7),
            // 弹出层的modal的id, id与id2 可能用class,但是可能性能差一点
            id2: Math.random().toString(36).substring(7),
            // 搜索的下拉是否处理激活的状态
            searchListOpen: false,
            // 下拉列表的数据
            data: props.data,
            // 为true时显示Tab，为false时显示下拉列表项
            showTab: false,
            // Tab的索引值，默认打开时Tab面板的第2个栏目处于激活状态
            index: 2,
            // 为true时，Tab为不可用状态
            disableTab: true,
            // 选中的搜索条目
            selectedItem: {}
        };

        // 下拉框打开时，点击外部区域关闭下拉框
        this.handleOutsideMouseClick = this.handleOutsideMouseClick.bind(this);
        this.init = this.init.bind(this);
    }

    componentDidMount() {
        document.addEventListener('mouseup', this.handleOutsideMouseClick);
        document.addEventListener('touchstart', this.handleOutsideMouseClick);
    }

    // data属性发生变化时更新data状态值
    componentWillReceiveProps(nextProps) {
        let oldData = this.state.data;
        let newData = nextProps.data;
        if (!_.isEqual(oldData, newData)) {
            this.setState({data: newData});
        }
    }

    // 组件卸载时移除监听事件，防止内存泄漏
    componentWillUnmount() {
        document.removeEventListener('mouseup', this.handleOutsideMouseClick);
        document.removeEventListener('touchstart', this.handleOutsideMouseClick);
    }
    /**
     * 用处数据的初始化,
     * 如果传入了默认的value,与data数组,判断后,初始化tab
     * @param {*} data 
     */
    init(data) {
        let { defaultValue } = this.props;
        let { selectedItem } = this.state;
        let stateValue = this.state.value;
        if (!stateValue && _.isEmpty(selectedItem) && data && data[0] && defaultValue) {
            if (data[0].name === defaultValue) {
                this.setState({
                    selectedItem: data[0],
                    disableTab: false,
                    data
                });
            }
        }
    }
    // 下拉数据开关的控制
    searchListTrigger(open = false) {
        let trigger = this.refs.searchListTrigger;
        if (open) {
            trigger.open();
        } else {
            trigger.close();
            this.setState({
                showTab: false
            });
        }
    }

    // trigger设置下拉列表开关状态
    handleSearchListTriggerState(searchListOpen = false) {
        this.setState({searchListOpen});
    }

    // input输入框的值变化时触发
    handleInputOnChange(value) {
        this.setState({
            inputValue: value,
            showTab: false,
            disableTab: true
        });
    }

    // 下拉框打开时，点击外部区域关闭下拉框
    handleOutsideMouseClick(e) {
        let { id, id2 } = this.state;
        let path = e.path || (e.composedPath && e.composedPath());
        let idList = [];
        for (let i = 0; i < path.length; i++) {
            let pathId = path[i].id;
            if (pathId) {
                idList.push(pathId);
            }
        }
        if (idList.indexOf(id) === -1 && idList.indexOf(id2) === -1) {
            this.searchListTrigger(false);
        }
    }

    // 搜索列表项点击事件
    handleSearchListItemClick(id, name) {
        this.setState({
            inputValue: name
        });
        this.searchListTrigger(false);

        // 更新Tab面板
        let data = this.state.data;
        let selectedItemIndex = _.findIndex(data, o => o.id === id);
        let selectedItem = data[selectedItemIndex];
        this.setState({
            selectedItem,
            disableTab: false
        });

        // 触发父组件的onChange事件
        this.props.onChange(name);
    }

    // 搜索框按键抬起时触发的事件
    handleSearchKeydown(e){
        this.keyword = e.target.value;
        clearTimeout(this.requestTimer);
        this.requestTimer = setTimeout(() => {
            this.props.onKeyDown(this.keyword);
        }, 500);
    }

    // 搜索框得到焦点
    handleInputOnClick(){
        this.refs.searchListTrigger.open();
    }

    // "工商信息"按钮单击事件
    handleRightIconClick(e) {
        e.preventDefault();
        e.stopPropagation();

        // 如果输入框右侧的按钮（即工商信息）为不可点击状态，则直接返回
        if (this.state.disableTab) {
            return;
        }

        let showTab = this.state.showTab;
        this.setState({
            showTab: !showTab
        }, () => {
            if (showTab) {
                this.refs.searchListTrigger.close();
            } else {
                this.refs.searchListTrigger.open();
            }
        });
    }

    // 获取搜索下拉框的单个条目
    getSeachListItem({id, name}, index) {
        return (
            <DropDownItem key={index} onClick={this.handleSearchListItemClick.bind(this, id, name)}>
                <div className="mcds-tile mcds-media" >
                    <div className="mcds-media__body mcds-tile__detail">
                        <h3 className={style['enterprise-info__item-name']} >
                            {name}
                        </h3>
                    </div>
                </div>
            </DropDownItem>
        );
    }

    // 渲染搜索下拉列表框
    renderSearchList() {
        let { data } = this.state;
        let items = [];
        data.forEach((item, index) => {
            items.push(this.getSeachListItem(item, index));
        });
        return (
            <DropDownList>
                <div className={style['enterprise-info__search-list-wrap']}>
                    {items}
                </div>
            </DropDownList>
        );
    }

    // tab面板切换时触发事件，将单击的面板设为激活状态
    handleTabChange(index, e){
        e.preventDefault();
        e.stopPropagation();
        this.setState({
            index
        });
    }
    handleBackRest() {
        let { selectedItem } = this.state;
        let { EnterpriseInfoBackReset, schema } = this.props;

        EnterpriseInfoBackReset(selectedItem, schema);
    }
    renderEnterpriseBackRest() {
        let { EnterpriseInfoBackReset } = this.props;
        if (!EnterpriseInfoBackReset || typeof EnterpriseInfoBackReset !== 'function') {
            return null;
        }
        return (
            <div className={style['enterprise-info__tab-bottom']}>
                <a onClick={this.handleBackRest.bind(this)}><span className="mcds-icon__fill-in-line-20 mcds-text__size-20 reset-icon" />工商信息回填</a>
            </div>
        );
    }
    // 点击搜索输入框右侧的“工商信息”按钮，弹出一个Tab面板显示选中企业的工商信息
    renderTab() {
        let selectedItem = this.state.selectedItem;
        return (
            <div className="mcds-container">
                <Tab className={classnames('mcds-tab__default', style['enterprise-info__tab'])}>
                    <TabItem className={classnames(this.state.index === 1 ? 'mcds-tab__active' : null )} onClick={this.handleTabChange.bind(this, 1)}>
                        <span className="mcds-tab-left__icon mcds-icon__open-folder" />
                        基本信息
                        <span className="mcds-tab-right__icon mcds-icon__close-medium" />
                    </TabItem>
                    <TabItem className={classnames(this.state.index === 2 ? 'mcds-tab__active' : null )} onClick={this.handleTabChange.bind(this, 2)}>
                        <span className="mcds-tab-left__icon mcds-icon__open-folder" />
                        联系信息
                        <span className="mcds-tab-right-small__icon mcds-icon-default__color mcds-icon__triangle-small" />
                        <span className="mcds-tab-right__icon mcds-icon-default__color mcds-icon__close-medium" />
                    </TabItem>
                    <TabItem className={classnames(this.state.index === 3 ? 'mcds-tab__active' : null )} onClick={this.handleTabChange.bind(this, 3)}>
                        经营范围
                    </TabItem>

                    <TabContent className={classnames('mcds-p__b-0', this.state.index === 1 ? 'mcds-tab__active' : null )}>
                        <div className="mcds-m__b-15">
                            <p className={classnames('mcds-m_b-5', style['enterprise-info__tab-item-title'])}>公司名称</p>
                            <p className={style['enterprise-info__tab-item-content']}>{selectedItem.name}</p>
                        </div>
                        <div className="mcds-m__b-15">
                            <p className={classnames('mcds-m_b-5', style['enterprise-info__tab-item-title'])}>法人</p>
                            <p className={style['enterprise-info__tab-item-content']}>{selectedItem.legal_person}</p>
                        </div>
                        <div className="mcds-m__b-15">
                            <p className={classnames('mcds-m_b-5', style['enterprise-info__tab-item-title'])}>成立时间</p>
                            <p className={style['enterprise-info__tab-item-content']}>{selectedItem.estiblish_time}</p>
                        </div>
                        <div className="mcds-m__b-15">
                            <p className={classnames('mcds-m_b-5', style['enterprise-info__tab-item-title'])}>注册资金</p>
                            <p className={style['enterprise-info__tab-item-content']}>{selectedItem.reg_capital}</p>
                        </div>
                        <div className="mcds-m__b-15">
                            <p className={classnames('mcds-m_b-5', style['enterprise-info__tab-item-title'])}>营业状态</p>
                            <p className={style['enterprise-info__tab-item-content']}>{selectedItem.reg_status}</p>
                        </div>
                        <div className="mcds-m__b-15">
                            <p className={classnames('mcds-m_b-5', style['enterprise-info__tab-item-title'])}>曾用名</p>
                            <p className={style['enterprise-info__tab-item-content']}>{selectedItem.history_names}</p>
                        </div>
                        <div className="mcds-m__b-15">
                            <p className={classnames('mcds-m_b-5', style['enterprise-info__tab-item-title'])}>行业</p>
                            <p className={style['enterprise-info__tab-item-content']}>{selectedItem.industry}</p>
                        </div>
                        <div className="mcds-m__b-15">
                            <p className={classnames('mcds-m_b-5', style['enterprise-info__tab-item-title'])}>工商注册号</p>
                            <p className={style['enterprise-info__tab-item-content']}>{selectedItem.reg_number}</p>
                        </div>
                        <div className="mcds-m__b-15">
                            <p className={classnames('mcds-m_b-5', style['enterprise-info__tab-item-title'])}>组织机构代码</p>
                            <p className={style['enterprise-info__tab-item-content']}>{selectedItem.org_number}</p>
                        </div>
                        <div className="mcds-m__b-15">
                            <p className={classnames('mcds-m_b-5', style['enterprise-info__tab-item-title'])}>统一社会信用代码</p>
                            <p className={style['enterprise-info__tab-item-content']}>{selectedItem.credit_code}</p>
                        </div>
                    </TabContent>
                    <TabContent className={classnames('mcds-p__b-0', this.state.index === 2 ? 'mcds-tab__active' : null )}>
                        <div className="mcds-m__b-15">
                            <p className={classnames('mcds-m_b-5', style['enterprise-info__tab-item-title'])}>电话</p>
                            <p className={style['enterprise-info__tab-item-content']}>{selectedItem.phones}</p>
                        </div>
                        <div className="mcds-m__b-20">
                            <p className={classnames('mcds-m_b-5', style['enterprise-info__tab-item-title'])}>办公地址</p>
                            <p className={style['enterprise-info__tab-item-content']}>{selectedItem.reg_address}</p>
                        </div>
                    </TabContent>
                    <TabContent className={classnames('mcds-p__b-0', this.state.index === 3 ? 'mcds-tab__active' : null )}>
                        <div>
                            <p className={classnames('mcds-m_b-5', style['enterprise-info__tab-item-title'])}>经营范围</p>
                            <p className={style['enterprise-info__tab-item-content']}>{selectedItem.business_scope}</p>
                        </div>
                    </TabContent>
                </Tab>
                {/* 这里, 只有配置了回填方法, 才显示回填 */}
                {this.renderEnterpriseBackRest()}
            </div>
        );
    }
    render() {
        let { defaultValue, placeholder, error, active } = this.props;
        let { id, id2 } = this.state;
        let wrapClass = classnames({'mcds-lookup__active': active});
        let inputClassName = classnames('mcds-layout__item', {hide: false});
        let showTab = this.state.showTab;

        let disableTab = this.state.disableTab;

        return (
            <div ref="searchList" className={wrapClass}>
                <DropDownTrigger
                    target="body"
                    synchWidth={true}
                    className="mcds-lookup"
                    ref="searchListTrigger"
                    placement="bottom-right"
                    closeOnOutsideClick={false}
                    onOpen={this.handleSearchListTriggerState.bind(this, true)}
                    onClose={this.handleSearchListTriggerState.bind(this, false)} >
                    <div ref="looup_div" tabIndex="0" id={id} className={classnames('mcds-layout__column mcds-p__t-4 mcds-p__l-4 mcds-p__r-4 mcds-p__b-4 mcds-lookup__row', {'mcds-element__border': error})}>
                        <Input
                            className={inputClassName}
                            autoComplete="off"
                            type="text"
                            defaultValue={defaultValue}
                            value={this.state.inputValue}
                            onChange={::this.handleInputOnChange}
                            iconRight={<span onClick={::this.handleRightIconClick} className={classnames(style['enterprise-info__title'], {[style['enterprise-info__title-enable']]: !disableTab}) }>工商信息</span>}
                            placeholder={placeholder}
                            // 单击时出现搜索下拉框
                            onClick={::this.handleInputOnClick}
                            // 处理搜索关键字
                            onKeyUp={::this.handleSearchKeydown} />
                    </div>
                    <DropDown className="mcds-lookup__list mcds-p__t-0" id={id2}>
                        { !showTab && this.renderSearchList()}
                        { showTab && this.renderTab() }
                    </DropDown>
                </DropDownTrigger>
            </div>
        );
    }
}

EnterpriseInfoBase.propTypes = {
    onKeyDown: PropTypes.func,
    onChange: PropTypes.func,
    schema: PropTypes.object,
    // 回款方法
    EnterpriseInfoBackReset: PropTypes.oneOfType([
        PropTypes.func, // 如果存在回填方法,传入funs
        PropTypes.object // 如果不存在回填,默认传入null
    ]),
    placeholder: PropTypes.string,
    className: PropTypes.string,
    data: PropTypes.array,
    // 初始化默认的值,只使用一次
    defaultValue: PropTypes.string,
    // 一直可以更新变化的值
    value: PropTypes.array,
    error: PropTypes.bool,
    active: PropTypes.bool
};

EnterpriseInfoBase.defaultProps = {
    onChange: ()=> {},
    defaultValue: '',
    placeholder: 'placeholder',
    backRest: null,
    onKeyDown: () => {}
};


