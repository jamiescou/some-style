import React, { Component } from 'react';

import {
    Button,
    DropDown,
    DropDownList,
    DropDownItem,
    DropDownTrigger,
    ButtonSmallIcon,
    Radio,
    Checkbox,
    ButtonIcon
} from 'carbon';

import style from 'styles/modules/standard-object/index.scss';

export default class ActivityLine extends Component{
    constructor(){
        super();
        this.state = {};
    }

    // 筛选时间线的条件
    renderFilterCondition(){
        return (
            <div className="mcds-layout__item-6 mcds-layout__left">
                <DropDownTrigger>
                    <Button className="mcds-text__base">筛选时间线 <i className="mcds-icon__triangle-solid-14" /></Button>
                    <DropDown className="mcds-timeline__actions-dropdown">
                        <div className="mcds-p__t-10">
                            <div className="mcds-layout__column mcds-p__b-20">
                                <div className="mcds-layout__item-6">
                                    <span className="mcds-p__l-20 mcds-text__weak">活动</span>
                                    <ul className="mcds-p__l-20 mcds-text__line-26">
                                        <li><Checkbox id="checkbox1" label="所有活动" name="checkbox1" /></li>
                                        <li><Checkbox id="checkbox2" label="事件" name="checkbox2" /></li>
                                        <li><Checkbox id="checkbox3" label="跟进记录" name="checkbox3" />
                                            <ul className="mcds-p__l-20">
                                                <li><Checkbox id="checkbox31" label="电话" name="checkbox31" /></li>
                                                <li><Checkbox id="checkbox32" label="邮件" name="checkbox32" /></li>
                                                <li><Checkbox id="checkbox33" label="拜访" name="checkbox33" /></li>
                                                <li><Checkbox id="checkbox34" label="其他" name="checkbox34" /></li>
                                            </ul>
                                        </li>
                                        <li><Checkbox id="checkbox4" label="系统活动" name="checkbox1" /></li>
                                    </ul>
                                </div>
                                <div className="mcds-layout__item-6 mcds-p__l-20">
                                    <span className="mcds-text__weak">日期范围</span>
                                    <ul className="mcds-text__line-26">
                                        <li>
                                            <Radio id="label" label="默认(全部)" name="name" />
                                        </li>
                                        <li><Radio id="label1" label="过去 7 天" name="name" /></li>
                                        <li><Radio id="label2" label="未来 7 天" name="name" /></li>
                                        <li><Radio id="label3" label="过去 30 天" name="name" /></li>
                                    </ul>
                                </div>
                            </div>
                            <div className="rearline">
                                <div className="mcds-layout__column mcds-layout__right mcds-p__t-12 mcds-p__r-20">
                                    <Button className="mcds-button__neutral mcds-btn__right close">
                                        取消
                                    </Button>
                                    <Button className="mcds-button__brand close">
                                        应用
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </DropDown>
                </DropDownTrigger>
            </div>
        );
    }

