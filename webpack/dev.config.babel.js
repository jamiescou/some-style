import path from 'path';
import webpack from 'webpack';
import HappyPack from 'happypack';

import writeStats from './utils/write-stats';
import startKoa from './utils/start-koa';

import apiConfig from '../config/apiconfig/config-now';
// 只是开发工具运行的端口(devserver)
const HOST = 'localhost';
const PORT = 8330;

// 使用环境变量将配置信息传到 node server，减少依赖
process.env.MEIQIA_NODE_DEV_HOSTNAME = HOST;
process.env.MEIQIA_NODE_DEV_PORT = PORT;

export default {
    server: {
        port: PORT,
        host: HOST,
        options: {
            publicPath: `http:\/\/${HOST}:${PORT}/assets/`,
            hot: true,
            stats: {
                assets: false,
                colors: true,
                version: false,
                hash: false,
                timings: true,
                chunks: false,
                chunkModules: false
            }
        }
    },
    webpack: {
        devtool: 'cheap-module-eval-source-map',
        //devtool: 'cheap-module-eval-source-map',
        entry: {
            app: [
                `webpack-dev-server/client?http:\/\/${HOST}:${PORT}`,
                'webpack/hot/dev-server',
                './app/index.js'
            ]
        },
        output: {
            path: path.join(__dirname, '../dist'),
            filename: '[name]-[hash].js',
            chunkFilename: '[name]-[hash].js',
            // 这个设计css 里面使用静态资源的路径
            publicPath: '/assets/',
        },
        module: {
            loaders: [{
                test: /\.json$/,
                loader: 'json'
            }, {
                test: /\.(jpe?g|png|gif|ogg|mp3)$/,
                exclude: [/public/],
                loader: 'url-loader?limit=1&name=[sha512:hash:base64:7].[ext]'
            }, {
                test: /\.js$|.jsx$/,
                exclude: [/node_modules/, /public/],
                loaders: ['happypack/loader?id=jsx']
            }, {
                test: /\.scss$/,
                include: [
                    path.join(__dirname, '../app/styles'),
                    path.join(__dirname, '../node_modules/carbon/lib')
                ],
                loaders:  ['happypack/loader?id=moduleCss']
            }, {
                test: /\.(ttf|eot|woff(?:2)?)(\?[a-z0-9]+)?$/,
//                test: /\.(ttf|eot|woff(?:2)?)\??.*$/,
                include: path.join(__dirname, '../node_modules/carbon/lib'),
                loader: "url-loader?limit=10000&mimetype=application/font-woff"
            }, { // for svg
                test: /\.(svg?)(\?[a-z0-9]+)?$/,
                include: path.join(__dirname, '../node_modules/carbon/lib'),
                loader: "url-loader?limit=100000000"
            }]
        },
        postcss: () => [
            require('postcss-import'),
            require('autoprefixer'),
            require('precss'),
            require('postcss-calc'),
            require('postcss-mixins'),
            require("postcss-selector-not"),
            require('postcss-nested')
        ],
        plugins: [
            // hot reload
            new webpack.HotModuleReplacementPlugin(),
            // new webpack.NoErrorsPlugin(),
            new webpack.DefinePlugin({
                'process.env': {
                    BROWSER: JSON.stringify(true),
                    NODE_ENV: JSON.stringify('development')
                }
            }),

            new HappyPack({
                id: 'jsx',
                loaders: ['react-hot', 'babel?cacheDirectory'],
                cache: false
            }),

            new HappyPack({
                id: 'moduleCss',
                loaders: [
                    'style-loader',
                    'css-loader?sourceMap&modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]',
                    'postcss-loader'
                ]
            }),

            function() {
                this.plugin('done', writeStats)
            },

            function() {
                this.plugin('done', startKoa)
            }
        ],
        resolve: {
            extensions: ['', '.js', '.json', '.jsx'],
            modulesDirectories: ['node_modules', 'app']
        }
    }
};
