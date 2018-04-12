import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import {
    VetResult
} from './components';
import VetPoint from './vet-point';
import style from 'styles/modules/vetting/detail.scss';


// 审批流节点大列表 包含 节点1 节点2 的渲染
// 渲染 points [{},{}]

export default class VetNode extends React.Component {
    static propTypes = {
        points: PropTypes.object,
        data: PropTypes.object
    }
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    renderPoint(){
        let pointList = this.props.data.get('Points');
        // 渲染每个节点
        /*  props 说明
            objpointList列表每一项
            index points的索引
            length 列表长度
            status 审批状态
            name 审批节点序号
        */
        return pointList.map((item, index, arr) => {
            return (<VetPoint
                obj={item }
                index={index}
                length={arr.size}
                status={item.get('Status')}
                name={item.get('Name')}
                key={item.get('Id')} />);
        });
    }
    render(){
        let { data } = this.props;
        let type = data.get('Status');
        let FinishTime= data.get('FinishTime');
        return (
            <article className={`mcds-card ${style.card}`}>
                <div className="mcds-card__header mcds-grid  mcds-m__b-0">
                    <header className="mcds-media mcds-card__media">
                        <div className="mcds-media__figure">
                            <div className={style['icon-small__wrap']}>
                                <i className="mcds-icon__seal-solid-24" />
                            </div>
                        </div>
                        <div className="mcds-media__body">
                            审批流节点
                        </div>
                    </header>
                    <VetResult className="pull-right" agreest={type} time={moment(FinishTime*1000).format('YYYY/MM/DD HH:mm')} />
                </div>
                <div className={style['card-body']}>
                    <ul className={`${style['card-body__group']} ${style['card-body__group-first']}`}>
                        {this.renderPoint()}
                    </ul>
                </div>
            </article>
        );
    }
}



