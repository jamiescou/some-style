import React from 'react';
import PropTypes from 'prop-types';
import classnames  from 'classnames';

import {
    AvatarIcon
} from './components';
import VetGroup from './vet-group';
import style from 'styles/modules/vetting/detail.scss';

export default class VetPoint extends React.Component {
    static propTypes = {
        data: PropTypes.object, // 数据源
        index: PropTypes.number, // 确认节点那个需要显示的下标
        length: PropTypes.number, // 节点总个数
        status: PropTypes.string, // 节点的状态
        name: PropTypes.string, // 节点名称
        obj: PropTypes.object
    }
    constructor(props){
        super(props);
        this.state = {
            nodeShow: null
        };
    }

    componentWillMount(){
        // 默认第一个审批节点展开 剩下的关闭
        let i;
        let length = this.props.length;
        let nodeShow = [];
        for (i = 0; i < length; i++){
            if (i === 0){
                nodeShow[i] = true;
            } else {
                nodeShow[i] = false;
            }
        }
        this.setState({
            nodeShow
        });
    }

    _handlehideNode(index) {
        let flag = this.state.nodeShow[index];
        let {nodeShow} = this.state;
        nodeShow[index] = !flag;
        this.setState({nodeShow: nodeShow});
    }

    renderHeader(){
        let StatusList = ['待审批', '待审批', '审批通过', '拒绝', '审批关闭'];
        let agreest;
        let className;
        let num = 0;
        let {status, name, index} = this.props;
        switch (status){
        case 'Wait' :
            num = 0;
            agreest = null;
            className = style.reset;
            break;
        case 'Voting' :
            num = 1;
            agreest = null;
            className = style.reset;
            break;
        case 'Approval' :
            num = 2;
            agreest = true;
            className = style['node-pass'];
            break;
        case 'Reject' :
            num = 3;
            agreest = false;
            className = style['node-reject'];
            break;
        case 'Closed' :
            num = 4;
            agreest = false;
            break;
        default :
            num= null;
            agreest = null;
            className = style.reset;
        }
        return (
            <h3 onClick={this._handlehideNode.bind(this, index)}>
                <AvatarIcon
                    agreest={agreest} />
                {name}
                <span className={classnames('mcds-p__l-5', style.reset, className)}>
                    {'('+StatusList[num]+')'}
                </span>
                <i className={`mcds-m__r-20 mcds-icon__arrow-line-20 mcds-cursor__pointer pull-right ${this.state.nodeShow[index] ? null : 'mcds-icon__rotate-270'}`} />
            </h3>
        );
    }

    renderGroup(){
        let data = this.props.obj;
        let text = data.get('VotePolicy');
        let count = 0; // 用于计数，如果当前审批节点中只有一个组或者人，那么不渲染提示文字
        if (data.get('PointMembers')) {
            count+=data.get('PointMembers').size;
        }
        if (data.get('Groups')) {
            count+=data.get('Groups').size;
        }
        return (
            <div>
                <div className={`mcds-p__t-10 mcds-p__b-10 ${style.revoke}`}>
                    {count > 1 ? <div>
                        <span className="mcds-m__r-5">*</span>
                        {this.renderText(text)}
                    </div> : null}
                </div>
                <VetGroup
                    members={data} />
            </div>
        );
    }
    renderText (text) {
        switch (text) {
        case 'AND' :
            return '全体审批人 / 审批组通过方可';
        case 'OR' :
            return '其中一个审批人 / 审批组通过即可';
        default :
            break;
        }
    }
    render(){
        let index = this.props.index;
        return (
            <li className="mcds-p__r-0">
                {this.renderHeader()}
                {this.state.nodeShow[index] ? this.renderGroup() : null}
            </li>
        );
    }
}


