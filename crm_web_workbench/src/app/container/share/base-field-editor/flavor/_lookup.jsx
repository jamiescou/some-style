import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Lookup } from 'carbon';

import { default_avatar } from 'utils/user-setting';
import { fetchDataRequest, fetchOneRequest } from 'requests/common/standard-object';

const emptyElement = (
    <div className="demo mcds-layout__row mcds-layout__middle mcds-layout__center" style={{minHeight: '100px'}}>
        <div className="mcds-layout__item-8 mcds-text__center" style={{marginTop: '-50px'}}>
            <p className="">当前可选项目为空,请重新输入查找</p>
        </div>
    </div>
);
export default class lookup extends Component {
    static propTypes = {
        error: PropTypes.bool,
        opts: PropTypes.object,
        value: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.object
        ]),
        onChange: PropTypes.func,
        schema: PropTypes.object,
        objName: PropTypes.string,
        placeholder: PropTypes.string,
        fetchDataRequest: PropTypes.func
    };

    constructor(props){
        super(props);
        this.state = {
            data: [],
            loading: ~~props.value,
            defaultValue: {}
        };
        this.getValue = this.getValue.bind(this);
        this.buildParam = this.buildParam.bind(this);
    }

    componentWillMount() {
        let { value, objName } = this.props;
        if (value) {
            fetchOneRequest(objName, value)().then(res => {
                let { body } = res;
                this.setState({
                    loading: false,
                    defaultValue: body
                });
            });
        }
    }
    componentDidMount() {
        this.request();
    }

    request(name) {
        let { objName } = this.props;
        let param = this.buildParam(name || false);
        fetchDataRequest(objName, param)().then((res) => {
            this.setState({
                data: this.buildData(res.body.objects)
            });
        });
    }
    // 如果传入的props.value 是 String.
    _getDefaultValueString(objName, id) {
        let result;

        if (!id) {
            return [];
        }
        let defaultValue = this.state.defaultValue;

        result = defaultValue;
        if (result) {
            if (result.Avatar) {
                result.avatar = result.Avatar;
            } else if (objName === 'User') {
                result.avatar = default_avatar;
            }
            return [result];
        }

        return [];
    }

    getDefaultValue() {
        let { objName, value } = this.props;

        let defaultValue = [];

        // 初始化的时候调用
        if (_.isString(value)) {
            defaultValue = this._getDefaultValueString(objName, value);
        }

        if (_.isObject(value) && value.result) {
            let id = value.result[0];
            let target = value.objectStack[id];
            defaultValue = [
                target
            ];
        }

        return defaultValue;
    }
    buildData(objects) {
        let { objName } = this.props;
        let list = objects;
        let data = [];
        _.map(list, v => {
            let tmp = v;
            if (tmp.Avatar) {
                tmp.avatar = tmp.Avatar;
            } else if (objName === 'User') {
                tmp.avatar = default_avatar;
            }
            data.push(tmp);
        });
        return data;
    }
    buildParam(name) {
        let param = {order_by: 'updated_at', order_flag: 'DESC', limit: 5, offset: 0};

        if (name) {
            param.view_filter = `{
                "filter_from": "all",
                "filter": {
                    "expressions": [
                        {
                            "field":"name",
                            "operator":"CONTAINS",
                            "operands": ["'${name}'"]
                        }
                    ],
                "logical_relation": "1"
                }
            }`;
        }
        return param;
    }
    onKeyDown(info) {
        let Name = info.value;
        this.request(Name);
    }

    getValue() {
        let { data } = this.state;
        let newData = [];
        data.forEach(obj => {
            newData.push({
                name: obj.name,
                id: obj.id
            });
        });
        return newData;
    }
    // array: {objName, objectStack, result}
    handleOnChange(array) {
        this.props.onChange(array);
    }

    render() {
        let { objName, placeholder, error = false } = this.props;
        let { loading } = this.state;

        if (loading) {
            return <div>loading</div>;
        }

        let defaultValue = this.getDefaultValue();
        return (
            <Lookup
                error={error}
                type="single"
                objName={objName}
                value={defaultValue}
                empty={emptyElement}
                data={this.state.data}
                placeholder={placeholder}
                onKeyDown={this.onKeyDown.bind(this)}
                onChange={this.handleOnChange.bind(this)} />
        );
    }
}

lookup.defaultProps = {
    onChange: ()=> {}
};

