import React from 'react';
import PropTypes from 'prop-types';

import I from 'immutable';

import DetailPopoverPannel from 'container/standard-object/panel/detail-popover-panel';
import BaseListViewField from 'container/standard-object/base-field';

import { BuildNameLinkContext } from '../../get-suit-context';

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
    _renderCell(dataVal, field) {
        let {schema, objName} = this.props;
        let context = new BaseListViewField({
            value: dataVal.get(field),
            schema: schema.get(field),
            data: dataVal,
            objName,
            needDetailPopover: true
        }).render();

        if (field === 'name') {
            let trigger = (
                <div className="mcds-truncate">
                    {BuildNameLinkContext(dataVal.get(field), dataVal.get('id'), dataVal.get('Avatar'), objName)}
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

    render() {
        let { dataVal, dataIndex, fields } = this.props;

        return (
            <tr key={`list-${dataVal.get('id')}-${dataIndex}`}>
                <td className="mcds-p__l-30">
                    <span className="mcds-layout__item">{dataIndex + 1}</span>
                </td>
                {/* <td>
                    <Checkbox
                        checked={!!nowcChecked}
                        onChange={this.handleOneClick.bind(this, dataVal)} />
                </td> */}
                {fields.map(field => this._renderCell(dataVal, field))}
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
    info: PropTypes.object
};
