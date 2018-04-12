import React from 'react';
import PropTypes from 'prop-types';

import {
    ModalTrigger,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFoot,
    Button,
    Select
} from 'carbon';



export default class CreateApproval extends React.Component {
    static propTypes = {
        // trigger 用来触发modal
        trigger: PropTypes.element.isRequired,
        // objNames 是有审批模板的标准对象
        objNames: PropTypes.object.isRequired,
        // getObjName 回传选好的objName
        getObjName: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            value: -1,
            disabled: true,
            openModal: false
        };
    }

    renderModalBody(){
        let { objNames } = this.props;
        let options = objNames.map(v => <option value={v.get('name')} key={v.get('name')}>{v.get('display_name')}</option>);
        return (
            <Select value={this.getValue()} onChange={::this.handleChange}>
                <option value={-1} key={-1}>请选择</option>
                {options}
            </Select>
        );
    }

    handleChange(value) {
        if (value !== -1) {
            this.setState({
                value,
                disabled: false
            });
        } else {
            this.setState({
                value,
                disabled: true
            });
        }
    }

    getValue() {
        let result = '请选择';
        this.props.objNames.forEach(v => {
            if (v.get('name') === this.state.value) {
                result = v.get('display_name');
            }
        });
        return result;
    }

    closeModal() {
        if (this.refs.handleClose && this.refs.handleClose.click) {
            this.refs.handleClose.click();
        }
    }

    handleSubmitClick() {
        let value = this.state.value;
        if (value !== -1) {
            this.props.getObjName(value);
            this.closeModal();
        }
    }

    render() {
        return (
            <ModalTrigger>
                {this.props.trigger}
                <Modal className="mcds-modal__w-520" ref="modal">
                    <ModalHeader>
                        <i className="mcds-modal__close mcds-icon__close-line-20 close" />
                        <p className="mcds-modal__title">
                            选择审批类型
                        </p>
                    </ModalHeader>
                    <ModalBody>
                        {this.renderModalBody()}
                    </ModalBody>
                    <ModalFoot>
                        <span ref="handleClose" className="close" />
                        <div className="mcds-layout__column mcds-layout__right">
                            <span ref="handleClose" className="close" />
                            <Button className="mcds-button__neutral mcds-btn__right close">
                                取消
                            </Button>
                            <Button disabled={this.state.disabled} className="mcds-button__brand" onClick={::this.handleSubmitClick}>
                                确定
                            </Button>
                        </div>
                    </ModalFoot>
                </Modal>
            </ModalTrigger>
        );
    }
}
