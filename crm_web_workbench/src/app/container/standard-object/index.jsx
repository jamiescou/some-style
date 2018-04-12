import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';

export default class StandardObject extends React.Component {
    static propTypes = {
        children: PropTypes.any
    };

    constructor(){
        super();
        this.state = {};
    }

    render() {
        let props = _.assign({}, this.props);
        delete props.children;
        let key = props.params.id ? props.params.objName + '-' + props.params.id : props.params.objName;
        return (
            <div key={key}>
                {this.props.children && React.cloneElement(this.props.children, props)}
            </div>
        );
    }
}
