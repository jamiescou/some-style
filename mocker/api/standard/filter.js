

export default {
    "code": 0,
    "body": {
        "default": "view_name",
        "view_filters": {
            "view_name": {
                "display_name": "aip_name",
                "visible_to": "personal", // 个人或公共可见  or "public"
                "filter_from": "everying", // 从个人或所有数据中筛选  or "personal"
                "expressions": [{
                    "display_name": "性别", // 表达式显示名称
                    "field": "Gender", // 要筛选的字段名称
                    "operator": "CONTINTS", // ">", "STARTSWITH"
                    "operands": ["male"] // 等于（范围）需要 2 个值
                }],
                "logical_relation": "2 OR 1"
            }
        }
    }
}
