import React, { Component } from 'react';
import classnames from 'classnames';

import BigCalendar from './big-calendar';
import MiniCalendar from './mini-calendar';

import 'styles/modules/calendar/calendar.scss';
import style from 'styles/modules/calendar/index.scss';

export default class Calendar extends Component {
    constructor(){
        super();
        this.state = {
            current: new Date()
        };
    }
    handleCurrentDate(v){
        this.setState({
            current: v
        });
    }
    render(){
        let { current } = this.state;
        // onChangeDate={::this.handleCurrentDate}

        return (
            <div className={classnames('mcds-layout__column', style.height)}>
                <div className="mcds-layout__item-9">
                    <BigCalendar
                        current={current} />
                </div>
                <div className="mcds-layout__item-1 mcds-layout__offset-2">
                    <MiniCalendar
                        onChangeDate={::this.handleCurrentDate}
                        current={current} />
                </div>
            </div>
        );
    }
}
