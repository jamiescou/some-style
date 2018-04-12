/* eslint-disable */
/**
 * Created by listen1013 on 16/12/30.
 */
// import {push} from 'react-router-redux';
import React, { Component } from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import {
    Input,
    Button
} from 'carbon';

import CreateLeadsModal from '../__Modals/create-leads-modal';
import DisplayFieldsModal from '../__Modals/display-fields-modal';
import ShareSettingModal from '../__Modals/share-setting-modal';
import DeleteListviewModal from '../__Modals/delete-listview-modal';
import DataImportModal from '../__Modals/data-import-modal';
import DataMergeModal from '../__Modals/data-merge-modal';
import Filter from '../__Modals/filter';

import BaseEditor, { BuildFieldDependency } from '../share/base-field-editor/';

import BaseContext from '../share/base-field/base-field';

import test from 'carbon';
import style from 'styles/modules/home/home.scss';

import { fetchCustomerAction } from 'requests/common/actions';
import { fileUpload } from 'requests/file/file';
import { fetchItemActions } from 'redux/reducers/standard-object/action';
@connect(
    state => ({
        action: state.getIn(['standardObject', 'action']),
    }),
    dispatch => bindActionCreators({ fetchItemActions }, dispatch)
)
export default class Home extends Component {
    static propTypes = {
    };
    constructor() {
        super();
        this.Depend = BuildFieldDependency(BaseEditor);

    }
    render() {
        let Depend = this.Depend;
        return (
            <div className="mcds-text__center" style={{paddingTop: '10%'}}>
                User/68d3d9cf6db808c61822f4c9c69c1962
                version : 5
                <input type="file" id="abc" onChange={(e) => {
                        let file = e.target.files[0];
                        console.log('upload', file)
                        // console.log("e.target", e.target.files[0]);
                        let quest = fileUpload(file)();
                }} />
                <p style={{fontSize:'70px'}}>welcome to home</p>
                <img src="http://img.zcool.cn/community/01c62157e247fd0000018c1b439dbd.gif" style={{marginTop: '30px', width: '200px'}}/>
            </div>
        );
    }
}
class TextEditor extends BaseEditor {
    constructor(...args) {
        super(...args);
    }
}



