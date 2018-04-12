const router = require('koa-router')();

import apiConfig from '../config/apiconfig/config-now';

global.globalApiConfig = apiConfig;
// 每次重启给当前服务增加一个后缀 hash
global.fileHash = new Date().getTime();

// 说一下这里的静态文件处理方式的不同
// dev 环境下直接请求 /public/css.main.js public/js/xx.js
// prod 环境,gulp 打包成 xx.min.js
// fileHash 保证每次服务器有更新,客户端拿到的资源是最新的,防止缓存
// 请求来了后根据当前请求路径:ctx.path.slice(1),注意这里的请求路径,请求对应的 js 文件 <%= cdn %>/assets/xx.min.js?_=<%= fileHash %>
// css 文件请求 <%= cdn %>/assets/main.min.css?_=<%= fileHash %>

// 登录页面
router.get('/signin', async (ctx) => {
    // 注意这里 path 的获取方式,html 和 js 要跟这里的 path 名称对应
    let _accountToken = ctx.cookies.get('_accountToken');
    let _refreshToken = ctx.cookies.get('_refreshToken');

    if (_accountToken) {
        if (_refreshToken) {
            return ctx.redirect('/');
        }
        return ctx.redirect('/invite');
    }

    let path = ctx.path.slice(1);
    await ctx.render(path, {
        title: '登录',
        filename: path
    });
});

// 注册
router.get('/signup', async (ctx) => {
    let path = ctx.path.slice(1);
    await ctx.render(path, {
        title: '创建美洽团队账号',
        filename: path
    });
});

// 重置密码
router.get('/reset-password', async (ctx) => {
    let path = ctx.path.slice(1);
    await ctx.render(path, {
        title: '重置密码',
        filename: path
    });
});

// 邀请
router.get('/invite', async (ctx) => {
    let _accountToken = ctx.cookies.get('_accountToken');
    let _refreshToken = ctx.cookies.get('_refreshToken');

    if (!_accountToken) {
        return ctx.redirect('/signin');
    } else if (_refreshToken) {
        return ctx.redirect('/');
    }

    let path = ctx.path.slice(1);
    await ctx.render(path, {
        title: '邀请',
        filename: path
    });
});

// 接口调试
router.get('/object-config', async (ctx) => {
    await ctx.render('object-config', {
        layout: false,
        title: 'object-config'
    });
});

export default {
    init: (app) => {
        app
            .use(router.routes())
            .use(router.allowedMethods());

        app.use(async function (ctx) {
            let _accountToken = ctx.cookies.get('_accountToken');
            let _refreshToken = ctx.cookies.get('_refreshToken');
            if (_accountToken) {
            // refresh token 没有,就需要选择企业
                if (!_refreshToken) {
                    return ctx.redirect('/invite');
                }
            // account token 没有,需要登录
            } else {
                return ctx.redirect('/signin');
            }
            try {
                return await ctx.render('app', {
                    layout: false
                });
            } catch (error) {
                if (error.redirect) {
                    return ctx.redirect(error.redirect);
                }
                throw error;
            }
        });
    }
};
