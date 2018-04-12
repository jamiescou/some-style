/**
 * 高阶组件,处理schema中的字段依赖问题
 * 使用方法
 * import { BaseEditor, BuildFieldDependency } from 'xxxx'
 * constructor() {
 *  this.Editor = BuildFieldDependency(BaseEditor);
 * }
 * render() {
 *  let E = this.Editor;
 *  <E ...props />
 * }
 */

import _ from 'lodash';
import { isImmutable } from 'immutable';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

const DependTypes = ['picklist', 'combox', 'mpicklist'];

const DependFields = (ComposedComponent, config = {}) => {
    let fieldsConfig = isImmutable(config) ? config.toJS() : config;
    let AllFieldList = {};
    let Dependencyed_list = {};// 所有的依赖类型的字段集合

    let Needed_list = new Set();// 用来暂存,a 依赖 b, a 在 b前渲染, a 无法获取关联字段value的问题

    // console.log('fieldsConfig', fieldsConfig)
    /**
     * 同步其他组件的依赖的值
     * @param  {[type]} value [关联的值]
     * @param  {[type]} name  [当前关联的值的name]
     * @return {[type]}       [description]
     */
    function synchState(value, name) {
        if (!Dependencyed_list[name]) {
            return false;
        }
        const findWhichDepended = (list, fieldName) => {
            let targetName = [];
            _.map(list, (v, key) => {
                let { schema } = v;
                let options = schema.options;
                if (options.related === fieldName) {
                    targetName.push(key);
                }
            });
            return targetName;
        };
        let targetNameList = findWhichDepended(Dependencyed_list, name);
        _.map(targetNameList, v => {
            if (Dependencyed_list[v]) {
                Dependencyed_list[v].target.setDependValue(value);
            }
        });
    }

    /**
     * [tryToSynchState 尝试去同步其他编辑器的值]
     * @param  {[type]} value [当前正在渲染的组件的value]
     * @param  {[type]} name  [当前正在需渲染组件的name]
     * @return {[type]}       [无返回值,去同步GLobalList的值]
     */
    function tryToSynchState(value, name) {
        // 参数错误
        if (!name) {
            return false;
        }
        let schema = Dependencyed_list[name].schema;
        let { options } = schema;
        // schema解析错误
        if (!schema || !options) {
            return false;
        }
        let related = options.related;
        // A 的下拉依赖于 B,
        // B的实例已经在GlobalList中存在
        if (related && Dependencyed_list[related]) {
            let relatedValue = Dependencyed_list[related].target.getValue();
            Dependencyed_list[name].target.setDependValue(relatedValue);
            return true;
        }

        // B的实例在A之后渲染,这个时候list中没有B,只能在B渲染的时候,去轮询
        // 向 Needed_list 中推入字段名称
        if (related && !Dependencyed_list[related]) {
            Needed_list.add(related);
        }
        // 根据Needed_list遍历,去同步数据,同步后.删掉Needed_list中的值
        for (let k of Needed_list) {
            if (Dependencyed_list[k]) {
                let relatedValue = Dependencyed_list[k].target.getValue();
                synchState(relatedValue, k);
                // 字段同步后, 删除
                Needed_list.delete(k);
            }
        }
    }

    /**
     * 根据配置与企业查询得到的信息,回填配置中的其他字段
     * @param {*} 企业查询返回的字段 
     * @param {*} schema 
     */
    function EnterpriseInfoBackReset(value, schema) {
        let companyInfo = value;
        let { name } = schema;
        let { enterpriseFieldsDictonary } = fieldsConfig.fileds_extends;
        let dic = enterpriseFieldsDictonary[name];
        if (!companyInfo || !name || _.isEmpty(enterpriseFieldsDictonary) || !dic) {
            return null;
        }
        for (let v of dic) {
            let target;
            let fromValue = companyInfo[v.from];
            let to = v.to;
            if (AllFieldList[to] && AllFieldList[to].target) {
                target = AllFieldList[v.to].target;
                target.refs.editor.setValue(fromValue);
                target.setState({value: fromValue});
            }
        }
    }
    return (
        class Dependencyed extends Component {
            static propTypes = {
                schema: PropTypes.object.isRequired,
                value: PropTypes.oneOfType([
                    PropTypes.number,
                    PropTypes.string,
                    PropTypes.object
                ]),
                onChange: PropTypes.func
            };
            constructor(props){
                super(props);
                let { schema } = this.props;
                schema = this.transferValue(schema);

                let defaultValue = schema.default_value ? schema.default_value.value : null;
                this.state = {
                    dependValue: null,
                    value: this.transferValue(props.value ? props.value : defaultValue)
                };
                this.setDependValue = this.setDependValue.bind(this);
                this.getValue = this.getValue.bind(this);
                this.setValue = this.setValue.bind(this);
            }
            // 加载后,执行注册函数
            componentDidMount() {
                let { schema } = this.props;
                schema = this.transferValue(schema);
                if (DependTypes.indexOf(schema.type) !== -1) {
                    this.register();
                }
                AllFieldList[schema.name] = {
                    target: this,
                    schema: schema
                };

            }
            componentWillUnmount() {
                this.cancle();
            }
            transferValue(value) {
                let result;
                if (isImmutable(value)) {
                    result = value.toJS();
                } else {
                    result = value;
                }
                return result;
            }
            setDependValue(value) {
                this.setState({
                    dependValue: value
                });
            }
            getValue() {
                return this.state.value;
            }

            // list中注册
            register() {
                let { schema } = this.props;
                schema = this.transferValue(schema);
                let name = schema.name;
                if (!Dependencyed_list[name]) {
                    Dependencyed_list[name] = {
                        target: this,
                        schema
                    };
                    tryToSynchState(this.state.value, name);
                }
            }
            // 注销
            cancle() {
                let { schema } = this.props;
                schema = this.transferValue(schema);
                let name = schema.name;
                if (Dependencyed_list[name]) {
                    delete Dependencyed_list[name];
                }
            }
            setValue(value) {
                this.handleOnChange(value);
            }
            // onchange
            handleOnChange(param) {
                let { onChange = () => {}, schema } = this.props;
                schema = this.transferValue(schema);
                // value = this.transferValue(value);
                let name = schema.name;
                onChange(param);
                if (Dependencyed_list[name]) {
                    synchState(param, name);
                }
                // this.refs.editor.setValue(param);
                this.setState({value: param});
            }

            render() {
                let others = {};
                let { schema } = this.props;
                schema = this.transferValue(schema);
                // 同步依赖关系
                if (Dependencyed_list[schema.name]) {
                    others.relatedValue = this.state.dependValue;
                }
                // 企业查询同步
                let { fileds_extends = {} } = fieldsConfig;
                let { enterpriseFields } = fileds_extends;

                if (!_.isEmpty(fileds_extends) && enterpriseFields.indexOf(schema.name) !==-1) {
                    others.EnterpriseInfoBackReset = EnterpriseInfoBackReset;
                    schema.type = 'enterpriseinfo';
                }

                return <ComposedComponent { ...this.props } ref="editor" schema={schema} {...others} onChange={this.handleOnChange.bind(this)} />;
            }
        }
    );
};

export default DependFields;
