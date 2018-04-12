export default {
    "id": "9fdafqetm42wqm46csku1h5mi",
    "org": "meiqia",
    "classid": "cq2vrzg0o6wztk7rhsjlwhfr",
    "page": "list",
    "components": {
        "yvdqik3e9lbwr4swbj2d42t9": {
            "display": "show",
            "name": "pageHeader",
            "type": "",
            "config": {
                "optionalButtons": [{
                    "name": "新建",
                    "action": {
                        "type": "modal",
                        "modalName": "create",
                        "fields": [
                            "name",
                            "Account",
                            "Email",
                            "owner",
                            "updated_at",
                            "Gender",
                            "Description",
                            "Title",
                            "created_at"
                        ]
                    }
                // }, {
                //     "name": "批量新建",
                //     "action": {
                //         "type": 'jump',
                //         "page": 'leads/multi-add'
                //     }
                // }, {
                //     "name": "导入",
                //     "action": {
                //         "type": "modal",
                //         "modalname": "importData",
                //         "fields": []
                //     }
                // }, {
                //     "name": "导出",
                //     "action": {
                //         "type": "modal",
                //         "modalname": "importData",
                //         "fields": []
                //     }
                }]
            }
        },
        "uruzz6we3sxba83wz3o0qkt9": {
            "display": "show",
            "name": "dataTable",
            "type": "",
            "config": {
                "fields": [
                    "name",
                    "Account",
                    "Email",
                    "updated_at",
                    "Gender",
                    "ConvertedDate",
                    "NumberOfEmployees",
                    "LastViewedDate",
                    "IsConverted",
                    "created_at",
                    "MobilePhone",
                    "BirthDate",
                    "LastTransferedDate",
                    "created_by",
                    "Phone",
                    "LeadStatus",
                    "Department",
                    "LastActivityDate",
                    "LastReturnedDate",
                    "LeadSource",
                    "version",
                    "Salutation",
                    "Title",
                    "Website",
                    "id",
                    "updated_by",
                    "Description",
                    "Rating",
                    "LastReferencedDate",
                    "Industry"
                ]
            }
        }
    },
    "layout": {
        // 控制布局之间的自合方式
        "compoundMode": "vetical",
        "children": [{
            "id": "yvdqik3e9lbwr4swbj2d42t9"
        }, {
            "id": "uruzz6we3sxba83wz3o0qkt9"
        }]
    }
};
