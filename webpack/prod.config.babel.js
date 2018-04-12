/* jscs:disable requireCamelCaseOrUpperCaseIdentifiers */
/* eslint camelcase: 0 */
import os from 'os';
import path from 'path';
import webpack  from 'webpack';
import HappyPack from 'happypack';
import Clean from 'clean-webpack-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import UglifyJsParallelPlugin from 'webpack-uglify-parallel';

import writeStats from './utils/write-stats';

let extractModuleCss = new ExtractTextPlugin('[name]-[hash].css');

export default {
    // devtool: 'cheap-source-map',
    // devtool: 'source-map',
    devtool: 'eval',
    entry: {
        app: './app/index.js'
    },
    output: {
        filename: '[name]-[hash].js',
        chunkFilename: '[name]-[hash].js',
        path: path.join(__dirname, '../dist'),
        publicPath: '/assets/'
    },
    bail: true,
    module: {
        loaders: [{
            test: /\.json$/,
            loader: 'json-loader'
        }, {
            test: /\.(woff|eot|ttf)$/,
            loader: 'url-loader?limit=1&name=[sha512:hash:base64:7].[ext]'
        }, {
            test: /\.(jpe?g|png|gif|ogg|mp3)$/,
            exclude: /public/,
            loaders: [
                'url-loader?limit=1&name=[sha512:hash:base64:7].[ext]',
                'image-webpack-loader?optimizationLevel=7&progressive&interlaced'
            ]
        }, {
            test: /\.js$|.jsx$/,
            exclude: [/node_modules/, /public/],
            loader: 'happypack/loader?id=jsx'
        }, { //for css-modules
            test: /\.css$|\.scss$/,
            include: [
                path.join(__dirname, '../app/styles'),
                path.join(__dirname, '../node_modules/carbon/lib')
            ],
            loader: extractModuleCss.extract('style-loader', 'css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss-loader?outputStyle=expanded&includePaths[]=' + encodeURIComponent(path.join(__dirname, '../app/styles')))
        }, { // for font
            test: /\.(ttf|eot|woff(?:2)?)(\?[a-z0-9]+)?$/,
            include: path.join(__dirname, '../node_modules/carbon/lib'),
            loader: "file-loader?limit=1&minetype=application/font-woff"
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
        require("postcss-selector-not"),
        require('postcss-nested')
    ],
    plugins: [
        new Clean([path.join(__dirname, '../dist')], {
            verbose: true,
            root: process.cwd()
        }),

        new HappyPack({
            id: 'jsx',
            loaders: ['babel?cacheDirectory'],
            cache: false
        }),

        // extract css
        extractModuleCss,

        // set env
        new webpack.DefinePlugin({
            'process.env': {
                BROWSER: JSON.stringify(true),
                NODE_ENV: JSON.stringify('production')
            }
        }),

        // new webpack.optimize.UglifyJsPlugin({
        new UglifyJsParallelPlugin({
            workers: os.cpus().length,
            sourceMap: false,
            compress: {
                warnings: false,
                screw_ie8: true,
                sequences: true,
                dead_code: true,
                drop_debugger: true,
                comparisons: true,
                conditionals: true,
                evaluate: true,
                booleans: true,
                loops: true,
                unused: true,
                hoist_funs: true,
                if_return: true,
                join_vars: true,
                cascade: true,
                drop_console: true
            },
            output: {
                comments: false
            }
        }),

        // write webpack stats
        function() {
            this.plugin('done', writeStats);
        }
    ],
    resolve: {
        extensions: ['', '.js', '.json', '.jsx'],
        modulesDirectories: ['node_modules', 'app']
    }
};
