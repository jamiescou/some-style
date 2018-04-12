import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import _ from 'lodash';

import { fetchDataRequest } from 'requests/common/standard-object';
import { default_avatar } from '../../../utils/user-setting.js';

import style from 'styles/modules/vetting/approval.scss';

import {
    ModalTrigger,
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFoot,
    Lookup
} from 'carbon';

export default class AddMember extends React.Component {
    static propTypes = {
        addMemberCallback: PropTypes.func,
        index: PropTypes.number,
        pointId: PropTypes.number,
        title: PropTypes.string,
        content: PropTypes.string,
        data: PropTypes.array,
        outIds: PropTypes.array,
        groupId: PropTypes.number
    };

    constructor(props){
        super(props);
        this.state = {
            data: props.data,
            allData: props.data
        };
    }
    componentWillMount() {
        let data = this.state.allData.slice();
        let outIds = this.props.outIds;
        data = this.filterData(data, outIds);
        this.setState({
            data
        });
    }

    componentWillReceiveProps(nextProps) {
        let data = this.state.allData.slice();
        data = this.filterData(data, nextProps.outIds);
        this.setState({
            data
        });
    }
    request(name) {
        let objName = 'User';
        let param = this.buildParam(name || false);
        fetchDataRequest(objName, param)().then((res) => {
            let allData = this.formatUsers(res.body.objects);
            let data = this.filterData(allData.slice(), this.props.outIds);
            this.setState({
                data,
                allData
            });
        });
    }

    formatUsers(users) {
        if (!users) {
            return;
        }
        let result = [];
        users.forEach((user) => {
            if (user.name) {
                result.push({
                    id: user.id,
                    name: user.name,
                    avatar: user.Avatar ? user.Avatar : {default_avatar}
                });
            }
        });
        return result.splice(0, 8);
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

    filterData(data, outIds) {
        // let data  = this.state.allData.slice();
        if (outIds) {
            outIds.forEach((id) => {
                this.deleteData(data, id);
            });
        }
        return data;
    }

    deleteData(data, outId) {
        if (outId) {
            data.forEach((item, index) => {
                if (item.id === outId) {
                    data.splice(index, 1);
                }
            });
        }
    }

    onKeyDown(info) {
        // this.setState({data: newDate});
        let Name = info.value;
        this.request(Name);
    }

    closeModal() {
        if (this.refs.handleClose && this.refs.handleClose.click) {
            this.refs.handleClose.click();
        }
    }

    handleAddMemberClick() {
        // this.closeModal();
        let value = _.assign(this.state.value, {
            index: this.props.index,
            pointId: this.props.pointId,
            groupId: this.props.groupId
        });
        if (value.id && this.props.addMemberCallback) {
            this.props.addMemberCallback(value);
        }
    }

    handleOnChange(value) {
        let userObj = Object.values(value.objectStack)[0];
        this.setState({
            value: userObj
        });
    }

    render() {
        return (
            <div className={style['approval-inline-block']}>
                <ModalTrigger>
                    <div className={classnames('mcds-m__r-10', style['approval-point__add-icon'])}>
                        <span className="mcds-icon mcds-icon__add-line-20 mcds-text__size-12" />
                    </div>

                    <Modal className="mcds-modal__w-520 mcds-modal__auto">
                        <ModalHeader>
                            <i className="mcds-modal__close mcds-icon__close-line-20 close" />
                            <p className="mcds-modal__title">
                                {this.props.title}
                            </p>
                        </ModalHeader>

                        <ModalBody>
                            <p className="mcds-text__weak mcds-text__size-12">{this.props.content}</p>
                            <Lookup
                                ref="lookupMemeber"
                                error={false}
                                placeholder="搜索人员"
                                onChange={::this.handleOnChange}
                                onKeyDown={::this.onKeyDown}
                                data={this.state.data} />
                        </ModalBody>

                        <ModalFoot>
                            <span ref="handleClose" className="close" />
                            <div className="mcds-layout__column mcds-layout__right">
                                <span ref="handleClose" className="close" />
                                <Button className="mcds-button__neutral mcds-btn__right close">
                                    取消
                                </Button>
                                <Button className="mcds-button__brand close" onClick={::this.handleAddMemberClick}>
                                    添加
                                </Button>
                            </div>
                        </ModalFoot>
                    </Modal>
                </ModalTrigger>
            </div>
        );
    }
}
