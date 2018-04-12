import React from 'react';
import PropTypes from 'prop-types';


import {
    Button,
    ModalTrigger,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFoot

} from 'carbon';

// import { uploadAvatar } from 'requests/file/file';

// const img = 'http://pic.yue365.com/singer/150/3/5887.jpg';

export default class ModalAvatar extends React.Component {
    static propTypes = {
        // 触发区域
        trigger: PropTypes.element.isRequired
    };
    constructor(props) {
        super(props);
        this.state = {
            // mousedown: false,
            // resizeable: false,
            // screenXStart: 0,
            // tdWidth: 0,
            // headerWidth: 0,
            // targetTd: null
            src: null,
            flag: false,
            startPoint: {},
            endPoint: {},
            w: 0,
            h: 0
        };
    }
    componentWillMount() {
    }
    componentDidMount() {
    //     let oldcanvas = this.refs.oldcanvas;
    //     console.log(oldcanvas)
    //     let oldcontext = oldcanvas.getContext('2d');
    //     console.log('oldcontext', oldcontext)
    }
    onChange(e) {
        e.preventDefault();
        let files;
        if (e.dataTransfer) {
            files = e.dataTransfer.files;
        } else if (e.target) {
            files = e.target.files;
        }
        const reader = new FileReader();
        console.log('render', reader);
        reader.onload = () => {
            this.setState(
                {
                    src: reader.result
                }, () => {
                    let img = new Image();
                    img.src = this.state.src;
                    // let bytes = window.atob(this.state.src.split(',')[1]);        //去掉url的头，并转换为byte
                    // //处理异常,将ascii码小于0的转换为大于0  
                    // let ab = new ArrayBuffer(bytes.length);
                    // let ia = new Uint8Array(ab); 
                    // for (let i = 0; i < bytes.length; i++) {
                    //     ia[i] = bytes.charCodeAt(i);
                    // }
                    // let newB = new Blob( [ab] , {type : 'image/png'}); 
                    // // let formData = new FormData();
                    // // convertBase64UrlToBlob函数是将base64编码转换为Blob  
                    // // formData.append("imageName", newB);
                    // // console.log('formData', formData, newB)
                    // uploadAvatar(newB)
                    //     .then(url => {
                    //         console.log('success', url)
                    //     });
                    let oldcanvas = this.refs.oldcanvas;
                    let oldcontext = oldcanvas.getContext('2d');
                    oldcontext.drawImage(img, 0, 0, oldcanvas.width, oldcanvas.height);
                });
        };
        reader.readAsDataURL(files[0]);
    }
    // 鼠标按下事件     
    cantoxMouseDown(e) {
        let oldcanvas = this.refs.oldcanvas;
        // flag = true;
        this.setState({
            flag: true
        });
        let { cliptox } = this.refs;
        cliptox.style.display = 'block';
        let startPoint = this.windowToCanvas(oldcanvas, e.clientX, e.clientY);
        this.setState({
            startPoint: startPoint
        });
        cliptox.style.left = startPoint.x+'px';
        cliptox.style.top = startPoint.y+'px';
    }

    // 鼠标移动事件 
    cantoxMouseMove(e) {
        let { startPoint } = this.state;
        let cliptox = this.refs.cliptox;
        let oldcanvas = this.refs.oldcanvas;
        if (this.state.flag){
            cliptox.style.background = 'rgba(0,0,0,0.5)';
            let endPoint = this.windowToCanvas(oldcanvas, e.clientX, e.clientY);
            let w = endPoint.x - startPoint.x;
            let h = endPoint.y - startPoint.y;
            this.setState({
                w: w,
                h: h
            });
            cliptox.style.width = w +'px';
            cliptox.style.height = h+'px';
        }
    }
    // 鼠标释放事件 
    cantoxMouseUp() {
        // flag = false; 
        this.setState({
            flag: false
        });
    }

