/**
 * 这个base-field只给标准对象使用
 */
import React from 'react';

import BaseContext from 'container/share/base-field';

import PopoverPanel from './panel/detail-popover-panel';

class StandardBaseField extends BaseContext {
    constructor(props) {
        super(props);
        this.props = {
            ...props
        };
    }

    commonLookup({value, schema}) {
        return this.popover(value, schema);
    }
    popover(value, schema) {
        let { type, object_name } = schema;

        let { needDetailPopover } = this.props;
        if (!value) {
            return null;
        }
        let baseLookup = this.render_types_field(type);
        if (!needDetailPopover) {
            return baseLookup;
        }

        return (
            <PopoverPanel
                objName={object_name}
                id={value}
                trigger={<div>{baseLookup}</div>} />);
    }

    extend_master({value, schema}) {
        return this.commonLookup({value, schema});
    }
    extend_lookup({value, schema}) {
        return this.commonLookup({value, schema});
    }
    extend_external_id({value, schema}) {
        return this.commonLookup({value, schema});
    }
    extend_hierarchy({value, schema}) {
        return this.commonLookup({value, schema});
    }
    render() {
        return super.render();
    }
}
export default StandardBaseField;
