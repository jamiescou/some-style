import React from 'react';
import PropTypes from 'prop-types';

import I from 'immutable';

import EditModal from 'container/standard-object/modal/update';
import DeleteDataModal from 'container/standard-object/modal/delete';
import DetailPopoverPannel from 'container/standard-object/panel/detail-popover-panel';

import BaseField from 'container/standard-object/listview/base-field';
// import BaseField from 'container/share/base-field/index';

import { BuildNameLinkContext } from 'container/standard-object/get-suit-context';

import {
    DropDown,
    DropDownList,
    DropDownItem,
    DropDownTrigger,
    ButtonSmallIcon,
    Checkbox,
    ButtonGroup
} from 'carbon';

export default class TrComponent extends React.Component {
    constructor(props) {
        super(props);
        this.modifySuccess = this.modifySuccess.bind(this);
        this.removeSuccess = this.removeSuccess.bind(this);
    }

    shouldComponentUpdate(nextProps) {
        if (I.is(this.props.dataVal, nextProps.dataVal) && I.is(this.props.hashList, nextProps.hashList)) {
            return false;
        }
        return true;
    }

    modifySuccess (objName, id, data) {
        this.props.modifydata(objName, id, data);
    }
    removeSuccess (objName, body, data) {
        let id = body.id;
        this.props.removedata(objName, id, data);
        // 这个是删除选中的数据的hash记录
        this.props.deleteHashData(id);
    }
    // 判断编辑和删除权限
    buildDropDownArray(objName, id, dataVal) {
        let objId = id;
        if (this.props.info) {
            objId = this.props.info.objId;
        }
        let config = this.props.config;
        let optionalButtons = () => {
            let result = [];
            let optionalButton = config.get('optionalButtons');
            if (!optionalButton) {
                return false;
            }
            result = optionalButton.toArray().map((v, i) => {
                let type = v.get('type');
                if (type === 'modal') {
                    let displayName = v.get('displayName');
                    let operation = v.get('operation');
                    switch (operation){
                    case 'edit':
                        let order = v.get('order') ? v.get('order').toJS() : [];
                        return (
                            <EditModal
                                key={i}
                                id={objId}
                                ref="editModal"
                                fromPage="list"
                                value={dataVal}
                                order={order}
                                objName={objName}
                                schema={this.props.schema}
                                success={this.modifySuccess}
                                trigger={<DropDownItem className="close" >{displayName}</DropDownItem>} />
                        );
                    case 'delete':
                        return (
                            <DeleteDataModal
                                id={objId}
                                value={dataVal}
                                key={i} objName={objName}
                                success={this.removeSuccess}
                                onDelete={(closeModal) => { this.onDelete(dataVal, closeModal); }}
                                trigger={<DropDownItem className="close">{displayName}</DropDownItem>} />);
                    default:
                        throw new Error(`not found ${operation} about modal operation`);
                    }
                }
            });
            return result;
        };
        return <ButtonGroup>{optionalButtons()}</ButtonGroup>;
    }

    _renderCell(dataVal, field) {
        let { schema, objName } = this.props;
        let context = new BaseField({
            value: dataVal.get(field),
            schema: schema[field],
            data: dataVal,
            objName,
            needDetailPopover: true
        }).render();

        if (field === 'name') {
            let trigger = (
                <div className="mcds-truncate">
                    {BuildNameLinkContext(dataVal.get(field), dataVal.get('id'), objName)}
                </div>
            );
            context = (
                <DetailPopoverPannel
                    id={dataVal.get('id')}
                    objName={objName}
                    trigger={trigger} />);
        }

        return <td key={field} className="mcds-truncate">{context}</td>;

    }

    handleOneClick(dataVal) {
        this.props.handleChecked(dataVal);
    }

    render() {
        let { objName, id, dataVal, dataIndex, fields } = this.props;
        let drondwonTriggerArray = this.buildDropDownArray(objName, id, dataVal);
        const dropDown = (
            <td className="mcds-cell__shrink" key={`${id}-${dataIndex}`}>
                <div className="mcds-layout__column pull-left">
                    {
                        drondwonTriggerArray.length !== 0 ? <DropDownTrigger autoCloseTag="close" target="self" placement="bottom-left" synchWidth={false} >
                            <ButtonSmallIcon icon="mcds-icon__triangle-solid-14" />
                            <DropDown className="mcds-dropdown__min-no">
                                <DropDownList>
                                    { drondwonTriggerArray }
                                </DropDownList>
                            </DropDown>
                        </DropDownTrigger> : null
                    }
                </div>
            </td>
        );
        let hashList = this.props.hashList;
        let nowcChecked = hashList.get(id);
        return (
            <tr key={`list-${dataVal.get('id')}-${dataIndex}`} className={nowcChecked ? 'mcds-table__checked' : ''}>
                <td className="mcds-p__l-30">
                    <span className="mcds-layout__item">{dataIndex + 1}</span>
                </td>
                <td>
                    <Checkbox
                        checked={!!nowcChecked}
                        onChange={this.handleOneClick.bind(this, dataVal)} />
                </td>

                {fields.map(field => this._renderCell(dataVal, field))}
                {/* 因为现在的layout还不能做按钮配置， 目前现在这个地方判断，layout支持配置按钮后记得将判断去掉 */}
                {objName === 'User' ? null : dropDown}
            </tr>
        );
    }
}
TrComponent.propTypes = {
    id: PropTypes.string,
    fields: PropTypes.object,
    dataVal: PropTypes.object,
    dataIndex: PropTypes.number,
    data: PropTypes.object,
    schema: PropTypes.object,
    config: PropTypes.object,
    objName: PropTypes.string,
    modifydata: PropTypes.func,
    removedata: PropTypes.func,
    handleChecked: PropTypes.func,
    hashList: PropTypes.object,
    info: PropTypes.object,
    deleteHashData: PropTypes.func // 这个是删除选中的数据的hash记录
};
