import _ from 'lodash';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import {
    Input,
    Button,
    ModalTrigger,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFoot,
    notify,
    Loading
} from 'carbon';

// import ModalAvatar from './modal-avatar';

import style from 'styles/modules/setting/setting.scss';
import { fetchUserData, updateUserData } from 'redux/reducers/user-profile';
import { fetchSchema } from 'redux/reducers/standard-object/schema';
import { formatValueBySchema, filterFormatValueByScheme} from 'utils/format-value';
import SettingEditor from './setting-editor';
import ErrorNotify from 'container/share/error/error-notify';
import { uploadAvatar } from 'requests/file/file';

import { default_avatar } from 'utils/user-setting';

const order = [
    'name',
    'Gender',
    'MobilePhone',
    'Email',
    'Department',
    'Title',
    'NativePlace',
    'Hobbies',
    'Phone',
    'QQ',
    'Manager',
    'EmployeeID',
    'EntryDate',
    'BirthDate'
];

@connect(
    state => ({
        me: state.getIn(['userProfile', 'userId']),
        data: state.getIn(['userProfile', 'user']),
        schema: state.getIn(['standardObject', 'schema', 'User'])
    }),
    dispatch => bindActionCreators({fetchSchema, fetchUserData, updateUserData}, dispatch)
)


export default class PersonalInfo extends Component {
    static propTypes = {
        me: PropTypes.string,
        data: PropTypes.object,
        schema: PropTypes.object,
        fetchSchema: PropTypes.func,
        fetchUserData: PropTypes.func,
        updateUserData: PropTypes.func
    };

    constructor(props) {
        super(props);
        this.state = {
            status: 'common'
        };
        this.handleDate = this.handleDate.bind(this);
        this.handleChangeImg = this.handleChangeImg.bind(this);
    }

    componentWillMount() {
    }

    componentDidMount() {
        let { me } = this.props;
        this.props.fetchSchema('User');
        this.props.fetchUserData(me);
    }

    handleChangeImg(e) {
        let { me, data } = this.props;
        let file = e.target.files[0];
        e.target.value = '';
        // let oFReader = new FileReader();
        // oFReader.readAsDataURL(file);
        // oFReader.onload =(oFREvent) => {
        //     console.log(oFREvent.target.result);
        // }
        uploadAvatar(file)
            .then(url => {
                let result = {};
                result.version = data.get('version');
                result.Avatar = url;
                this.props.updateUserData(me, result).then(() => {
                    notify.add({message: '头像修改成功', theme: 'success'});
                }, response => ErrorNotify(response));
            });
    }
    renderEmailRight() {
        let data = this.props.data.toJS();
        return (
            <div className={style.emailRight}>
                <span className={style.unbound}>* 未绑定</span>
                <ModalTrigger>
                    <Button className="mcds-button__neutral">
                        绑定邮箱
                    </Button>
                    <Modal className="mcds-modal__w-520 mcds-modal__auto">
                        <ModalHeader>
                            <i className="mcds-modal__close mcds-icon__close-line-20 close" />
                            <p className="mcds-modal__title">
                                邮箱绑定
                            </p>
                        </ModalHeader>
                        <ModalBody>
                            <p className="mcds-text__center">
                                您的邮箱为：{data.Email}
                            </p>
                            <div className="mcds-text__center mcds-m__t-25">
                                <Input className={style.captchaInput} />
                                <Button className={`${style.captchaButton} mcds-button__brand close`}>
                                    获取验证码
                                </Button>
                            </div>
                        </ModalBody>
                        <ModalFoot>
                            <div className="mcds-layout__column mcds-layout__right">
                                <Button className="mcds-button__brand close">
                                    保存
                                </Button>
                            </div>
                        </ModalFoot>
                    </Modal>
                </ModalTrigger>
            </div>
        );
    }
    handleDate() {
        let { me, schema, data } = this.props;
        let result = {};
        order.forEach(v => {
            if (schema.getIn([v, 'writable'])) {
                let newValue = this.refs[v].getValue();
                result[v] = formatValueBySchema(newValue, schema.get(v));
            }
        });
        result = filterFormatValueByScheme(result, schema);
        result.version = data.get('version');
        this.props.updateUserData(me, result).then(() => {
            notify.add({message: '保存成功', theme: 'success'});
            this.setState({
                status: 'common'
            });
        }, response => {
            ErrorNotify(response);
            this.setState({
                status: 'common'
            });
        });
    }
    renderForm() {
        let { schema, data } = this.props;
        let { status } = this.state;
        let buildEditItem = [];
        _.map(order, v => {
            buildEditItem.push(
                <SettingEditor
                    status={status}
                    schema={schema.get(v)}
                    value={data.get(v)}
                    type={v}
                    key={v}
                    ref={v} />
            );
        });
        let ButtonDom = null;
        if (status === 'common') {
            ButtonDom = (
                <Button className={`${style.edit} mcds-button__brand`} onClick={()=>{ this.setState({status: 'edit'}); }}>编辑</Button>
            );
        } else {
            ButtonDom = (
                <div>
                    <Button className={`${style.cancel} mcds-button__neutral`} onClick={()=>{ this.setState({status: 'common'}); }}>取消</Button>
                    <Button className={`${style.save} mcds-button__brand`} onClick={this.handleDate}>保存</Button>
                </div>
            );
        }
        return (
            <div className={style['form-group']}>
                {buildEditItem}
                {ButtonDom}
            </div>
        );
    }
    render() {
        let { schema, data } = this.props;
        let avatarSrc = data.get('Avatar') || default_avatar;
        let isFetchData = !_.isEqual(data.toJS(), {});
        if (schema && isFetchData) {
            return (
                <div className={style.content}>
                    <h3 className={style.title}>个人信息</h3>
                    <div className={style.avatar}>
                        <label className="mcds-cursor__pointer" >
                            <img className={style.avatarImg} src={avatarSrc} />
                            <input className="hide" type="file" accept="image/png, image/jpeg, image/gif" onChange={this.handleChangeImg} />
                        </label>
                    </div>
                    {this.renderForm()}
                </div>
            );
        }
        return (
            <div className={style.content}>
                <Loading theme="logo" model="small" />
            </div>
        );
    }
    // render() {
    //     let { schema, data } = this.props;
    //     console.log('data', data.toJS());
    //     let isFetchData = !_.isEqual(data.toJS(), {});
    //     if (schema && isFetchData) {
    //         return (
    //             <div className={style.content}>
    //                 <h3 className={style.title}>个人信息</h3>
    //                 <ModalAvatar 
    //                     trigger={
    //                         <div className={style.avatar}>
    //                             <img className={style.avatarImg} src="/public/img/logo.svg" />
    //                         </div>
    //                     } />
    //                 {this.renderForm()}
    //             </div>
    //         );
    //     }
    //     return (
    //         <div className={style.content}>
    //             <Loading theme="logo" model="small" />
    //         </div>
    //     );
    // }
}
