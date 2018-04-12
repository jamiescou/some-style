import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import { fetchDataRequest } from 'requests/common/enterprise-info';
import EnterpriseInfoBase from './_enterpriseinfo';

// let style = require('styles/modules/standard-object/enterprise-info.scss');


export default class EnterpriseInfo extends Component {
    static propTypes = {
        placeholder: PropTypes.string,
        schema: PropTypes.object,
        value: PropTypes.string,
        onChange: PropTypes.func,
        EnterpriseInfoBackReset: PropTypes.oneOfType([
            PropTypes.func, // 如果存在回填方法,传入funs
            PropTypes.object // 如果不存在回填,默认传入null
        ]),
        error: PropTypes.bool,
        active: PropTypes.bool
    }

    static defaultProps = {
        onChange: ()=> {}
    }

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            // 标记是否发送搜索请求
            canRequest: true
        };
    }

    componentDidMount() {
        let { value } = this.props;
        // 初始化
        let init = this.refs.lookupMemeber.init;
        this.request(value, init);
    }

    // 通过关键字查询数据
    request(keyword, cb = () => {}) {
        // 每次发送请求时，将是否能发送请求标志设为true
        this.setState({
            canRequest: true
        });

        fetchDataRequest(keyword)().then((res) => {
            let data = this.formatUsers(res.body.items);
            this.setState({
                data
            }, cb(data));
        }, () => {
            // console.log(err);
        });
    }

    // 对查询到的信息格式化
    formatUsers(users) {
        if (!users) {
            return;
        }
        let result = [];
        users.forEach((user) => {
            let newObj = _.assign({id: user.credit_code}, user);
            result.push(newObj);
        });
        return result;
    }

    // 键盘输入时触发事件
    onKeyDown(keyword) {
        // 用户输入关键词后延迟2秒调用一次查询
        if (this.state.canRequest) {
            setTimeout(() => this.request(keyword), 100);
            this.setState({
                canRequest: false
            });
        }
    }

    // id为搜索下拉框里用户选择项的id
    handleOnChange(id) {
        this.props.onChange(id);
        // TODO: 获取到用户的id后需要通过id取到用户的信息，并将信息展示在工商信息Tab面板里

    }

    buildField() {

        let { placeholder, schema, value, error = false, active, EnterpriseInfoBackReset } = this.props;
        return (
            <EnterpriseInfoBase
                schema={schema}
                error={error}
                active={active}
                placeholder={placeholder}
                defaultValue={value}
                EnterpriseInfoBackReset={EnterpriseInfoBackReset}
                ref="lookupMemeber"
                // 用户选择搜索下拉列表里的一项时触发事件
                onChange={::this.handleOnChange}
                // 用户在输入框输入时触发
                onKeyDown={::this.onKeyDown}
                data={this.state.data} />
        );
    }

    render() {
        return this.buildField();
    }
}
