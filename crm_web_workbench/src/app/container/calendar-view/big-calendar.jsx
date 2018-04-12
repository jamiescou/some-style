import moment from 'moment';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { browserHistory } from 'react-router';

import BigCalendar from 'react-big-calendar';
BigCalendar.momentLocalizer(moment);

// myEventsList 这块的东西后端传过来的
let myEventsList = [
    {
        title: '啊啊啊啊',
        allDay: true,
        id: '1',
        start: new Date(2017, 7, 9),
        end: new Date(2017, 7, 10)
    },
    {
        title: '打野王者',
        id: '2',
        start: new Date(2017, 7, 7),
        end: new Date(2017, 7, 12)
    },
    {
        title: '稳住,我们能赢',
        id: '3',
        start: new Date(2017, 7, 9),
        end: new Date(2017, 7, 10)
    },
    {
        title: '猥琐发育,别浪',
        id: '4',
        start: new Date(2017, 7, 8),
        end: new Date(2017, 7, 10)
    },
    {
        title: '呵呵',
        id: '5',
        start: new Date(2017, 7, 9),
        end: new Date(2017, 7, 9)
    }
];
export default class BigCalendarView extends Component {
    constructor(){
        super();
        this.state = {};
    }

    gotoDetail(event){
        let { id } = event;
        console.log('eee', event);
        browserHistory.push({
            pathname: `/calendar/detail/${id}`
        });
    }
    handleDate(v){
        console.log('vvvvvvvv', v);
    }
    render(){
        let { current } = this.props;
        console.log('asda', new Date(current));
        console.log('current', current);
        return (
            <BigCalendar
                selectable
                defaultView={'month'}
                popup={true}
                events={myEventsList}
                scrollToTime={new Date(1970, 1, 1, 6)}
                onSelectEvent={::this.gotoDetail}
                onSelectSlot={(info) => { console.log(info); }}
                onNavigate={v => { console.log('vvvvvvvvvvvvvvvvv', v); }}
                date={new Date(Number(current))} />
        );
    }
}
BigCalendarView.propTypes = {
    current: PropTypes.string
};
