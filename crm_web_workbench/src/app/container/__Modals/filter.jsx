import React, { Component } from 'react';

import {
    Select
} from 'carbon';

export default class Filter extends Component {
    render() {
        return (
            <div className="mcds-m__t-20 mcds-m__l-20 mcds-filter">
                <div className="mcds-layout__column mcds-filter__title">
                    <p className="mcds-m__l-20 mcds-text__size-16">新建视图</p>
                    <i className="mcds-icon__close-line-20 mcds-filter__icon mcds-text__size-20" />
                </div>
                <div className="mcds-filter__body">
                    <div>
                        <span className="mcds-text__size-14">筛选条件</span>
                        <div className="mcds-layout__column">
                            <div className="mcds-layout__item-12">
                                <p className="mcds-text__weak mcds-text__size-12 mcds-m__t-10 mcds-m__b-10">显示这些数据</p>
                            </div>
                            <div className="mcds-filter__field">
                                <div className="mcds-p__l-12 mcds-p__t-13">
                                    <p className="mcds-text__weak mcds-text__size-12">显示</p>
                                    <p className="mcds-text__size-13">所有线索</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mcds-m__t-19">
                        <p className="mcds-text__weak mcds-text__size-12 mcds-m__t-10 mcds-m__b-10">匹配这些筛选条件</p>
                        <div className="mcds-layout__column">
                            <div className="mcds-filter__field">
                                <div className="mcds-p__l-12 mcds-p__t-13 mcds-p__r-15">
                                    <i className="mcds-icon__close-line-20 mcds-filter__icon mcds-text__size-14" />
                                    <div className="mcds-layout__column mcds-m__t-20">
                                        <div className="mcds-layout__item-12">
                                            <Select label="字段" value={123}>
                                                <option value={123}>
                                                    A
                                                </option>
                                            </Select>
                                            <Select className="mcds-m__t-10" label="字段" value={0}>
                                                <option value={0}>
                                                    B
                                                </option>
                                            </Select>
                                            <Select className="mcds-m__t-10" label="字段" value={1}>
                                                <option value={1}>
                                                    C
                                                </option>
                                            </Select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mcds-m__t-10">
                        <div className="mcds-layout__column">
                            <div className="mcds-filter__field">
                                <div className="mcds-p__l-12 mcds-p__t-9 mcds-p__t-13">
                                    <i className="mcds-icon__close-line-20 mcds-filter__icon mcds-text__size-14" />
                                    <p className="mcds-text__weak mcds-text__size-12">最终报价时间</p>
                                    <p className="mcds-text__size-13">未来 90 日</p>
                                    <p className="mcds-text__size-13">(一月 16,2017 - 四月 15,2017)</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mcds-m__t-19">
                        <p className="mcds-text__weak mcds-text__size-12 mcds-m__t-10 mcds-m__b-10">固定筛选条件</p>
                        <div className="mcds-layout__column">
                            <div className="mcds-filter__field">
                                <div className="mcds-p__l-12 mcds-p__t-9 mcds-p__t-13">
                                    <i className="mcds-icon__close-line-20 mcds-filter__icon mcds-text__size-14" />
                                    <p className="mcds-text__weak mcds-text__size-12">姓名</p>
                                    <p className="mcds-text__size-13">等于 "王富贵"</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mcds-m__t-19">
                        <div className="mcds-layout__column">
                            <div className="mcds-layout__item-6 mcds-layout__column mcds-layout__left">
                                <a className="mcds-text__size-13" href="javascript:;">增加筛选条件</a>
                            </div>
                            <div className="mcds-layout__item-6 mcds-layout__column mcds-layout__right">
                                <a className="mcds-text__size-13" href="javascript:;">全部清除</a>
                            </div>
                        </div>
                    </div>
                    <div className="mcds-m__t-30">
                        <p className="mcds-text__size-14">筛选逻辑</p>
                        <a className="mcds-filter__inline-block mcds-text__size-13 mcds-p__t-10" href="javascript:;">增加筛选逻辑</a>
                    </div>
                </div>
                <div className="mcds-filter__divider" />
                <div className="mcds-m__t-7 mcds-m__l-15 mcds-p__b-30">
                    <div className="mcds-text__weak">
                        <i className="mcds-text__size-20 mcds-icon__add-line-20 mcds-filter__vertical-sub" />
                        <span className="mcds-text__size-12 mcds-m__l-10">保存为视图</span>
                    </div>
                </div>
            </div>
        );
    }
}
