import React, { Component } from 'react';

import {
    ModalTrigger,
    Modal,
    ModalBody,
    ModalFoot,
    Button,
    Input

} from 'carbon';
let AMap;
// 更加经纬度设置定位点
export default class Map extends Component{
    constructor(props) {
        super(props);
        this.state = {
        	longitude: 116.319429,
            latitude: 40.070882,
            map: null,
            address: '这个位置应该是从数据里面获取吧！',
            searchTargetLng: null,
            searchTargetLat: null,
            searchLine: null,
            searchLineRiding: null
        };
    }

    componentWillMount() {
    	let src = 'http://webapi.amap.com/maps?v=1.3&key=ebf565d6fc289a7760e68eb954c3ef32&callback=init';
    	let script = document.createElement('script');
    	script.type = 'text/javascript';
        script.src = src;
    	document.body.appendChild(script);
    }
    componentDidMount() {
        window.init = () => {
            if (!window.AMap) {
                console.error('AMap is required');
            } else {
                AMap = window.AMap;
                console.log('地图加载成功');
            }
        };
    }

    clickmap() {
        setTimeout(::this.showMap, 500);
    }
    showMap() {
        let map;
        let geolocation;
        map = new AMap.Map('map', {
            scrollWheel: true,
            resizeEnable: true,
            zoom: 14
        });
        // map.plugin(["AMap.ToolBar"], ()=> {
        //     map.addControl(new AMap.ToolBar());
        // });   鼠标导航条，需要可以打开。
        map.plugin(['AMap.Geolocation'], ()=> {
            geolocation = new AMap.Geolocation({
                enableHighAccuracy: true, // 是否使用高精度定位
                timeout: 10000, // 超过10秒后停止定位
                zoomToAccuracy: true, // 定位成功后调整地图视野范围使定位位置及精度范围视野内可见
                buttonPosition: 'RB'
            });
            map.addControl(geolocation);
        });
        this.setState({
            map: map
        });
        // 现在没有数据，如果有数据，搜索结果走这里。
        // if (false) {
        //     let lnglatXY=[];
        //     lnglatXY.push(this.state.longitude);
        //     lnglatXY.push(this.state.latitude);
        //     this.regeocoder(map, lnglatXY);
        //     this.searchMap(map);
        // } else {
        geolocation.getCurrentPosition();
        AMap.event.addListener(geolocation, 'complete', ::this.onComplete);// 返回定位信息
        AMap.event.addListener(geolocation, 'error', ::this.onError);
        this.searchMap(map);
        // }
        let result = document.getElementById('searchResult');
        let resultList = document.getElementsByClassName('amap-sug-result');
        result.appendChild(resultList[0]);
    }
    onComplete(data) {
        let str=[];
        str.push('经度：' + data.position.getLng());
        str.push('纬度：' + data.position.getLat());
        str.push('地址：' + data.formattedAddress);
        document.getElementById('tip').innerHTML = str;
    }
    onError(data) {
        document.getElementById('tip').innerHTML = '定位失败';
        console.log('定位失败', data);
    }

    // 逆地理编码
    regeocoder(map, lnglatXY) {
        let geocoder;
        map.plugin('AMap.Geocoder', ()=>{
            geocoder = new AMap.Geocoder({
                radius: 1000,
                extensions: 'all'
            });
            map.addControl(geocoder);
        });
        geocoder.getAddress(lnglatXY, function(status, result) {
            if (status === 'complete' && result.info === 'OK') {
                let address = result.regeocode.formattedAddress;
                let html = document.getElementById('tip');
                if (html){
                    html.innerHTML = address;
                }
            }
        });
        // let marker = new AMap.Marker({
        //     map: map,
        //     position: lnglatXY
        // });
        map.setFitView();
    }

    // 搜索结果跳转
    searchMap(map) {
        let auto;
        let placeSearch;
        let autoOptions = {
            input: 'tipinput'
        };
        map.plugin('AMap.Autocomplete', ()=>{
            auto = new AMap.Autocomplete(autoOptions);
            map.addControl(auto);
        });
        map.plugin('AMap.PlaceSearch', ()=>{
            placeSearch = new AMap.PlaceSearch({
                map: map
            });
            map.addControl(placeSearch);
        });
        AMap.event.addListener(auto, 'select', (e)=>{
            placeSearch.setCity(e.poi.adcode);
            placeSearch.search(e.poi.name);
            document.getElementById('tip').innerHTML = e.poi.address;
            this.setState({
                searchTargetLng: e.poi.location.lng,
                searchTargetLat: e.poi.location.lat
            });

        });
    }

