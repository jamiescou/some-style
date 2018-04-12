import React, {Component} from 'react';
import PropTypes from 'prop-types';
import style from 'styles/modules/vetting/detail.scss';

export default class Item extends Component {
    static propTypes = {
        title: PropTypes.string, // 标题
        info: PropTypes.any, // 需要渲染的数据
        avatar: PropTypes.string // 头像链接
    };
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    render() {
        let { title, avatar, info } = this.props;
        return (
            <span className={`${style['edit-wrap']}`}>
                <div className={`mcds-layout__column mcds-layout__middle mcds-p__t-11  ${style['edit-item']}`}>
                    <div className="mcds-p__b-5 mcds-text__size-12 mcds-text__weak">{title}</div>
                    <div className="mcds-text mcds-text__size-13 mcds-p__l-12" style={{lineHeight: '32px'}}>
                        {avatar ? <span className="mcds-m__r-5 mcds-avatar  mcds-avatar__size-24 mcds-avatar__circle">
                            <img src={avatar} alt="avatar" />
                        </span> : null}
                        {<span>{info}</span>}
                    </div>
                </div>
            </span>
        );
    }
}
