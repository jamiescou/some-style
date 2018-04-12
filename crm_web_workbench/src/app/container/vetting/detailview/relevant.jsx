import React, { Component } from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import PropTypes from 'prop-types';

import { fetchObj } from 'redux/reducers/standard-object/detailview/data';
import { fetchSchema } from 'redux/reducers/standard-object/schema';

import ErrorNotify from 'container/share/error/error-notify';
import style from 'styles/modules/vetting/detail.scss';

import {
    EditItem
} from './components';

@connect(
    state => ({
        data: state.getIn(['vetting', 'detailview', 'data']),
        schema: state.getIn(['standardObject', 'schema'])
    }),
    dispatch => bindActionCreators({ fetchObj, fetchSchema }, dispatch)
)
export default class Relevant extends Component {
    static propTypes = {
        data: PropTypes.object.isRequired, // 数据源
        fetchObj: PropTypes.func, // 获取数据的方法
        fetchSchema: PropTypes.func, // 获取schema
        schema: PropTypes.object
    };

    constructor(){
        super();
        this.state = {
            fields: null
        };
    }

    componentDidMount() {
        let { data } = this.props;
        let RelationId = data.getIn(['Aw', 'RelationId']);
        let RelationType = data.getIn(['Aw', 'RelationType']);
        let request = null;
        if (RelationId){
            request = [
                this.props.fetchObj(RelationType, RelationId),
                this.props.fetchSchema(RelationType)
            ];
        } else {
            request = [
                this.props.fetchSchema(RelationType)
            ];
        }
        Promise.all(
            request
        ).then(() =>{}, err => ErrorNotify(err));
    }

    renderEditable() {
        let { data, schema } = this.props;
        let RelationType = data.getIn(['Aw', 'RelationType']);
        let CurrentPoint = data.getIn(['Aw', 'CurrentPoint']);
        let schemaRelationType = schema.get(RelationType);
        if (schemaRelationType) {
            let result={};
            let arr =[];
            let points = data.getIn(['Aw', 'Points']);
            let fieldsValue = points.getIn([CurrentPoint-1, 'FieldsValue']);
            let fields = points.getIn([CurrentPoint-1, 'Fields']);
            if (fieldsValue) {
                result = Object.assign(result, JSON.parse(fieldsValue));
            }
            if (fields) {
                fields.forEach( (v)=> {
                    if (v.indexOf('.')) {
                        arr.push(v.split('.')[0]);
                    } else {
                        arr.push(v);
                    }
                });
                arr = [...new Set(arr)];
            }
            if (arr.length) {
                return arr.map( v => {
                    return (<EditItem
                        key={v}
                        schema={schemaRelationType.get(v)}
                        title={schemaRelationType.getIn([v, 'display_name'])}
                        val={v}
                        info={result[v]}
                        edit={true} />);
                });
            }
        }
    }
    renderFields() {
        let { data, schema } = this.props;
        let RelationType = data.getIn(['Aw', 'RelationType']);
        let schemaRelationType = schema.get(RelationType);
        let fields = data.getIn(['Aw', 'Fields']);
        if (schemaRelationType) {
            let record = data.get('Record');
            let result=[];
            let fieldsValue=[];
            let fieldsReault = null;
            fields.forEach( (v)=> {
                if (v.indexOf('.')) {
                    result.push(v.split('.')[0]);
                } else {
                    result.push(v);
                }
            });
            fieldsReault = [...new Set(result)];
            if (this.state.fields) {
                fieldsReault = fieldsReault.deleteAll(this.state.fields);
            }
            fieldsReault.forEach((value) => {
                if (record.get(value) !== undefined) { // 这个位置需要显示数据为空的模板
                    fieldsValue.push(value);
                }
            });
            return fieldsValue.map(v => {
                return (<EditItem
                    key={v}
                    schema={schemaRelationType.get(v)}
                    title={schemaRelationType.getIn([v, 'display_name'])}
                    val={v}
                    info={record.get(v)}
                    edit={false} />);
            });
        }
    }

    render() {
        return (
            <article className={`mcds-card ${style.card}`}>
                <div className="mcds-card__header mcds-grid">
                    <header className="mcds-media mcds-card__media">
                        <div className="mcds-media__figure">
                            <div className={style['icon-small__wrap']}>
                                <i className="mcds-icon__seal-solid-24" />
                            </div>
                        </div>
                        <div className="mcds-media__body">
                            审批信息
                        </div>
                    </header>
                </div>
                <div className="mcds-card__body">
                    { this.renderEditable() }
                    { this.renderFields() }
                </div>
            </article>
        );
    }
}

