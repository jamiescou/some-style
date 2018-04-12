export default {
    "classid":"hth328jlkncantbi9ny4lsor",
    "org":"meiqia",
    "classname":"leads",
    "schema":[
        {
            "name": "id",
            "type": "objid",
            "visible": "readonly",
            "label": "对象唯一标识"

        },

        {
            "name": "name",
            "type": "text",
            "visible": "edit",
            "label": "名称"
        },

        {
            "name": "salutation",
            "type": "text",
            "visible": "edit",
            "label": "称谓"
        },

        {
            "name": "gender",
            "type": "picklist",
            "options": [
                "男",
                "女",
                "未知"
            ],
            "visible": "edit",
            "label": "性别"
        },

        {
            "name": "mobile_phone",
            "type": "phone",
            "visible": "readonly",
            "label": "手机号码"
        },

        {
            "name": "phone",
            "type": "phone",
            "visible": "readonly",
            "label": "电话号码"
        },

        {
            "name": "email",
            "type": "email",
            "visible": "readonly",
            "label": "电子邮件"
        },

        {
            "name": "birthday",
            "type": "date",
            "visible": "readonly",
            "label": "生日"
        },

        {
            "name": "account",
            "type": "text",
            "visible": "readonly",
            "label": "公司"
        },

        {
            "name": "department",
            "type": "text",
            "visible": "readonly",
            "label": "部门"
        },

        {
            "name": "title",
            "type": "text",
            "visible": "readonly",
            "label": "职务"
        },

        // todo:符合字段地址 - [国家, 省份, 城市, 街道],复合字段传递给前端的应该是什么样的?
        {
            "name": "address",
            "type": "address",
            "visible": "readonly",
            "label": "地址"
        },

        {
            "name": "industry",
            "type": "picklist",
            "visible": "readonly",
            "label": "行业",
            "options": [
                "IT",
                "教育"
            ]
        },

        // todo:货币类型的字段 schema 还需要什么信息
        // 由2个字段组成，3个字母标识货币种类，decimal表示金额
        {
            "name": "annual_revenue",
            "type": "currency",
            "visible": "readonly",
            "label": "年收入"
        },

        {
            "name": "employee_number",
            "type": "integer",
            "visible": "readonly",
            "label": "员工数"
        },

        {
            "name": "website",
            "type": "url",
            "visible": "readonly",
            "label": "网址"
        },

        {
            "name": "lead_status",
            "type": "picklist",
            "visible": "readonly",
            "label": "线索状态",
            "options": [
                "未领取",
                "已确认",
                "已领取",
                "已转化"
            ]
        },

        {
            "name": "lead_source",
            "type": "picklist",
            "visible": "readonly",
            "label": "线索来源",
            "options": [
                "来源1",
                "来源2",
                "来源3"
            ]
        },

        {
            "name": "lead_source",
            "type": "rating",
            "visible": "readonly",
            "label": "线索质量",
            "options": [
                "高",
                "中",
                "低"
            ]
        },

        // todo: 外键关系是什么样的
        {
            "name":"record_type",
            "type":"foreign_key",
            "visible":"edit",
            "label": "记录类型"
        },

        // todo: 外键关系是什么样的
        {
            "name":"campaign",
            "type":"foreign_key",
            "visible":"edit",
            "label": "市场活动"
        },

        // todo: 外键关系是什么样的
        {
            "name":"owner_id",
            "type":"foreign_key",
            "visible":"edit",
            "label": "线索所有人"
        },

        {
            "name":"last_returned_reason",
            "type":"combobox",
            "visible":"edit",
            "label": "上次退回原因"
        },

        {
            "name": "description",
            "type": "longtext",
            "visible": "readonly",
            "label": "备注"
        },

        // todo: 外键关系是什么样的
        {
            "name": "created_by",
            "type": "foreign_key",
            "visible": "readonly",
            "label": "创建人"
        },

        {
            "name": "created_date",
            "type": "datetime",
            "visible": "readonly",
            "label": "创建日期"
        },

        {
            "name": "Last_transfered_date",
            "type": "datetime",
            "visible": "readonly",
            "label": "上次转移日期"
        },

        {
            "name": "last_modified_date",
            "type": "datetime",
            "visible": "readonly",
            "label": "线索上次退回时间"
        },

        {
            "name": "last_returned_date",
            "type": "datetime",
            "visible": "readonly",
            "label": "最近修改日期"
        },

        {
            "name": "returned_times",
            "type": "integer",
            "visible": "readonly",
            "label": "退回公海次数"
        },
        {
            "name": "theme",
            "type": "subobjet",
            "visible": "readonly",
            "label": "主题",
            "options": {
                "0g7wkqttrl13bdi6w6h66flxr": '电话',
                "0g7wkqttrl13bdi6w6h66flxr2": '事件',
                "0g7wkqttrl13bdi6w6h66flxr3": '其它',
            }
        },

        // todo: 外键关系是什么样的
        {
            "name": "territory",
            "type": "foreign_key",
            "visible": "readonly",
            "label": "所在公海"
        },

        // todo: 外键关系是什么样的
        {
            "name": "last_territory",
            "type": "foreign_key",
            "visible": "readonly",
            "label": "上次所在公海"
        },

        // todo: 外键关系是什么样的
        {
            "name": "last_modified_by",
            "type": "foreign_key",
            "visible": "readonly",
            "label": "最近修改人"
        }
    ]
}