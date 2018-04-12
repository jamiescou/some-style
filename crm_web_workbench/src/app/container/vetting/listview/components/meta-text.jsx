import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import BaseContext from 'container/share/base-field/base-field';

import { fetchRelatedDataListByIds } from 'redux/reducers/standard-object/related-object/data';

class DetailContext extends BaseContext {
    constructor() {
        super();
    }
    commonLookup(value, schema) {
        let { object_name } = schema;
        if (value) {
            this.props.fetchRelatedDataListByIds(object_name, value);
        }
        return super.master(value, schema);
    }

    master(value, schema) {
        return this.commonLookup(value, schema);
    }
}

export default connect(
    null,
    dispatch => bindActionCreators({ fetchRelatedDataListByIds }, dispatch)
)(DetailContext);