    // 按钮截取事件 
    cutImg() {
        let {startPoint, w, h} = this.state;
        let {oldcanvas, nowcanvas} = this.refs;
        let nowcontext = nowcanvas.getContext('2d');
        let img = new Image();
        img.src = this.state.src;
        this.imgCut(nowcontext, img, oldcanvas.width, oldcanvas.height, startPoint.x, startPoint.y, w, h);
    }

    /* 
    * 图像截取函数 
    * context:绘制环境对象 
    * image：图像对象 
    * imgElementW：图像显示的宽度 
    * imgElementH：图像显示的高度 
    * sx:截取图像的开始X坐标 
    * sy:截取图像的开始Y坐标 
    * w:截取图像的宽度 
    * h:截取图像的高度 
    * */ 
    imgCut(context, image, imgElementW, imgElementH, sx, sy, w, h) {
        // 清理画布，便于重新绘制 
        context.clearRect(0, 0, imgElementW, imgElementH);
        // 计算 ：比例 = 原图像/显示图像 
        let ratioW = image.width/imgElementW;
        let ratioH = image.height/imgElementH;
        // 根据截取图像的所占位置及大小计算出在原图所占的位置及大小 
        // .drawImage(图像对象, 原图像截取的起始X坐标, 原图像截取的起始Y坐标, 原图像截取的宽度, 原图像截取的高度， 
        // 绘制图像的起始X坐标, 绘制图像的起始Y坐标, 绘制图像所需要的宽度, 绘制图像所需要的高度);
        context.drawImage(image, ratioW*sx, ratioH*sy, ratioW*w, ratioH*h, 0, 0, w, h);
    }

    /* 
     * 坐标转换：将window中的坐标转换到元素盒子中的坐标，并返回(x,y)坐标 
     * element：canvas元素对象 
     * x:鼠标在当前窗口X坐标值 
     * y:鼠标在当前窗口Y坐标值 
     * */ 
    windowToCanvas(element, x, y){
        // 获取当前鼠标在window中的坐标值 
        // alert(event.clientX+"-------"+event.clientY);
        // 获取元素的坐标属性 
        let box = element.getBoundingClientRect();
        let bx = x - box.left;
        let by = y - box.top;
        return {x: bx, y: by};
    }
    renderOldcanvas() {
        return (
            <canvas
                id="oldcanvas"
                ref="oldcanvas"
                style={{height: 206, width: 206, float: 'left', position: 'relative', border: '1px dashed red'}} />
        );
    }
    renderNewcanvas() {
        return (
            <canvas
                id="nowcanvas"
                ref="nowcanvas"
                style={{height: 206, width: 206, float: 'left', position: 'relative', border: '1px dashed red'}} />
        );
    }
    render() {
        return (
            <ModalTrigger>
                {this.props.trigger}
                <Modal className="mcds-modal__w-520 mcds-modal__auto">
                    <ModalHeader>
                        <i className="mcds-modal__close mcds-icon__close-line-20 close" />
                        <p className="mcds-modal__title">
                            编辑头像
                        </p>
                    </ModalHeader>
                    <ModalBody>
                        <div
                            id="cantox"
                            ref="cantox"
                            style={{position: 'relative'}}
                            onMouseDown={::this.cantoxMouseDown}
                            onMouseUp={::this.cantoxMouseUp}
                            onMouseMove={::this.cantoxMouseMove} >
                            <div id="cliptox" ref="cliptox" style={{position: 'absolute', display: 'none'}} />
                            {this.renderOldcanvas()}
                        </div>
                        <button
                            id="btnclip"
                            ref="btnclip"
                            style={{float: 'left'}}
                            onClick={::this.cutImg} >
                            截取该区域
                        </button>
                        <input type="file" accept="image/png, image/jpeg, image/gif" onChange={::this.onChange} />
                        {this.renderNewcanvas()}
                        <input
                            type="range" step="0.01" min="1" max="2" className="RangeInput"
                            defaultValue="1" />
                    </ModalBody>
                    <ModalFoot>
                        <div className="mcds-layout__column mcds-layout__right">
                            <Button className="mcds-button__brand close">
                                保存
                            </Button>
                        </div>
                    </ModalFoot>
                </Modal>
            </ModalTrigger>
        );
    }
}
