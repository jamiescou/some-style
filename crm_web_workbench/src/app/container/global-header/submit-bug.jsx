import React, { Component } from 'react';
import PropTypes from 'prop-types';

import endPointInfo from 'utils/browser';
import { trim } from 'utils/dom';
import {
    Input,
    TextArea,
    Select,
    Button,
    FileSelector
} from 'carbon';
import style from 'styles/modules/global-header/submit-bug.scss';

export default class SubmitBug extends Component {
    static propTypes = {
        show: PropTypes.bool,
        onClose: PropTypes.func,
        onSave: PropTypes.func
    };
    constructor(props){
        super(props);
        this.state = {
            show: props.show,
            priority: 'normal',
            imageData: [],
            title: '',
            desc: '',
            titleErr: false,
            descErr: false
        };
    }
    componentWillReceiveProps(nextProps, nextState) {
        if (this.state.titleErr !== nextState.titleErr) {
            return true;
        }
        if (this.props.show !== nextProps.show) {
            return true;
        }
    }
    onClose() {
        this.setState({show: false});
        this.props.onClose();
    }
    onSave() {
        let { title, priority, desc, imageData } = this.state;
        if ( title === '') {
            this.setState({
                titleErr: true
            });
        } else if ( desc === '') {
            this.setState({
                descErr: true
            });
        } else {
            let data = { title, priority, desc, imageData, endPointInfo };
            this.props.onSave(data);
            this.onClose();
        }
    }
    _handlePaste(e) {
        let { imageData } = this.state;
        let item;
        if (e.clipboardData && e.clipboardData.items) {
            item = e.clipboardData.items[0];
        } else {
            return;
        }
        try {
            if (item.type && item.type.match(/^image\//)) {
                let reader = new FileReader();
                let blob = item.getAsFile();
                reader.readAsDataURL(blob);
                reader.onload = (paste) => {
                    let newUrl = paste.target.result;
                    imageData.push(newUrl);
                    this.setState({
                        imageData: imageData
                    });
                };
            }
        } catch (err) {
            console.log(err);
        }
    }
    handleImage(e) {
        let { imageData } = this.state;
        let file = e.target.files[0];
        e.target.value = '';
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (oFREvent) => {
            let newUrl = oFREvent.target.result;
            imageData.push(newUrl);
            this.setState({
                imageData: imageData
            });
        };
    }
    handlePriority(priority) {
        this.setState({
            priority
        });
    }
    deleteImage(i) {
        let { imageData } = this.state;
        delete imageData[i];
        this.setState({
            imageData: imageData
        });
    }
    _renderImage() {
        let { imageData } = this.state;
        return imageData.map((url, i) => {
            return (
                <div className={`${style.imageWrapper} mcds-m__t-10`} key={i}>
                    <i
                        className={`mcds-icon__close-12 mcds-text__size-10 ${style['delete-icon']}`}
                        onClick={this.deleteImage.bind(this, i)} />
                    <img className={style.image} src={url} />
                </div>
            );
        });
    }
    render() {
        let { show, titleErr, descErr, priority } = this.state;
        let showClass = show ? 'slideInRight' : 'slideOutRight';
        return (
            <div className={`mcds-divider__top mcds-filter mcds-divider__left animated mcds-layout__row ${style['submit-bug__position']} ${showClass}`} >
                <div className="mcds-layout__column mcds-filter__title">
                    <p className="mcds-m__l-20 mcds-text__size-16">问题反馈</p>
                    <i className="mcds-icon__close-line-20 mcds-filter__icon mcds-text__size-20" onClick={::this.onClose} />
                </div>
                <div id="filterContainer" className="mcds-filter__body mcds-p__l-20 mcds-p__r-20 mcds-p__b-10 mcds-m__t-10" >
                    <Input
                        label="标题"
                        name="title"
                        placeholder="请输入标题"
                        onChange={(title)=>{ this.setState({title: trim(title)}); }}
                        error={titleErr}
                        onFocus={()=>{ this.setState({titleErr: false}); }} />
                    { this.state.titleErr && <span className="mcds-span__required">标题不能为空</span> }
                    <TextArea
                        className={`mcds-m__t-10 ${style.textareaWarp}`}
                        label="详情"
                        name="detail"
                        placeholder="请输入具体内容"
                        onChange={(desc)=>{ this.setState({desc: trim(desc)}); }}
                        onPaste={::this._handlePaste}
                        error={descErr}
                        onFocus={()=>{ this.setState({descErr: false}); }} />
                    { this.state.descErr && <span className="mcds-span__required">内容不能为空</span> }
                    {this._renderImage()}
                    <FileSelector
                        className="mcds-m__t-10"
                        onChange={::this.handleImage}
                        Icon="mcds-icon__upload-line-20"
                        accept="image/png, image/jpeg, image/gif"
                        iconContent="上传问题图片" />
                    <Select className="mcds-m__t-10" label="优先级" value={priority} onChange={::this.handlePriority}>
                        <option value={'high'}>
                          high
                        </option>
                        <option value={'normal'}>
                          normal
                        </option>
                        <option value={'low'}>
                          low
                        </option>
                    </Select>
                    <div className="mcds-layout__column mcds-layout__right mcds-p__t-12">
                        <Button className="mcds-button__neutral mcds-btn__right" onClick={::this.onClose} >
                            取消
                        </Button>
                        <Button className="mcds-button__brand" onClick={::this.onSave}>
                            保存
                        </Button>
                    </div>
                </div>
            </div>
        );
    }
}
