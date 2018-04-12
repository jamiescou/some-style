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
                    "name",
                    "MobilePhone",
                    "Phone",
                    "Account",
                    "Department",
                    "Description",
                    "LeadSource",
                    "NumberOfEmployees",
                    "Rating",
                    "Website"
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
                            "modalname": "edit",
                            "fields": [
                                "name",
                                "MobilePhone",
                                "Phone",
                                "Account",
                                "Department",
                                "Description",
                                "LeadSource",
                                "NumberOfEmployees",
                                "Rating",
                                "ReturnedTimes",
                                "Salutation",
                                "Title",
                                "Website"
                            ]
                        }
                    },
                    {
                        "name": "更改所有人",
                        "action": {
                            "type": "modal",
                            "modalname": "edit-belong",
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
                        "fields": ["name", "Department"],
                        "guidance": "<div><strong>If your lead has neither the interest nor the authority to purchase from you, mark the lead Unqualified.&nbsp;</strong><br><br>Don’t waste time on unqualified leads.<ul><li>Learn about the lead source before you spend time selling them a product they're not ready for.</li><li>Understand your lead's level of decision making authority and solution requirements.</li><li>Determine whether your lead is likely to buy from you.</li></ul></div>"
                    },
                    {
                        "fields": ["Title", "Description"],
                        "guidance": "<div><strong>Learn about and contact your new lead quickly.</strong><br><br>Use Salesforce leads to separate prospects from the Salesforce contacts you’ve already sold to.<br><br>Respond to your lead within five minutes to increase your chances of converting the lead record to an opportunity.&nbsp;<ul><li>Visit your lead’s website to learn about your lead’s business and industry.</li><li>Find your lead on social networks to determine how to best engage and connect.</li></ul></div>"
                    },
                    {
                        "fields": ["Email", "NumberOfEmployees"],
                        "guidance": "<div><strong>Verify contact information and qualify your lead.</strong><br><br>Gather as much contact information as you can. Get tips from the pros about <u>the importance of qualifying your lead</u>.<ul><li>Get your lead’s email address, phone number, and title so that you can include your lead in future campaigns.</li><li>Email your lead first, and immediately follow up with a phone call.</li><li>Rehearse your call scripts so that you sound confident and the flow of your conversation is more natural.</li></ul></div>"
                    },
                    {
                        "fields": ["Phone", "Salutation"],
                        "guidance": "<div><strong>Nurture your lead so that you’re top-of-mind.</strong><br><br>Send emails based on time intervals and your leads’ actions on our website. Nurturing leads helps to free up time to focus on other opportunities in your pipeline.<ul><li>Assign a rating to your lead based on what you’ve learned during the qualification process.</li><li>Work with marketing to add your lead to campaigns to further nurture the relationship.</li><li>Before you mark your lead Unqualified, schedule six follow-up tasks to email or call your lead.</li></ul></div>"
                    },
                    {
                        "fields": ["Gender", "Email"],
                        "guidance": "<div><strong>Nurture your lead so that you’re top-of-mind.</strong><br><br>Send emails based on time intervals and your leads’ actions on our website. Nurturing leads helps to free up time to focus on other opportunities in your pipeline.<ul><li>Assign a rating to your lead based on what you’ve learned during the qualification process.</li><li>Work with marketing to add your lead to campaigns to further nurture the relationship.</li><li>Before you mark your lead Unqualified, schedule six follow-up tasks to email or call your lead.</li></ul></div>"
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
                        "fields": ["gender", "mobile_phone"]
                    },
                    {
                        "name": "发票信息",
                        "fields": ["industry", "annual_revenue", "record_type"]
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
                    "objList": ["standard"],
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
            {
                "id": "hdm5dadspsdztku3vjxl84cxr"
            },
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