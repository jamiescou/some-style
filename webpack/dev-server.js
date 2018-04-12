require("babel-register");

var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');

var config = require('./dev.config.babel');

var compiler = webpack(config.webpack);
var devServer = new WebpackDevServer(compiler, config.server.options);

devServer.listen(config.server.port, config.server.host, function() {
    console.log('webpack-dev-server listen on port %s', config.server.port);
});