var EditorTypes = {
        "Map": {
                "name": "Map",
                "display_name": "Map",
                "type": "map",
                "nullable": true,
                "readable": true,
                "writable": true
        },
        "Calculate": {
                "name": "Calculate",
                "display_name": "Calculate",
                "type": "calculated",
                "related_type": "integer",
                "expression": "STRLEN(id)",
                "readable": true
        },
        "Status": {"name":"Status","display_name":"跟进状态","type":"picklist","options":{"list":{"all":{"options_value":["未处理","已联系","已转换","关闭"]}}},"searchable":true,"default_value":{"value":"未处理"},"readable":true,"writable":true},
        "CheckBox": {
                "name": "CheckBox",
                "display_name": "abc",
                "type": "checkbox",
                "nullable": true,
                "readable": true,
                "writable": true
        },
        "Combox": {
                "name": "Combox",
                "display_name": "Combox",
                "type": "combox",
                "options": {
                        "related": "PickList",
                        "list": {
                                "Salesforce": {
                                        "options_value": [
                                                "Salesforce1",
                                                "Salesforce2",
                                                "Salesforce3"
                                        ]
                                },
                                "美洽": {
                                        "options_value": [
                                                "美洽1",
                                                "美洽2",
                                                "美洽3"
                                        ]
                                },
                                "销售易": {
                                        "options_value": [
                                                "销售易1",
                                                "销售易2",
                                                "销售易3"
                                        ]
                                }
                        }
                },
                "nullable": true,
                "readable": true,
                "writable": true
        },
        "Currency": {
                "name": "Currency",
                "display_name": "货币",
                "type": "currency",
                "nullable": true,
                "readable": true,
                "writable": true
        },
        "DateTime": {
                "name": "DateTime",
                "display_name": "日期/时间",
                "type": "datetime",
                "nullable": true,
                "readable": true,
                "writable": true
        },
        "Double": {
                "name": "Double",
                "display_name": "小数",
                "type": "double",
                "nullable": true,
                "readable": true,
                "writable": true
        },
        "Email": {
                "name": "Email",
                "display_name": "邮件",
                "type": "email",
                "nullable": true,
                "readable": true,
                "writable": true
        },
        "Hierarchy": {
                "name": "Hierarchy",
                "display_name": "Hierarchy",
                "object_name": "leads",
                "type": "hierarchy",
                "delete_option": "NoAction",
                "nullable": true,
                "readable": true,
                "writable": true
        },
        "Integer": {
                "name": "Integer",
                "display_name": "整数",
                "type": "integer",
                "nullable": true,
                "readable": true,
                "writable": true
        },
        "LongText": {
                "name": "LongText",
                "display_name": "长文本",
                "type": "longtext",
                "nullable": true,
                "readable": true,
                "writable": true
        },
        "MultiPickList": {
                "name": "MultiPickList",
                "display_name": "多选",
                "type": "mpicklist",
                "options": {
                        "related": "PickList",
                        "list": {
                                "Salesforce": {
                                        "options_value": [
                                                "Salesforce1",
                                                "Salesforce2",
                                                "Salesforce3"
                                        ]
                                },
                                "美洽": {
                                        "options_value": [
                                                "美洽1",
                                                "美洽2",
                                                "美洽3"
                                        ]
                                },
                                "销售易": {
                                        "options_value": [
                                                "销售易1",
                                                "销售易2",
                                                "销售易3"
                                        ]
                                }
                        }
                },
                "nullable": true,
                "readable": true,
                "writable": true
        },
        "Percent": {
                "name": "Percent",
                "display_name": "百分比",
                "type": "percent",
                "nullable": true,
                "readable": true,
                "writable": true
        },
        "Phone": {
                "name": "Phone",
                "display_name": "电话",
                "type": "phone",
                "nullable": true,
                "readable": true,
                "writable": true
        },
        "PickList": {
                "name": "PickList",
                "display_name": "单选",
                "type": "picklist",
                "options": {
                        "list": {
                                "all": {
                                        "options_value": [
                                                "美洽",
                                                "销售易",
                                                "Salesforce"
                                        ]
                                }
                        }
                },
                "nullable": true,
                "readable": true,
                "writable": true
        },
        "RichText": {
                "name": "RichText",
                "display_name": "富文本",
                "type": "richtext",
                "nullable": true,
                "readable": true,
                "writable": true
        },
        "Text": {
                "name": "Text",
                "display_name": "文本",
                "type": "text",
                "nullable": true,
                "readable": true,
                "writable": true
        },
        "TextArea": {
                "name": "TextArea",
                "display_name": "文本区",
                "type": "textarea",
                "nullable": true,
                "readable": true,
                "writable": true
        },
        "URL": {
                "name": "URL",
                "display_name": "URL",
                "type": "url",
                "nullable": true,
                "readable": true,
                "writable": true
        },
        "address": {
                "name": "address",
                "display_name": "地址",
                "type": "address",
                "nullable": true,
                "readable": true,
                "writable": true
        },
        "auto_id": {
                "name": "auto_id",
                "display_name": "auto_id",
                "type": "integer",
                "nullable": true
        },
        "created_at": {
                "name": "created_at",
                "display_name": "创建时间",
                "type": "datetime",
                "readable": true
        },
        "created_by": {
                "name": "created_by",
                "display_name": "创建人",
                "object_name": "User",
                "type": "external_id",
                "readable": true
        },
        "id": {
                "name": "id",
                "display_name": "ID",
                "type": "object_id",
                "readable": true
        },
        "is_deleted": {
                "name": "is_deleted",
                "type": "integer",
                "default_value": {
                        "value": "0"
                }
        },
        "lookup": {
                "name": "lookup",
                "display_name": "Look-Up",
                "type": "lookup",
                "object_name": "leads",
                "delete_option": "NoAction",
                "readable": true,
                "writable": true
        },
        "master": {
                "name": "master",
                "display_name": "Master-Detail",
                "type": "master",
                "object_name": "leads",
                "readable": true,
                "writable": true
        },
        "name": {
                "name": "name",
                "display_name": "标准对象名称",
                "type": "text",
                "index": true,
                "readable": true,
                "writable": true
        },
        "owner": {
                "name": "owner",
                "display_name": "所有者",
                "type": "external_id",
                "readable": true
        },
        "summarydetail": {
                "name": "summarydetail",
                "display_name": "SummaryDetail",
                "type": "integer",
                "readable": true,
                "writable": true
        },
        "updated_at": {
                "name": "updated_at",
                "display_name": "修改时间",
                "type": "datetime",
                "readable": true
        },
        "updated_by": {
                "name": "updated_by",
                "display_name": "修改人",
                "type": "external_id",
                "readable": true
        },
        "version": {
                "name": "version",
                "display_name": "版本",
                "type": "integer",
                "default_value": {
                        "value": "0"
                }
        },
        
}




