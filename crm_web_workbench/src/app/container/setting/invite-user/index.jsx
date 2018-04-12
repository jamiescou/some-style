import React, { Component } from 'react';
import { Input, Button, notify } from 'carbon';
import { test } from 'requests/common/logout';

import style from 'styles/modules/setting/setting.scss';

export default class Invite extends Component {
    static propTypes = {
    };
    constructor(){
        super();
        this.state = {
            phone: ''
        };
    }
    _invite() {
        let { phone } = this.state;
        test(phone).then(
            (res) => {
                console.log('res', res);
                notify.add(`邀请${phone}成功`);
            }, (err) => {
                notify.add({message: err.error || '邀请失败', theme: 'error'});
            }
        );
    }
    render() {
        return (
            <div className={style.content}>
                <Input onChange={(e)=>{ this.setState({phone: e}); }} />
                <Button className="mcds-button__brand" onClick={::this._invite}>
                    邀请
                </Button>
            </div>
        );
    }
}
