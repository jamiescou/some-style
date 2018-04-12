import React from 'react';

import Clock from './components/home-clock';
import Block from './components/home-block';

export default class Entry extends React.Component {
    render() {
        return (
            <div className="mcds-layout mcds-layout__column mcds-layout__center" style={{paddingTop: '169px'}}>
                <Clock />
                <Block text="通讯录" icon="mcds-icon__table-view-solid-20" url="/contacts/User" />
            </div>
        );
    }
}