    // 过往活动
    renderPassByActivity(){
        return (
            <div>
                <div className="mcds-p__l-20 mcds-p__t-10 mcds-grid">
                    <span className="mcds-text mcds-text__size-14">过去活动</span>
                </div>
                <ul>
                    <li className="mcds-timeline__list-item">
                        <div className="mcds-media mcds-timeline">
                            <div className="mcds-media__body">
                                <div className="mcds-media mcds-timeline__media mcds-timeline__media-call">
                                    <div className="mcds-media__figure mcds-timeline__icon">
                                        <div className="mcds-icon__container mcds-icon__container-24">
                                            <span className="mcds-icon__telephone-solid-24 mcds-timeline__icon-inside" />
                                        </div>
                                    </div>
                                    <div className="mcds-media__body mcds-timeline__content">
                                        <h3 className="mcds-truncate" title="Mobile conversation on Monday">
                                            <ul className="mcds-list__horizontal mcds-text__line-22">
                                                <li className="mcds-list__item">
                                                    <span className="mcds-text__link">电话</span>
                                                </li>
                                                <li className="mcds-list__item mcds-text__weak mcds-m__l-20">
                                                    创建人
                                                </li>
                                                <li className="mcds-list__item mcds-m__l-10">
                                                    <span className="mcds-text__link">丁鹏</span>
                                                </li>
                                            </ul>
                                        </h3>
                                        <p className="mcds-text mcds-text__size-12" title="Lei seemed interested in closing this deal quickly! Let’s move.">
                                            顾客电话咨询了双眼皮和祛斑的项目。
                                        </p>
                                        <p className="mcds-text mcds-text__size-12" title="Lei seemed interested in closing this deal quickly! Let’s move.">
                                            顾客想做一个双眼皮，我推荐了韩式项目，报价12888，对方觉得比较贵，没想好。顾客还想祛脖子上的一个癍，想夏天之前做了。我推荐了祛雀斑的项目，388，对方觉得还可以，预约19日上门
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="mcds-media__figure mcds-media__figure--reverse">
                                <div className="mcds-timeline__actions">
                                    <span className="mcds-text__size-12 mcds-m__b-6">
                                        3月13日  下午2:02:42
                                    </span>
                                    <DropDownTrigger>
                                        <ButtonSmallIcon icon="mcds-icon__triangle-solid-14" />
                                        <DropDown className="mcds-timeline__actions-dropdown mcds-dropdown__min-no">
                                            <DropDownList>
                                                <DropDownItem>
                                                    编辑
                                                </DropDownItem>
                                                <DropDownItem>
                                                    删除
                                                </DropDownItem>
                                            </DropDownList>
                                        </DropDown>
                                    </DropDownTrigger>
                                </div>
                            </div>
                        </div>
                    </li>
                    <li className="mcds-timeline__list-item">
                        <div className="mcds-media mcds-timeline">
                            <div className="mcds-media__body">
                                <div className="mcds-media mcds-timeline__media mcds-timeline__media-call">
                                    <div className="mcds-media__figure mcds-timeline__icon">
                                        <div className="mcds-icon__container mcds-icon__container-24">
                                            <span className="mcds-icon__mail-solid-24 mcds-timeline__icon-inside" />
                                        </div>
                                    </div>
                                    <div className="mcds-media__body mcds-timeline__content">
                                        <h3 className="mcds-truncate" title="Mobile conversation on Monday">
                                            <ul className="mcds-list__horizontal mcds-text__line-22">
                                                <li className="mcds-list__item">
                                                    <span className="mcds-text__link">电话</span>
                                                </li>
                                                <li className="mcds-list__item mcds-text__weak mcds-m__l-20">
                                                    创建人
                                                </li>
                                                <li className="mcds-list__item mcds-m__l-10">
                                                    <span className="mcds-text__link">丁鹏</span>
                                                </li>
                                            </ul>
                                        </h3>
                                        <p className="mcds-truncate mcds-text mcds-text__size-12" title="Lei seemed interested in closing this deal quickly! Let’s move.">
                                            顾客来电。
                                        </p>
                                        <p className="mcds-text mcds-text__size-12" title="Lei seemed interested in closing this deal quickly! Let’s move.">
                                            主要问了我们目前提供什么项目，医院资质，还问了一些地址的问题。问对方咨询项目，对方没有说。
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="mcds-media__figure mcds-media__figure--reverse">
                                <div className="mcds-timeline__actions">
                                    <span className="mcds-text__size-12 mcds-m__b-6">
                                        3月13日  下午2:02:42
                                    </span>
                                    <DropDownTrigger>
                                        <ButtonSmallIcon icon="mcds-icon__triangle-solid-14" />
                                        <DropDown className="mcds-timeline__actions-dropdown mcds-dropdown__min-no">
                                            <DropDownList>
                                                <DropDownItem>
                                                    编辑
                                                </DropDownItem>
                                                <DropDownItem>
                                                    删除
                                                </DropDownItem>
                                            </DropDownList>
                                        </DropDown>
                                    </DropDownTrigger>
                                </div>
                            </div>
                        </div>
                    </li>
                </ul>
                <div className={style['active-line']}>
                    <Button className={`mcds-button__neutral ${style['active-line__button']}`}>更多过去活动</Button>
                </div>
            </div>
        );
    }

