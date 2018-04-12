import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

import { Button } from 'carbon';
import DeleteModal from '../modal/delete';
import TransferModal from '../modal/transfer';
import DataMergeModal from '../modal/combine';

let style = require('styles/modules/standard-object/index.scss');

export default class Bar extends React.Component {
    constructor(props) {
        super(props);
    }
    rednerMergeModal() {
        let { dataArray, objName } = this.props;
        let idArray = [];
        dataArray.forEach((id)=>{
            idArray.push(id.get('object_id'));
        });
        return (
            <DataMergeModal
                trigger={<li className="mcds-list__item mcds-p__l-15 mcds-p__r-15 mcds-cursor__pointer mcds-text__link">
                    <span className="mcds-icon__left mcds-icon__edit-line-20" />
                    合并
                </li>}
                idArray={idArray}
                objName={objName} />
        );
    }
    render() {
        let { dataArray, objName, allObjects } = this.props;
        return (
            <div className={classnames('mcds-m__l-20', style['absolute-bottom'])}>
                <ul className="mcds-list__horizontal">
                    <li className={classnames('mcds-list__item', style.divider)}>
                        <Button className="mcds-p__l-30 mcds-p__r-30 mcds-text__default">
                            已选中<span className="mcds-m__l-5 mcds-m__r-5">{dataArray.length}</span>项
                        </Button>
                    </li>
                    <TransferModal
                        trigger={<li className="mcds-list__item mcds-p__l-15 mcds-p__r-15 mcds-cursor__pointer mcds-text__link">
                            <span className="mcds-icon__left mcds-icon__people-solid-24" />
                            转移拥有人
                        </li>}
                        id={dataArray}
                        allObjects={allObjects}
                        success={this.props.batchTransferSuccess}
                        objName={objName} />
                    <DeleteModal
                        trigger={<li className="mcds-list__item mcds-p__l-15 mcds-p__r-15 mcds-cursor__pointer mcds-text__link">
                            <span className="mcds-icon__left mcds-icon__delete-solid-14" />
                            删除
                        </li>}
                        id={dataArray}
                        success={this.props.batchDeleteSuccess}
                        objName={objName} />
                    {
                        [2, 3].indexOf(dataArray.length) >= 0 ? this.rednerMergeModal() : null
                    }
                    {/* <li className="mcds-list__item mcds-p__l-15 mcds-p__r-15 mcds-cursor__pointer">
                        <span className="mcds-icon__left mcds-icon__reload-solid-14" />
                        转换为客户
                    </li>
                    <li className="mcds-list__item mcds-p__l-15 mcds-p__r-15 mcds-cursor__pointer">
                        <span className="mcds-icon__left mcds-icon__edit-line-20" />
                        编辑
                    </li> */}
                </ul>
            </div>
        );
    }
}

Bar.propTypes = {
    dataArray: PropTypes.array, // 传入的data数组
    objName: PropTypes.string,
    batchDeleteSuccess: PropTypes.func, // 批量删除
    batchTransferSuccess: PropTypes.func, // 批量转换
    allObjects: PropTypes.object // 父组件传递来的所有标准对象集合
};
Bar.defaultProps = {
    dataArray: []
};
