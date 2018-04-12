// 字段 operator 可能出现的几种条件
//"EQUALS",等于
//"NOT_EQUAL",不等于
//"LESS_THAN",小于
//"GREATER_THAN",大于
//"LESS_OR_EQUAL",小于等于
//"GREATER_OR_EQUAL",大于等于
//"CONTAINS",包含
//"NOT_CONTAIN",不包含
//"STARTS_WITH",起始于

// export default [
//     {
//         org: 'meiqia',
//         classid: 'hth328jlkncantbi9ny4lsor',
//         classname: "leads",
//         // 视图名称
//         listViewName: "My Views",
//         // 视图 api,还没想明白是用在哪里
//         listViewApi: "the_poor_opportunities",
//         // 字段筛选条件
//         listViewFieldCriteria: [
//             {
//                 label: '称谓',
//                 // 筛选的字段
//                 field: 'salutation',
//                 // 此筛选字段类型
//                 fieldType: 'text',
//                 // 运算符
//                 operator: 'GREATER_THAN',
//                 // 运算对象,也就是此字段的筛选值,salesforce 中这个字段支持 string 和 array,暂时我还没想到哪中情况下需要 array,暂时先都使用 string
//                 operands: 'who am i'
//             },
//             {
//                 label: '名字',
//                 // 筛选的字段
//                 field: 'salutation',
//                 // 此筛选字段类型
//                 fieldType: 'text',
//                 // 运算符
//                 operator: 'GREATER_THAN',
//                 // 运算对象,也就是此字段的筛选值,salesforce 中这个字段支持 string 和 array,暂时我还没想到哪中情况下需要 array,暂时先都使用 string
//                 operands: 'salesforce'
//             }
//         ],
//         // 显示数据范围,只有我的和全部的两种范围
//         listViewScope:{
//             apiName: 'everything',      // everything 全部, mine 我的
//             label: '全部潜在客户'
//         },
//         // 筛选逻辑,提交的时候需要校验
//         booleanFilterLogic: '1 AND 2'
//     }
// ];

export default {
    "code": 0,
    "body": {
        "default_view_filter": "view_name",
        "view_filters": {
            "view_name": {
                "display_name": "aip_name",
                "visual_to": "personal", // 个人或公共可见  or "public"
                "filter_from": "everying", // 从个人或所有数据中筛选  or "personal"
                "expressions": [{
                    "display_name": "性别", // 表达式显示名称
                    "field": "Gender", // 要筛选的字段名称
                    "operator": "CONTAINS", // ">", "STARTSWITH"
                    "operands": ["male"] // 等于（范围）需要 2 个值
                },{
                    "display_name": "线索名称", // 表达式显示名称
                    "field": "Name", // 要筛选的字段名称
                    "operator": "INRANGE", // ">", "STARTSWITH"
                    "operands": ["name"] // 等于（范围）需要 2 个值
                },{
                    "display_name": "网址", // 表达式显示名称
                    "field": "Website", // 要筛选的字段名称
                    "operator": "==", // ">", "STARTSWITH"
                    "operands": ["www.baidu.com"] // 等于（范围）需要 2 个值
                }],
                "logical_relation": "2 OR 1"
            }
        }
    }
}
