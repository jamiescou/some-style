import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { InputSearch } from 'carbon';
import { browserHistory } from 'react-router';
import { trim }  from '../../utils/dom';
export default class BaseSearch extends Component {
    static propTypes = {
        me: PropTypes.string,
        data: PropTypes.object,
        sObjects: PropTypes.object,
        fetchUserData: PropTypes.func,
        clearCheckedAll: PropTypes.func
    };
    constructor(props){
        super(props);
        this.state = {
            keyword: ''
        };
    }
    shouldComponentUpdate(nextProps, nextState) {
        let oldKeyword = this.state.keyword;
        let newKeyword = nextState.keyword;
        if (oldKeyword === newKeyword){
            return false;
        }
        return true;
    }
    searchKeyDown(e){
        let { keyword } = this.state;
        if (e.keyCode === 13 && keyword !== ''){
            browserHistory.push({pathname: '/search', query: {keyword}});
        }
    }
    searchIconClick(){
        let { keyword } = this.state;
        if (keyword !== ''){
            browserHistory.push({pathname: '/search', query: {keyword}});
        }
    }
    searchOnchange(v){
        this.setState({
            keyword: trim(v)
        });
    }
    render (){
        return (
            <InputSearch
                onClickCallback={() => this.searchIconClick()}
                onKeyDown={(e)=> this.searchKeyDown(e)}
                placeholder="搜索"
                search="right"
                value={this.state.keyword}
                searchCallback={(v) => this.searchOnchange(v) } />
        );
    }
}
