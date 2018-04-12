
var cp = require('child_process');
var path = require('path');
var watch = require('node-watch');

var server;
var started;
var serverReload;
var SERVER_PATH = path.join(__dirname, '../../src/server/index');

function startServer() {
    // merge env for the new process
    var env = Object.assign({
        NODE_ENV: 'development'
    }, process.env);
    
    // start the server procress
    server = cp.fork(SERVER_PATH, {
        env
    });

    // when server is `online`
    server.once('message', function(message) {
        if (message.match(/^online$/)) {
            if (serverReload) {
                serverReload = false;
            }
            if (!started) {
                started = true;
                // Start watcher on server files
                // and reload browser on change
                watch(
                    path.join(__dirname, '../../src/server/'),
                    function(evt, file) {
                        console.log('restarting koa application', evt, file);
                        serverReload = true;
                        server.kill('SIGTERM');
                        return startServer();
                    }
                );
            }
        }
    });
};

// kill server on exit
process.on('exit', function(){ server.kill('SIGTERM') });

module.exports = function() {
    if (!server) {
        return startServer();
    }
}
