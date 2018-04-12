/**
 * 用来存放右侧的关联对象
 */

import {connect} from 'react-redux';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';

import RelatedObjectItem from '../../panel/related-panel';

class RelatedObjects extends Component {

    constructor(props) {
        super(props);
    }
    renderRelated() {

    }

    renderReverseLookup() {
        let { dependency, detailData } = this.props;
        let { objName, id } = this.context.router.params;

        let list = dependency.getIn([objName, 'reverse_lookup']);
        let result = [];
        if (!list) {
            return null;
        }
        list.toMap().map((v, key) => {
            let column_names = v.get('column_names');
            column_names.toArray().map(j => {
                result.push(
                    <RelatedObjectItem
                        key={key} currentObjName={objName} currentObjId={id} relateObjName={key} relatedKey={j}
                        data={detailData} />
                );
            });
        });
        return result;

    }

    rendreDetail() {
        let { dependency, detailData } = this.props;
        let { objName, id } = this.context.router.params;
        let list = dependency.getIn([objName, 'detail']);
        if (!list) {
            return null;
        }
        let result = [];
        list.toMap().map((v, key) => {
            result.push(
                <RelatedObjectItem
                    key={key} currentObjName={objName} currentObjId={id} relateObjName={key} relatedKey={v}
                    data={detailData} />
            );
        });
        return result;
    }

    render() {
        let detail = this.rendreDetail();
        let reverse = this.renderReverseLookup();
        return (
            <li className="mcds-list__item">
                {detail}
                {reverse}
            </li>
        );
    }
}

RelatedObjects.contextTypes = {
    router: PropTypes.object
};

RelatedObjects.propTypes = {
    dependency: PropTypes.object.isRequired,
    objName: PropTypes.string.isRequired,
    detailData: PropTypes.object

};
export default connect(
    state => ({
        dependency: state.getIn(['standardObject', 'dependency']),
        detailData: state.getIn(['standardObject', 'detailview', 'data'])
    }),
    dispatch => bindActionCreators({}, dispatch)
)(RelatedObjects);
