import React from 'react';
import PropTypes from 'prop-types';

import I from 'immutable';

import BaseField from 'container/standard-object/listview/base-field';

import { BuildNameLinkContext } from 'container/standard-object/get-suit-context';

import {
    DropDown,
    DropDownList,
    DropDownItem,
    DropDownTrigger,
    ButtonSmallIcon
} from 'carbon';

export default class TrComponent extends React.Component {
    constructor(props) {
        super(props);
    }

    shouldComponentUpdate(nextProps) {
        if (I.is(this.props.dataVal, nextProps.dataVal)) {
            return false;
        }
        return true;
    }
    // 海的领取
    handleClaimRecord(id){
        this.props.onClaimRecord(id);
        this.refs.claimDownTrigger.close();
    }
    /**
     * 把这个方法单独拉出来,渲染不同类型的字段会有一些判断,在这里处理
     */
    _renderCell(dataVal, field) {
        let {schema, objName} = this.props;
        let context = new BaseField({
            value: dataVal.get(field),
            schema: schema[field],
            data: dataVal,
            objName,
            needDetailPopover: false
        }).render();

        if (field === 'name') {
            context = (<div className="mcds-truncate">
                {BuildNameLinkContext(dataVal.get(field), dataVal.get('id'), objName)}
            </div>);
        }

        return <td key={field} className="mcds-truncate">{context}</td>;

    }

    render() {
        let { id, dataVal, dataIndex, fields } = this.props;
        const dropDown = (
            <td className="mcds-cell__shrink" key={`${id}-${dataIndex}`}>
                <div className="mcds-layout__column pull-left" title={dataVal.get(fields)}>
                    <DropDownTrigger ref="claimDownTrigger" autoCloseTag="close" target="self" placement="bottom-left" synchWidth={false} >
                        <ButtonSmallIcon icon="mcds-icon__triangle-solid-14" />
                        <DropDown className="mcds-dropdown__min-no">
                            <DropDownList>
                                <DropDownItem onClick={this.handleClaimRecord.bind(this, id)}>领取</DropDownItem>
                            </DropDownList>
                        </DropDown>
                    </DropDownTrigger>
                </div>
            </td>
        );
        return (
            <tr key={`list-${dataVal.get('id')}-${dataIndex}`}>
                <td className="mcds-p__l-30">
                    <span className="mcds-layout__item">{dataIndex + 1}</span>
                </td>
                {fields.map(field => this._renderCell(dataVal, field))}
                {dropDown}
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
    objName: PropTypes.string,
    onClaimRecord: PropTypes.func
};
