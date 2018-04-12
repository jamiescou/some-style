import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { convertBytes } from  'utils/convert';

import { fileUpload } from 'requests/file/file';

import style from 'styles/modules/base/base-editor.scss';
import {
    FileSelector,
    notify
} from 'carbon';

export default class BaseText extends Component {
    constructor(props) {
        super(props);
        this.state = {
            file: null,
            url: '',
            upload: false, // 上传标识位
            status: true // 点击‘X’的显示状态
        };
    }

    reInit() {
        this.setState({
            file: null,
            upload: false,
            url: ''
        });
    }

    uploadFile(fileObj) {
        let request = fileUpload(fileObj);
        let { onChange } = this.props;
        this.setState({upload: true});
        request()
            .then((response) => {
                let { url } = response;
                let { file } = this.state;
                file.url = url;
                file.operation = 'update';
                onChange(file);
                this.reInit();
            }, () => {
                this.reInit();
            });
    }
    handleFileUpLoad(target) {
        let files = target.files;

        let file = null;

        if (files && files[0]) {
            file = files[0];
        }

        if (!file) {
            return notify.add('please select files');
        }
        this.setState({file: file, loading: true, status: false});
        this.uploadFile(file);
    }
    renderNewFile() {
        let { value } = this.props;
        if (!value.url) {
            return false;
        }
        return (
            <div className="mcds-media" >
                <div className="mcds-media__figure">
                    <span className="mcds-icon mcds-icon__size-16">
                        <span className="mcds-icon__paperclip-solid-24" />
                    </span>
                </div>
                <div className="mcds-media__body mcds-layout__column mcds-text__default">
                    <div className="mcds-layout__item mcds-truncate" style={{width: 0}}>
                        {value.name || value.filename}
                    </div>
                    <div className="mcds-text__line-20">
                        {convertBytes(value.size)}
                    </div>
                </div>
                <div className="mcds-media__body mcds-layout__column mcds-text__default mcds-layout__item">
                    <span style={{paddingLeft: '92%'}} className="mcds-icon__close-line-20 mcds-text__line-20 mcds-text__size-14" onClick={()=>this.setState({status: true, file: null, upload: false, url: ''})} />
                </div>
            </div>
        );
    }
    buildFileSelector(){
        let { upload, status } = this.state;
        if (status){
            return (
                <FileSelector
                    onChange={(e) => { this.handleFileUpLoad(e.target); }}
                    className={`${style['base-editor__file']}`}
                    Icon="mcds-icon__upload-line-20 mcds-p__r-5"
                    accept="*"
                    iconContent={!upload ? '上传数据文件' : '上传中'} />);
        }
        return this.renderNewFile();
    }
    render() {
        return this.buildFileSelector();
    }
}

BaseText.propTypes = {
    onChange: PropTypes.func,
    value: PropTypes.any,
    error: PropTypes.bool,
    className: PropTypes.string,
    active: PropTypes.bool
};

// const FileImage = 'data:image/png;base64,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';
