import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';

export default class Vetting extends React.Component {
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
        return (
            <div style={{height: '100%'}}>
                {this.props.children && React.cloneElement(this.props.children, props)}
            </div>
        );
    }
}
