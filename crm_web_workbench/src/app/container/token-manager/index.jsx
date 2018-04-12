import React, { Component } from 'react';
import { getTokenList } from 'requests/token-manager/token';

export default class componentName extends Component {

    render() {
        window.abc = getTokenList;
        return (
            <div>
                123
            </div>
        );
    }
}
