import co from 'co';
import render from 'koa-ejs';
import path from 'path';
import proxy from 'koa-proxy';
import mount from 'koa-mount';
import helmet from 'koa-helmet';
import logger from 'koa-logger';
import staticCache from 'koa-static-cache';
import responseTime from 'koa-response-time';

import apiConfig from '../../config/apiconfig/config-now';

const appsConfig = require("../../../dev-config/apps.config");

const conditional = require('koa-conditional-get');
const etag = require('koa-etag');
const compressor = require('koa-compressor');
const convert = require('koa-convert');

const mocker = require('node-mocker');
const viewsPath = path.join(__dirname, '../views');
const publicPath = path.join(__dirname, '../public');
const distPath = path.join(__dirname, '../../../dist');
const env = process.env.NODE_ENV || 'development';

export default {
    init: (app) => {
        // ejs tpl
        render(app, {
            root: viewsPath,
            layout: 'layout',
            viewExt: 'html',
            cache: false,
            debug: true
        });
        app.context.render = co.wrap(app.context.render);

        // add header `X-Response-Time`
        app.use(convert(responseTime()));

        // add log
        app.use(convert(logger()));

        // various security headers
        app.use(convert(helmet()));

        if (env === 'production') {
            app.use(convert(conditional()));
            app.use(convert(etag()));
            app.use(convert(compressor()));
        }

        // static
        app.use(convert(mount('/public', staticCache(publicPath, {}))));

        let backends = [
            {
                prefix: '/dml',
                backend_prefix: '',
                host: apiConfig.dmlHost
            },
            {
                prefix: '/ddl',
                backend_prefix: '',
                host: apiConfig.ddlHost
            },
            {
                prefix: '/acl',
                backend_prefix: '',
                host: apiConfig.aclHost
            },
            {
                prefix: '/layout',
                backend_prefix: '',
                host: apiConfig.layoutHost
            },
            {
                prefix: '/login',
                backend_prefix: '',
                host: apiConfig.loginHost
            },
            {
                prefix: '/tenant-gateway',
                backend_prefix: '',
                host: apiConfig.tenantHost
            },
            {
                prefix: '/approval',
                backend_prefix: '',
                host: apiConfig.approvalHost
            },
            {
                prefix: '/file',
                backend_prefix: '',
                host: apiConfig.fileHost
            },
            {
                prefix: '/enterprise',
                backend_prefix: '',
                host: apiConfig.enterpriseInfoHost
            },
            {
                prefix: '/image',
                backend_prefix: '',
                host: apiConfig.imageHost
            },
            {
                prefix: '/feedback',
                backend_prefix: '',
                host: apiConfig.feedbackHost
            }
        ];

        // proxy backend api
        app.use(convert(mocker({
            mode: false,
            backends
        })));

        // dist 目录,开发和正式环境都需要
        if (env === 'development') {
            // Proxy asset folder to webpack development server in development mode
            app.use(convert(proxy({
                host: `http://${appsConfig.devServer.host}:${appsConfig.devServer.port}`,
                match: /^\/assets\//
            })));

        } else {
            app.use(convert(mount('/assets', staticCache(distPath, {}))));
        }
    }
};
