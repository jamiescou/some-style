import fs from 'fs';
import path from 'path';

import list from '../api/leads';

const router = require('koa-router')();

// 审批流列表页 方便测试 直接写死地址
router.get('/api/v1.0/meiqia/vetting/query', async (ctx) => {
    const STATS_PATH = path.resolve(__dirname, '../api/vetting/list.json');
    let list = require(`../api/vetting/list`);
    let listType = ctx.query.listType;
    let result = list.find( (item)=>item.ListType == listType)
    fs.writeFile(STATS_PATH, JSON.stringify(list), function(err){
        if(err){
            throw new Error('error');
        }    
    })
    ctx.body = {
        response: 'success',
        body: result
    };
})

//审批流审批选项 
router.get('/api/v1.0/meiqia/vetting/edit', async (ctx) => {
    let query = ctx.query;
    let STATS_PATH = path.resolve(__dirname, '../api/vetting/list.json');
    let list = fs.readFileSync(STATS_PATH, 'utf8');
    list = JSON.parse(list)
    list.map( (item, index) => {
        if(item.ListType == query.listType){
            return item.awList.map( (item, index) => {
                if(item.AwId == query.AwId){
                    item.Status = query.status;
                }
            })
        }
        return item;
    });
    fs.writeFile(STATS_PATH, JSON.stringify(list), function(err){
        if(err){
            throw new Error('error');
        }    
    })
    ctx.body = {
        response: 'success',
        code: 0,
        body: query
    }
})
//审批详情页
router.get('/api/v1.0/meiqia/vetting/:objid', async (ctx) => {
    let list = require(`../api/vetting/detail`);
    console.log(ctx.params)
    let result = list.find(l => l.id === ctx.params.objid);
    ctx.body = {
        response: 'success',
        body: result
    };
})

// 用于视图列表页面根据各种查询条件来查询
//http://localhost:8555/meiqia/leads/listView/filter
router.get('/api/v1.0/meiqia/:objName/listView/filter', async (ctx) => {
    let filter = require(`../api/${ctx.params.objName}/filter`);
    ctx.body = {
        response: 'success',
        body: filter
    };
});



// 用于视图列表页面根据各种查询条件来查询
router.get('/api/v1.0/meiqia/:objName/query', async (ctx) => {
    let query = ctx.query;

    let list = require(`../api/${ctx.params.objName}`);
    ctx.body = {
        response: 'success',
        body: list
    };
});

router.get('/api/v1.0/meiqia/schema/:objName', async (ctx) => {
    let objName = ctx.params.objName;
    let page = ctx.params.page;
    let res = require(`../schema/${objName}.js`);
    ctx.body = {
        response: 'success',
        body: res
    };
});

// 用于详细页面获取单条对象数据
router.get('/api/v1.0/meiqia/:objName/:objid', async (ctx) => {
    let list = require(`../api/${ctx.params.objName}`);
    
    let result = list.find(l => l.id === ctx.params.objid);
    ctx.body = {
        response: 'success',
        body: result
    };
});

//http://localhost:8555/meiqia/leads/layout/detail
router.get('/api/v1.0/meiqia/:objName/layout/:page', async (ctx) => {
    let defaultObjs = ['leads', 'standard'];
    let objName = ctx.params.objName;
    let page = ctx.params.page;

    if (defaultObjs.indexOf(objName) === -1) {
        objName = 'any';
    }
    let res = require(`../layout/${objName}/${page}.js`);
    ctx.body = {
        response: 'success',
        body: res
    };
});

router.get('/api/v1.0/meiqia/createFilter', async (ctx, next) => {
    await next();
    let ary = null;
    let param = null;
    const STATS_PATH = path.resolve(__dirname, '../api/view-filter/filter-object.json');
    let result = fs.readFileSync(STATS_PATH);
    let data = JSON.parse(ctx.query.objects);
    try {
        result = JSON.parse(result);
        result.push(data);
    } catch (e){
        ary = [data];
    }
    if (ary) {
        param = JSON.stringify(ary);
    } else {
        param = JSON.stringify(result);
    }

    fs.writeFile(STATS_PATH, param, function(err){
        if(err){
            throw new Error('error');
        }
    })
    ctx.body = {
        code: 0,
        message: 'success'
    };
});

router.get('/api/v1.0/meiqia/deleteFilter', async (ctx, next) => {
    await next();
    const STATS_PATH = path.resolve(__dirname, '../api/view-filter/filter-object.json');
    let result = JSON.parse(fs.readFileSync(STATS_PATH));
    for(let key in result){
        if (result[key].name === ctx.query.objects) {
            result.splice(key, 1);
        }
    }
    fs.writeFile(STATS_PATH, JSON.stringify(result), function(err){
        if(err){
            throw new Error('error');
        }
    })
    ctx.body = {
        code: 0,
        message: 'success'
    };
});

router.get('/api/v1.0/meiqia/updateFilter', async (ctx, next) => {
    await next();
    const STATS_PATH = path.resolve(__dirname, '../api/view-filter/filter-object.json');
    let result = JSON.parse(fs.readFileSync(STATS_PATH));
    let param = ctx.query.objects;
    for(let key in result){
        if (result[key].name === param.name) {
            result[key].view_filter = param.view_filter;
        }
    }

    fs.writeFile(STATS_PATH, JSON.stringify(result), function(err){
        if(err){
            throw new Error('error');
        }
    })
    ctx.body = {
        code: 0,
        message: 'success'
    };
});


// router.get('/api/v1.0/meiqia/vetting/query', async (ctx) => {

//     let list = require(`../api/vetting`);

//     ctx.body = {
//         response: 'success',
//         ...list
//     };
// });
 
// router.get('/api/v1.0/meiqia/vetting/:objid', async (ctx) => {
//     let list = require(`../api/vetting`);

//     let result = list.find(l => l.id === ctx.params.objid);
//     ctx.body = {
//         response: 'success',
//         body: result
//     };
// });

export default {
    init: (app) => {
        app
            .use(router.routes())
            .use(router.allowedMethods());
    }
};