    // 后续的步骤
    renderAfterStep(){
        return (
            <div>
                <div className="mcds-p__l-20 mcds-p__r-40 mcds-p__t-10 mcds-grid">
                    <div className={style['active-line']}>
                        <span className={`${style['active-title']} mcds-text mcds-text__size-14`}>后续步骤</span>
                        <div className={style['active-funs']}>
                            <Button className="mcds-button__neutral">更多步骤</Button>
                        </div>
                    </div>
                </div>
                <ul>
                    <li className="mcds-timeline__list-item">
                        <div className="mcds-media mcds-timeline">
                            <div className="mcds-media__body">
                                <div className="mcds-media mcds-timeline__media mcds-timeline__media-email">
                                    <div className="mcds-media__figure mcds-timeline__icon">
                                        <div className="mcds-icon__container mcds-icon__container-24">
                                            <span className="mcds-icon__event-solid-24 mcds-timeline__icon-inside" />
                                        </div>
                                    </div>
                                    <div className="mcds-media__body mcds-timeline__content">
                                        <h3 className="mcds-truncate" title="Mobile conversation on Monday">
                                            <ul className="mcds-list__horizontal mcds-text__line-22">
                                                <li className="mcds-list__item">
                                                    <span className="mcds-text__link">回访</span>
                                                </li>
                                                <li className="mcds-list__item mcds-text__weak mcds-m__l-20">
                                                    创建人
                                                </li>
                                                <li className="mcds-list__item mcds-m__l-10">
                                                    <span className="mcds-text__link">丁鹏</span>
                                                </li>
                                            </ul>
                                        </h3>
                                        <p className="mcds-truncate mcds-text mcds-text__size-12" title="Lei seemed interested in closing this deal quickly! Let’s move.">
                                            今天给顾客打个电话确认19日预约。
                                        </p>
                                        <ul className="mcds-list__horizontal">
                                            <li className="mcds-list__item">
                                                <span className="mcds-timeline__text-title mcds-text__size-12 mcds-m__b-6">
                                                    开始
                                                </span>
                                                <span className="mcds-timeline__text-body mcds-text__base mcds-text__size-12 mcds-m__l-5">
                                                    3月18日  上午9:00:00—上午10:00:00
                                                </span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div className="mcds-media__figure mcds-media__figure--reverse">
                                <div className="mcds-timeline__actions">
                                    <span className="mcds-text__size-12 mcds-m__b-6">
                                        3月13日  下午2:02:42
                                    </span>
                                    <DropDownTrigger>
                                        <ButtonSmallIcon icon="mcds-icon__triangle-solid-14" />
                                        <DropDown className="mcds-timeline__actions-dropdown mcds-dropdown__min-no">
                                            <DropDownList>
                                                <DropDownItem>
                                                    编辑
                                                </DropDownItem>
                                                <DropDownItem>
                                                    删除
                                                </DropDownItem>
                                            </DropDownList>
                                        </DropDown>
                                    </DropDownTrigger>
                                </div>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
        );
    }
    render(){
        return (
            <div className="mcds-timeline__list mcds-p__t-20">
                <div>
                    <div className="mcds-layout__column">
                        {this.renderFilterCondition()}
                        <div className="mcds-layout__column mcds-layout__right mcds-layout__middle mcds-p__r-20">
                            <ButtonIcon className="mcds-button-icon__more" icon="mcds-icon__reload-solid-14" />
                        </div>
                    </div>
                </div>
                {this.renderAfterStep()}
                {this.renderPassByActivity()}
            </div>
        );
    }
}

