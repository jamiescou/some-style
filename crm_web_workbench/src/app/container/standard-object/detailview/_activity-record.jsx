import classnames from 'classnames';
import React, { Component } from 'react';

import {
    Button,
    Tab,
    TabItem,
    TabContent,
    Checkbox,
    AlternateGroup,
    AlternateRadio,
    Input,
    DatePicker,
    TextArea,
    InputSearch,
    Select
} from 'carbon';

export default class ActivityRecord extends Component {
    static propTypes = {
    };
    constructor(){
        super();
        this.state = {
            tabIndex: 'A',
            showAddRecord: false
        };
    }

    // 新建记录
    renderCreateRecord(){
        return (
            <TabContent className={classnames('mcds-content__scoped', {'mcds-tab__active': this.state.tabIndex === 'A'})}>
                <div className="mcds-layout__column" id="tab_AlternateGroup">
                    <AlternateGroup label="主题" className="mcds-layout__item">
                        <AlternateRadio id="1" name="radio">
                            电话
                        </AlternateRadio>
                        <AlternateRadio id="2" name="radio">
                            网络
                        </AlternateRadio>
                        <AlternateRadio id="3" name="radio">
                            其他
                        </AlternateRadio>
                    </AlternateGroup>
                    <div className="mcds-layout__column mcds-layout__bottom">
                        <Button
                            className={classnames('mcds-button__brand', {
                                hide: this.state.showAddRecord
                            })}
                            onClick={() => {
                                this.setState({showAddRecord: true});
                                let tabAlternateGroup  = document.getElementById('tab_AlternateGroup');
                                tabAlternateGroup.getElementsByTagName('input')[0].checked = true;
                            }}>
                                添加
                        </Button>
                    </div>
                </div>
                <div
                    className={classnames('animated', {
                        hide: !this.state.showAddRecord,
                        fadeIn: this.state.showAddRecord
                    })}>
                    <Input label="留言" className="mcds-m__t-20" id="Input" name="user" placeholder="Placeholder text" />
                    <div className="mcds-layout__column">
                        <div className="mcds-layout__item-6">
                            <Input label="从属对象" className="mcds-m__t-20 mcds-m__r-10" id="Input" name="user" placeholder="Placeholder text" />
                        </div>
                        <div className="mcds-layout__item-6">
                            <Input label="相关项" className="mcds-m__t-20 mcds-m__l-5" id="Input" name="user" placeholder="Placeholder text" />
                        </div>
                    </div>
                    <div className="mcds-layout__column">
                        <div className="mcds-layout__item-6 mcds-p__r-10">
                            <label className="mcds-layout__item-12 mcds-m__b-5 mcds-m__t-20">
                                完成时间
                            </label>
                            <div className="mcds-layout__item-6">
                                <DatePicker className="mcds-layout__item-12" onChanged={()=> {}} >
                                    <Input className="mcds-m__r-5" value="1992-12-12" iconRight={<span className="mcds-icon__time-line-20" />} name="user" placeholder="Placeholder text" />
                                </DatePicker>
                            </div>
                            <div className="mcds-layout__item-6">
                                <Input className="mcds-m__l-5" value="晚上 12:00" iconRight={<span className="mcds-icon__data-line-20" />} name="user" placeholder="Placeholder text" />
                            </div>
                        </div>
                        <div className="mcds-layout__item-6">
                            <Input label="位置" className="mcds-m__t-20 mcds-m__l-5" id="Input" name="user" placeholder="Placeholder text" />
                        </div>
                    </div>
                    <Button className="mcds-button__brand mcds-m__t-15">添加</Button>
                </div>
            </TabContent>
        );
    }
    // 新建事件
    renderEvent(){
        return (
            <TabContent className={classnames('mcds-content__scoped', {'mcds-tab__active': this.state.tabIndex === 'B'})}>
                <Input label="主题" name="input1" />
                <Checkbox id="checkbox1" label="私密事件" name="checkbox1" />
                <TextArea className="mcds-m__t-20" label="内容" name="textarea" />
                <div className="mcds-layout__column">
                    <div className="mcds-layout__item-6">
                        <div className="mcds-layout__item-6">
                            <InputSearch label="开始时间" name="startTime" search="right" iconClass="mcds-iocn__data-line-20" />
                        </div>
                        <div className="mcds-layout__item-6 mcds-p__l-20">
                            <InputSearch className="mcds-m__t-20" name="startTime1" search="right" iconClass="mcds-iocn__time-line-20" />
                        </div>
                    </div>
                    <div className="mcds-layout__item-6 mcds-p__l-20">
                        <div className="mcds-layout__item-6">
                            <InputSearch label="结束时间" name="startTime" search="right" iconClass="mcds-iocn__data-line-20" />
                        </div>
                        <div className="mcds-layout__item-6 mcds-p__l-20">
                            <InputSearch className="mcds-m__t-20" name="endTime1" search="right" iconClass="mcds-iocn__time-line-20" />
                        </div>
                    </div>
                </div>
                <div className="mcds-layout__column">
                    <Checkbox id="checkbox2" label="全天事件" name="checkbox2" />
                </div>
                <div className="mcds-layout__column mcds-m__t-20">
                    <div className="mcds-layout__item-6">
                        <Select label="提醒设置" value={123}>
                            <option value={123}>
                                提前30分钟提醒
                            </option>
                        </Select>
                    </div>
                    <div className="mcds-layout__item-6 mcds-p__l-20">
                        <Input label="新增参与人员" name="add" />
                    </div>
                </div>
                <div className="mcds-layout__column mcds-m__t-20">
                    <div className="mcds-layout__item-6">
                        <Input label="从属对象" name="setting" />
                    </div>
                    <div className="mcds-layout__item-6 mcds-p__l-20">
                        <Input label="相关项" name="add" />
                    </div>
                </div>
                <div className="mcds-layout__column mcds-m__t-20">
                    <Button className="mcds-button__brand">添加</Button>
                </div>
            </TabContent>
        );
    }

    render(){
        return (
            <Tab className="mcds-tab__scoped mcds-bg">
                <TabItem className={classnames({'mcds-scoped__active': this.state.tabIndex === 'A'})} onClick={() => { this.setState({tabIndex: 'A'}); }}>
                    新建记录
                </TabItem>
                <TabItem className={classnames({'mcds-scoped__active': this.state.tabIndex === 'B'})} onClick={() => { this.setState({tabIndex: 'B'}); }}>
                    新建事件
                </TabItem>
                {this.renderCreateRecord()}
                {this.renderEvent()}
            </Tab>
        );
    }
}

