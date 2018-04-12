import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import RelatedObject  from './related-module/related-objects';
import CooperationObject  from './related-module/cooperation-objects';

import style from 'styles/modules/standard-object/index.scss';

const upFirst = word => {
    return word.substring(0, 1).toUpperCase() + word.substring(1);
};

class relateList extends Component{
    constructor(props) {
        super(props);
        this.state = {
            loading: true
        };
    }
    renderObject(params, others) {
        return <RelatedObject objName={others.objName} key={others.key} />;
    }

    renderCooperate(params, others) {
        return (
            <li className="mcds-list__item mcds-card__list-item" key={others.key}>
                <CooperationObject {...others} />
            </li>
        );
    }
    renderCards() {
        let { config, data } = this.props;
        let { objName, id } = this.context.router.params;
        let types = ['attachment', 'comment'];
        let others = {
            key: 0,
            objName,
            data,
            objId: id
        };
        const cardList = config.toArray().map((v, index) => {
            others.key = index;
            if (types.indexOf(v.get('type')) !== -1) {
                return null;
            }
            let fun = this[`render${upFirst(v.get('type'))}`];
            if (!fun) {
                return null;
            }

            return fun(v, others);
        });

        return (
            <ul className={`mcds-list mcds-card__list mcds-list mcds-bg__weak mcds-divider__left ${style['detail-relativeObject']}`} style={{padding: '20px', height: '100%'}}>
                {cardList}
            </ul>
        );
    }

    render() {
        return this.renderCards();
    }
}
relateList.propTypes = {
    data: PropTypes.object,
    config: PropTypes.object
};
relateList.contextTypes = {
    router: PropTypes.object
};

export default connect(
    dispatch => bindActionCreators({}, dispatch)
)(relateList);
