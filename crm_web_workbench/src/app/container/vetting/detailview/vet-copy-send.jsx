import React from 'react';
import {ButtonIcon} from 'carbon';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import { default_avatar } from 'utils/user-setting.js';

import { fetchRelatedDataListByIds } from 'redux/reducers/standard-object/related-object/data';

import style from 'styles/modules/vetting/detail.scss';

@connect(
    state => ({
        relatedUsers: state.getIn(['standardObject', 'relatedObject', 'User'])
    }),
    dispatch => bindActionCreators({ fetchRelatedDataListByIds }, dispatch)
)
export default class VetCopySend extends React.Component{
    static propTypes = {
        data: PropTypes.object,
        relatedUsers: PropTypes.object,
        fetchRelatedDataListByIds: PropTypes.func
    };

    constructor(props){
        super(props);
        this.state = {
            showCC: true
        };
        this.handleClick = this.handleClick.bind(this);
    }

    componentDidMount () {
        let CCIds = this.props.data.get('CCIds');
        if (CCIds){
            CCIds = CCIds.toArray();
            this.props.fetchRelatedDataListByIds('User', CCIds);
        }
    }



    renderName () {
        let CCIds = this.props.data.get('CCIds');
        if (CCIds) {
            return CCIds.map((v, i) => (
                <li key={i} className={`mcds-layout__item mcds-m__r-30 mcds-text__line-24 mcds-m__b-8 ${style['copy-send']}`}>
                    <span className="mcds-m__r-5 mcds-avatar  mcds-avatar__size-24 mcds-avatar__circle">
                        <img src={ this.getUserAvatar(v)} />
                    </span>
                    { this.getUserName(v) }
                </li>
            ));
        }
    }

    getUserName (data) {
        let { relatedUsers } = this.props;
        if (relatedUsers && relatedUsers.get(data)) {
            return relatedUsers.getIn([data, 'name']);
        }
        return '***';
    }
    getUserAvatar (data) {
        let { relatedUsers } = this.props;
        if (relatedUsers && relatedUsers.get(data)) {
            if (relatedUsers.getIn([data, 'Avatar'])) {
                return relatedUsers.getIn([data, 'Avatar']);
            }
        }
        return default_avatar;
    }

    handleClick () {
        this.setState({showCC: !this.state.showCC});
    }

    render(){
        let showCC = this.state.showCC;
        return (
            <article className={`mcds-card ${style.card}`}>
                <div className="mcds-card__header mcds-grid mcds-m__b-14">
                    <header className="mcds-media mcds-card__media">
                        <div className="mcds-media__body mcds-text__size-13 mcds-cursor__pointer">
                            抄送
                        </div>
                    </header>
                    <div>
                        <ButtonIcon className={`mcds-icon__arrow-line-20 ${this.state.showCC ? null : 'mcds-icon__rotate-270'}`} onClick={this.handleClick} style={{color: '#767d85'}} />
                    </div>
                </div>
                <div className="mcds-m__b-30 mcds-card__body">
                    <ul className="mcds-layout mcds-list mcds-tile mcds-list__divider-bottom clearfix">
                        {showCC ? this.renderName() : null }
                    </ul>
                </div>
            </article>
        );
    }
}


