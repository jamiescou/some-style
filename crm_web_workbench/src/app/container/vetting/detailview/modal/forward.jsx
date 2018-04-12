import {connect} from 'react-redux';
import React, { Component } from 'react';
import {bindActionCreators} from 'redux';
import ErrorNotify from 'container/share/error/error-notify';
import PropTypes from 'prop-types';

import { fetchComment } from 'redux/reducers/vetting/detailview';
import { fetchForwar } from 'redux/reducers/vetting/detailview';
import { fetchDataRequest } from 'requests/common/standard-object';

import {
    Modal,
    ModalTrigger,
    ModalHeader,
    ModalBody,
    ModalFoot,
    Button,
    Lookup,
    notify
} from 'carbon';

class Forward extends Component {
    constructor(props) {
        super(props);
        this.state = {
            uid: null,
            searchUser: null
        };
        this.handleSubmitForward = this.handleSubmitForward.bind(this);
        this.handleOnKeyDown = this.handleOnKeyDown.bind(this);
        this.handleOnChange = this.handleOnChange.bind(this);
    }

    componentWillMount () {
        let { user } = this.props;
        if (user){
            this.setState({
                searchUser: user.toJS()
            });
        }
    }
    handleSubmitForward () {
        let { id, votelist } = this.props;
        let {uid} = this.state;
        let param ={
            GroupId: votelist.get('GroupId') || 0,
            PointId: votelist.get('PointId'),
            ToUid: uid,
            MemberId: votelist.get('MemberId')
        };
        this.props.fetchForwar(id, param).then(()=>{
            this.props.fetchComment(id);
            notify.add('操作成功');
        }, err => {
            ErrorNotify(err);
        });
    }

    handleOnKeyDown (val) {
        let param = this.buildParam(val);
        this.props.fetchDataRequest('User', param)
            .then( (res) => {
                if (res.body.global_offset) {
                    this.setState({
                        searchUser: res.body.objects
                    });
                } else {
                    this.setState({
                        searchUser: []
                    });
                }
            });
    }

    buildParam(val) {
        let param = {order_by: 'updated_at', order_flag: 'DESC', limit: 5, offset: 0};
        param.view_filter = `{
            "filter_from": "all",
            "filter": {
                "expressions": [
                    {
                        "field":"name",
                        "operator":"CONTAINS",
                        "operands": ["'${val.value}'"]
                    }
                ],
            "logical_relation": "1"
            }
        }`;
        return param;
    }

    handleOnChange(v) {
        this.setState({
            uid: Object.keys(v.objectStack)[0]
        });
    }

    render() {
        return (
            <ModalTrigger>
                {this.props.trigger}
                <Modal className={'mcds-modal__w-520'} ref="modal">
                    <ModalHeader>
                        <i className="mcds-modal__close mcds-icon__close-line-20 close" />
                        <p className="mcds-modal__title">
                            请选择转发成员
                        </p>
                    </ModalHeader>
                    <ModalBody>
                        <Lookup
                            onKeyDown={this.handleOnKeyDown}
                            ref="lookupMemeber"
                            error={false}
                            placeholder="请选择转发人员"
                            onChange={this.handleOnChange}
                            data={ this.state.searchUser } />
                    </ModalBody>
                    <ModalFoot>
                        <span ref="handleClose" className="close" />
                        <div className="mcds-layout__column mcds-layout__right">
                            <span ref="handleClose" className="close" />
                            <Button className="mcds-button__neutral mcds-btn__right close">
                                取消
                            </Button>
                            <Button className="mcds-button__brand close" onClick={this.handleSubmitForward}>
                                转发
                            </Button>
                        </div>
                    </ModalFoot>
                </Modal>
            </ModalTrigger>
        );
    }
}

Forward.propTypes = {
    user: PropTypes.object,
    id: PropTypes.string,
    votelist: PropTypes.object,
    fetchDataRequest: PropTypes.func,
    fetchComment: PropTypes.func,
    fetchForwar: PropTypes.func,
    trigger: PropTypes.object
};

export default connect(
    null,
    dispatch => bindActionCreators({ fetchForwar, fetchDataRequest, fetchComment }, dispatch)
)(Forward);

