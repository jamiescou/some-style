import React, { Component } from 'react';
import {
    DropDownTrigger,
    DropDown,
    Button,
    Checkbox,
    Radio
} from 'carbon';

export default class Choose extends Component {
    render() {
        return (
            <DropDownTrigger className="mcds-m__l-20">
                <Button className="mcds-button__neutral">
                    下拉
                </Button>
                <DropDown>
                    <div className="mcds-layout__column">
                        <div className="mcds-layout__item-6">
                            <span className="mcds-p__l-20 mcds-text__weak">活动</span>
                            <ul className="mcds-p__l-20">
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
                            <ul>
                                <li><Radio id="label" label="默认(全部)" name="name" /></li>
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
                                保存
                            </Button>
                        </div>
                    </div>
                </DropDown>
            </DropDownTrigger>
        );
    }
}
