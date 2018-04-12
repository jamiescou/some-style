import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import ErrorNotify from 'container/share/error/error-notify';

import { createComment } from 'redux/reducers/vetting/detailview';
import {
    TextArea
} from 'carbon';

import { trim } from 'utils/dom';

class EditorExample extends Component {
    static propTypes = {
        data: PropTypes.object,
        createComment: PropTypes.func
    };

    constructor(){
        super();
        this.handleCreateContent = this.handleCreateContent.bind(this);
    }

    handleCreateContent (e) {
        if ( e.shiftKey && e.keyCode === 13 ) {
            let id = this.props.data.get('Id');
            let content = this.refs.editor.refs.textarea.value;
            if (trim(content)) {
                this.props.createComment(id, content).then(()=>{}, err => {
                    ErrorNotify(err);
                });
                this.refs.editor.refs.textarea.value='';
                e.preventDefault();
            }
        }
    }

    render() {
        return (
            <div>
                <TextArea
                    error={false}
                    ref="editor"
                    placeholder="Shift + Enter提交"
                    name="textarea"
                    onKeyDown={this.handleCreateContent} />
            </div>
        );
    }
}
export default connect(
    null,
    dispatch => bindActionCreators({createComment}, dispatch))(EditorExample);
