import React from 'react';
import PropTypes from 'prop-types';

import ErrorNotify from 'container/share/error/error-notify';

import style from 'styles/modules/vetting/modal/modal.scss';
import {
    ModalTrigger,
    Modal,
    ModalHeader,
    ModalBody
} from 'carbon';

const operatorObject = {
    STARTSWITH: {
        value: 'STARTSWITH',
        display_name: '起始字符'
    }, // 起始字符
    CONTAINS: {
        value: 'CONTAINS',
        display_name: '包含'
    }, // 包含
    NOTCONTAINS: {
        value: 'NOTCONTAINS',
        display_name: '不包含'
    }, // 不包含
    INRANGE: {
        value: 'INRANGE',
        display_name: '等于(范围)'
    }, // 等于(范围)
    EQUALS: {
        value: '==',
        display_name: '是'
    }, // 等于
    NOT_EQUAL: {
        value: '!=',
        display_name: '不是'
    }, // 不等于
    LESS_THAN: {
        value: '<',
        display_name: '小于'
    }, // 小于
    GREATER_THAN: {
        value: '>',
        display_name: '大于'
    }, // 大于
    LESS_OR_EQUAL: {
        value: '<=',
        display_name: '小于等于'
    }, // 小于等于
    GREATER_OR_EQUAL: {
        value: '>=',
        display_name: '大于等于'
    } // 大于等于
};
export default class ModalCondition extends React.Component {
    static propTypes = {
        // 触发区域
        trigger: PropTypes.element.isRequired,
        // 数据
        record: PropTypes.object,
        user: PropTypes.object,
        schema: PropTypes.object,
        fetchOneRequest: PropTypes.func,
        fetchOneGroup: PropTypes.func,
        fetchOneRole: PropTypes.func
    };
    constructor(props) {
        super(props);
        this.state = {
            userRecord: {
                type: null,
                name: null
            }
        };
    }
    componentWillMount() {
    	let {user, fetchOneRequest, fetchOneGroup, fetchOneRole} = this.props;
        let obj = user ? user.get('CdType') : '';
        let TargetId = user ? user.get('TargetId') : '';
        if (obj === 'User') {
            fetchOneRequest(obj, TargetId).then(
                (res)=>{
                    let name = res.body.Title;
                    let userRecord = {
                        type: obj,
                        name
                    };
                    this.setState({
                        userRecord
                    });
                }, (err) => {
                    ErrorNotify(err);
                }
            );
        } else if (obj === 'Group') {
            fetchOneGroup(TargetId).then(
                (res)=>{
                    let name = res.body.GroupName;
                    let userRecord = {
                        type: obj,
                        name
                    };
                    this.setState({
                        userRecord
                    });
                }, (err) => {
                    ErrorNotify(err);
                }
            );
        } else if (obj === 'Role') {
            fetchOneRole(TargetId).then(
                (res)=>{
                    let name = res.result.role_name;
                    let userRecord = {
                        type: obj,
                        name
                    };
                    this.setState({
                        userRecord
                    });
                }, (err) => {
                    ErrorNotify(err);
                }
            );
        }

    }
    getTextOperator(operator){
        let operatorText = '';
        for (let key in operatorObject) {
            if (operatorObject[key].value === operator) {
                operatorText = operatorObject[key].display_name;
            }
        }
        return operatorText;
    }
    getFieldData(fieldName){
        let { schema } = this.props;
        let name = '';
        let fieldArr = fieldName.split('.');
        if ( fieldArr[0] === 'Price' && fieldArr[1] === 'symbol') {
            name = '套餐价格单位';
        } else {
            name = schema.getIn([fieldArr[0], 'display_name']);
        }
        return name;
    }
    renderRecordList() {
    	let { record } = this.props;
        let list = record.get('Exps').toArray();
        return list.map((d, i)=>{
            let data = d.get('Stmt');
            // 去掉首尾引号
            let value = data.get('StmtDesc') ? data.get('StmtDesc') : null;
            return (
                <li key={i}>
                    <span className="mcds-m__r-5" />
                    {value}
                </li>);
    	});
    }
    renderUserRecord() {
        let { name } = this.state.userRecord;
        if (name) {
            return (
                <div className={style['condition-block']}>
                    <span>发起人条件</span>
                    <ul>
                        <li>发起人<i className="mcds-m__r-5" />属于<i className="mcds-m__r-5" />{name}</li>
                    </ul>
                </div>
            );
        }
    }
    render() {
    	let {trigger, record } = this.props;
        return (
            <ModalTrigger>
                {trigger}
                <Modal className="mcds-modal__w-520 mcds-modal__auto">
                    <ModalHeader>
                        <i className="mcds-modal__close mcds-icon__close-line-20 close" />
                        <p className="mcds-modal__title">
				        	检验条件
				      	</p>
                    </ModalHeader>
                    <ModalBody>
                        {this.renderUserRecord()}
                        <div className={style['condition-block']}>
                            <span>记录条件</span>
                            <ul className={style.listyle}>
                                {this.renderRecordList()}
                            </ul>
                        </div>
                        <p className={style.formula}> * 条件逻辑 {record.get('Formula')} </p>
                    </ModalBody>
                </Modal>
            </ModalTrigger>
        );
    }
}
