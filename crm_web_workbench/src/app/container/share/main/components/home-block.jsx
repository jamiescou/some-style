import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import { browserHistory } from 'react-router';

import classnames from 'classnames';

import styles from 'styles/modules/home/home-modal.scss';

class Block extends Component {
    constructor(props) {
        super(props);
        this.handleRouter = this.handleRouter.bind(this);
    }

    handleRouter () {
        let { url } = this.props;
        browserHistory.push(url);
    }

    render() {
        let { text, icon } = this.props;
        return (
            <div className={classnames(styles['home__block-box'], 'mcds-m__r-40 mcds-m__b-40 mcds-cursor__pointer')} onClick={ this.handleRouter }>
                <div className={classnames(styles['home__block-content'])}>
                    <span className={classnames(styles['home__block-icon'], icon)} />
                </div>
                <div className={classnames(styles['home__block-text'], 'mcds-m__t-18')}>
                    { text }
                </div>
            </div>
        );
    }
}
Block.propTypes = {
    text: PropTypes.string.isRequired, // 模块上显示的文本
    icon: PropTypes.string.isRequired, // 模块上显示的小图标
    url: PropTypes.string.isRequired // 模块跳转时所需要的路由路径
};

export default connect(
    null,
    dispatch => bindActionCreators({ }, dispatch)
)(Block);

