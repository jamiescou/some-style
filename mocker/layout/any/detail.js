export default {
    // layout id 我们需要提供给用户几种不同版本的 layout
    "id": "847wdc8uwm8olot203rspp66r",
    "org": "meiqia",
    "classid": "dazhw9hyoveiqwxydqsg1ra4i",
    "page": "detail",
    // 每个组件有一个 id, layout 中只存放 id,具体的组件信息放到这里,可以理解为这是个组件库描述
    "components": {
        // 高亮面板
        "lsgzn06tegqw18r8o72qvkj4i": {
            "visible": "visible",
            "name": "pageHeader",
            // 每种组件有特定的几种类型，此字段用于确定使用的是哪种类型，举例如 page-header 在 viewlist 和 detail 页面都有使用
            "type": "",
            "config": {
                // fields 控制该组件内使用到的字段
                "fields": [
                    "name"
                ],
                "defaultButtons": {
                    "name": "领取线索",
                    "visible": "visible",
                    "action": {
                        "type":"api",
                        "method": {
                            "type": "delete",
                            "url": "relatedlist/attachment"
                        },
                        "param": {
                            "data":[
                                "id",
                                "name"
                            ]
                        }
                    }
                },
                // 可选按钮,关联的 action，此处待定
                "optionalButtons": [
                    {
                        "name": "编辑",
                        "action": {
                            "type": "modal",
                            "modalName": "edit",
                            "fields": [

                            ]
                        }
                    },
                    {
                        "name": "更改所有人",
                        "action": {
                            "type": "modal",
                            "modalName": "edit-belong",
                            "fields": [
                                "owner_id"
                            ]
                        }
                    },
                    {
                        "name": "转为客户",
                        "action": {
                            "type": "modal",
                            "modalName": "edit-role-conver",
                            "fields": [
                                "name"
                            ]
                        }
                    }
                ]
            }
        },
        // 路径
        "hdm5dadspsdztku3vjxl84cxr": {
            "visible": "visible",
            "name": "process",
            "config": {
                // 路径名
                "processName": "这是一个路径名",
                // 记录类型
                "recordType": "leads_record",
                // 关联选项
                "relatedField": "LeadStatus",
                // 每个阶段的字段和指导说明
                "steps": [
                    {
                        "fields": ["name"],
                        "guidance": "<div>这里你能明白么</div>"
                    },
                    {
                        "fields": ["name"],
                        "guidance": "<div>1.看懂了说明你明白了</div><div>2.没有看懂你就继续看吧</div>"
                    },
                    {
                        "fields": ["name"],
                        "guidance": "<div>1.看到这里已经明白了</div>"
                    },
                    {
                        "fields": ["name"],
                        "guidance": "<div>1.都到了最后一步了,不用我说什么了吧</div>"
                    },
                    {
                        "fields": ["name"],
                        "guidance": "<div>1.都到了最后一步了,不用我说什么了吧</div>"
                    }
                ]
            },
            "type": "",
            "actions": []
        },
        // 活动记录
        "0g7wkqttrl1rhdi6w6h66flxr": {
            "visible": "visible",
            "name": "activationRecord",
            "type": "",
            "fields": [],
            "actions": []
        },
        // tab
        "0g7wkqttrl1rhdi6w6h66flxa": {
            "visible": "visible",
            "name": "tab",
            "type": "",
            "config": {
                "theme":[
                    {
                        "themeID": '0g7wkqttrl13bdi6w6h66flxr',
                        "content": '电话',
                        // icon 字段先预留,可能会有自定义图标的时候
                        "icon": 'phone'
                    },
                ],
            },
            "fields": [],
            "actions": []
        },
        // 详细信息
        "92snjkjprt3ksiufjkzk3mcxr": {
            "visible": "visible",
            "name": "detailInfo",
            "type": "",
            "config": {
                // 详细信息带分组的概念,默认有个
                "defaultGroups": [
                    "name",
                    "salutation"
                ],
                // 可以自己添加分组的字段
                "groups": [
                    {
                        "name": "地址信息",
                        "fields": ["id", "name"]
                    },
                    {
                        "name": "发票信息",
                        "fields": ["id", "name"]
                    }
                ]
            }
        },
        // 相关列表
        "13f7rt5a82qxanyh3j1qicz0k9": {
            "visible": "visible",
            "name": "relatedList",
            "config": [
                {
                    "type": "attachment",
                    // 属于 card 的按钮
                    "buttons": [
                        {
                            "name": "上传",
                            "action": {}
                        }
                    ]
                },
                {
                    // 备注
                    "type": "comment",
                    "texts": [
                        {
                            "title": "Title",
                            "content": "<div>What is this?</div>"
                        },
                        {
                            "title": "Ding",
                            "content": "<div>This is Ding</div>"
                        }
                    ]
                },
                {
                    "type": "cooperate",
                    // 属于记录的 button
                    "recordButtons": [
                        {
                            "name": "编辑",
                            "action": {}
                        },
                        {
                            "name": "删除",
                            "action": {}
                        }
                    ]
                },
                {
                    // 关联的其他外键对象
                    "type": "object",
                    "objList": [],
                    "buttons": [
                        {
                            "name": "New",
                            "action": {}
                        }
                    ],
                    "recordButtons": [
                        {
                            "name": "编辑",
                            "action": {}
                        },
                        {
                            "name": "删除",
                            "action": {}
                        }
                    ]
                }
            ]
        }
    },
    "layout": {
        // 控制布局之间的自合方式
        "compoundMode": "vertical",
        "children": [
            {
                "id": "lsgzn06tegqw18r8o72qvkj4i"
            },
            // {
            //     "id": "hdm5dadspsdztku3vjxl84cxr"
            // },
            {
                "compoundMode": "horizontal",
                "children": [
                    {
                        "width": "62%",
                        "compoundMode": "horizontal",
                        "id": "0g7wkqttrl1rhdi6w6h66flxa"
                    },
                    {
                        "width": "38%",
                        "id": "13f7rt5a82qxanyh3j1qicz0k9"
                    }
                ]
            }
        ]
    }
}