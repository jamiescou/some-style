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
                "optionalButtons": [
                    {
                        "name": "新建",
                        "action": {
                            "type": "modal",
                            "modalName": "create",
                            "fields": [
                              
                            ]
                        }
                    }
                ]
            }
        },
        "uruzz6we3sxba83wz3o0qkt9": {
            "display": "show",
            "name": "dataTable",
            "type": "",
            "config": {
                "fields": [
                    "name",
                    "Calculate",
                    "CheckBox",
                    "Combox",
                    "Currency",
                    "DateTime",
                    "Double",
                    "Email",
                    "Hierarchy",
                    "Integer",
                    "LongText",
                    "MultiPickList",
                    "Percent",
                    "Phone",
                    "PickList",
                    "RichText",
                    "Text",
                    "TextArea",
                    "URL",
                    "address",
                    "lookup",
                    "master",
                    "summarydetail",
                ]
            }
        }
    },
    "layout": {
        // 控制布局之间的自合方式
        "compoundMode": "vetical",
        "children": [
            {
                "id": "yvdqik3e9lbwr4swbj2d42t9"
            },
            {
                "id": "uruzz6we3sxba83wz3o0qkt9"
            }
        ]
    }
};