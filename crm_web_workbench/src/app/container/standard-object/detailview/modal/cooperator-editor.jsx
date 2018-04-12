import React from 'react';
import PropTypes from 'prop-types';


import BaseEditor from 'container/share/base-field-editor/';
import Lookup from 'container/share/base-field-editor/flavor/_lookup';


export default class CooperatorEditor extends BaseEditor {
    static propTypes = {
        filterId: PropTypes.array
    };

    constructor(props){
        super(props);
    }

    handleOnLookupChange(param) {
        super.handleOnChange(param);
    }

    buildField() {
        let {schema, value, error = false, filterList } = this.props;
        let object_name = schema.object_name;
        return (
            <FilterSelfLookup
                error={error}
                objName={object_name}
                value={value}
                filterList={filterList}
                placeholder={`请选择${schema.display_name}`}
                onChange={::this.handleOnLookupChange}
                schema={schema} />
        );
    }
    /**
     * [master description]
     * @param  {[type]} options [继承过来的相关 props]
     * @return {[type]}         [description]
     */
    master() {
        return <div>{this.buildField()}</div>;
    }
}

class FilterSelfLookup extends Lookup {
    static propTypes = {
    };

    constructor(props){
        super(props);
    }

    buildParam(name) {
        let { filterList = [] } = this.props;
        let param = {order_by: 'updated_at', order_flag: 'DESC', limit: 5, offset: 0};
        let view_filter = {};

        let expressions = [];
        let index = 0;
        // 构建过滤的id表达式
        filterList.forEach(val => {
            index++;
            let v = `'${val}'`;
            expressions.push(
                {
                    field: 'id',
                    operator: '!=',
                    operands: [v]
                }
            );
        });
        // 加入姓名的name表达式
        if (name) {
            let _name = `'${name}'`;
            expressions.push(
                {
                    field: 'name',
                    operator: 'CONTAINS',
                    operands: [_name]
                }
            );
        }
        // 构造关系
        const buildRelation = (n, reName) => {
            let idFilter = [];
            for (let i = 0; i < index; i++) {
                idFilter.push(i + 1);
            }

            if (reName) {
                idFilter.push(index + 1);
            }
            return idFilter.join(' AND ');
        };

        view_filter = {
            filter_from: 'all',
            filter: {
                expressions,
                logical_relation: buildRelation(index, name)
            }
        };
        if (index || name) {
            param.view_filter = JSON.stringify(view_filter);
        }
        return param;
    }

    render() {
        return super.render();
    }
}
