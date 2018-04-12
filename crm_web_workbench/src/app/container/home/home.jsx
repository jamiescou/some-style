import React, { Component } from 'react';
import HomeEntry from '../share/main';
export default class Home extends Component {
    static propTypes = {
    };
    constructor() {
        super();
    }
    render() {
        // 上线了,请不要在这里乱放一些没用的组件了。拜托各位哥了
        // ok
        return (
            <div>
                <HomeEntry />
            </div>
        );
    }
}