    // 汽车导航结果
    goHereCar() {
        let driving;
        let drivingRender;
        let map = this.state.map;
        map.plugin('AMap.Driving', ()=>{
            driving = new AMap.Driving({
                policy: AMap.DrivingPolicy.LEAST_TIME // 导航类型，可更改
            });
            map.addControl(driving);
        });
        map.plugin('AMap.DrivingRender', ()=>{
            drivingRender = new AMap.DrivingRender();
            map.addControl(drivingRender);
        });
        map.clearMap();
        driving.search([this.state.longitude, this.state.latitude], [this.state.searchTargetLng, this.state.searchTargetLat], (status, result)=> {
            if (status === 'complete' && result.info === 'OK'){
                drivingRender.autoRender({
                    data: result,
                    map: map,
                    autoFitView: true
                });
            } else {
                // alert(result);
            }
            this.setState({
                searchLine: result
            });
        });
    }

    // 步行导航
    goHereWalk() {
        let walking;
        let walkingRender;
        let map = this.state.map;
        map.plugin('AMap.Walking', ()=>{
            walking = new AMap.Walking();
            map.addControl(walking);
        });
        map.plugin('AMap.WalkingRender', ()=>{
            walkingRender = new AMap.WalkingRender();
            map.addControl(walkingRender);
        });
        map.clearMap();
        walking.search([this.state.longitude, this.state.latitude], [this.state.searchTargetLng, this.state.searchTargetLat], (status, result)=> {
            walkingRender.autoRender({
                data: result,
                map: map,
                autoFitView: true
            });
            this.setState({
                searchLine: result
            });
        });
    }

    // 骑行导航
    goHereRiding() {
        let riding;
        let ridingRender;
        let map = this.state.map;
        map.plugin('AMap.Riding', ()=>{
            riding = new AMap.Riding({

            });
            map.addControl(riding);
        });
        map.plugin('AMap.RidingRender', ()=>{
            ridingRender = new AMap.RidingRender();
            map.addControl(ridingRender);
        });
        map.clearMap();
        riding.search([this.state.longitude, this.state.latitude], [this.state.searchTargetLng, this.state.searchTargetLat], (status, result)=> {
            ridingRender.autoRender({
                data: result,
                map: map,
                autoFitView: true
            });
            this.setState({
                searchLineRiding: result
            });
        });
    }

    // 导航数据渲染
    searchLineMdoal() {
        let line = this.state.searchLine.routes[0].steps;
        return line.map((value, index)=>{
            return (
                <li key={ index }>{ value.instruction }</li>
            );
        });
    }
    searchLineMdoalRiding() {
        let line = this.state.searchLineRiding.routes[0].rides;
        return line.map((value, index)=>{
            return (
                <li key={ index }>{ value.instruction }</li>
            );
        });
    }

    // 清除导航线路信息
    clearPath() {
        let map = this.state.map;
        this.setState({
            searchLine: null,
            searchLineRiding: null
        });
        map.clearMap();
    }

    render() {
        return (
            <ModalTrigger>
                <Input onClick={::this.clickmap} className="mcds-button__brand" value={this.state.address === null ? ' ' : this.state.address} />
                <Modal className="mcds-modal__sizePercent80 mcds-modal__auto">
                    <ModalBody>
                        <div id="map">
                            <div id="tip" />
                        </div>
                        <div id="search">
                            <input id="tipinput" />
                            <div id="searchResult">
                                <ul>
                                    {this.state.searchLine ===null ? ' ' : this.searchLineMdoal()}
                                    {this.state.searchLine ===null ? ' ' : this.searchLineMdoal()}
                                    {this.state.searchLineRiding ===null ? ' ' : this.searchLineMdoalRiding()}
                                </ul>
                            </div>
                        </div>
                        <div id="goTo">
                            <Button className="mcds-button__neutral" onClick={::this.goHereCar} >
                                开车
                            </Button>
                            <Button className="mcds-button__neutral" onClick={::this.goHereWalk} >
                                步行
                            </Button>
                            <Button className="mcds-button__neutral" onClick={::this.goHereRiding} >
                                骑行
                            </Button>
                            <Button className="mcds-button__neutral" onClick={::this.clearPath} >
                                清除路径
                            </Button>
                        </div>
                    </ModalBody>
                    <ModalFoot>
                        <div className="mcds-layout__column mcds-layout__right">
                            <Button className="mcds-button__neutral mcds-btn__right close">
                                取消
                            </Button>
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
