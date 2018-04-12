import cp from 'child_process';
import path from 'path';
import watch from 'node-watch';

let server;
let started;
let serverReload;
const SERVER_PATH = path.join(__dirname, '../../server/index');

const filter = (pattern, fn) => filename => {
    if (pattern.test(filename)) {
        fn(filename);
    }
}

const startServer = () => {
    // merge env for the new process
    const env = Object.assign({
        NODE_ENV: 'development'
    }, process.env);
    // start the server procress
    server = cp.fork(SERVER_PATH, {
        env
    });
    // when server is `online`
    server.once('message', message => {
        if (message.match(/^online$/)) {
            if (serverReload) {
                serverReload = false;
            }
            if (!started) {
                started = true;
                // Start watcher on server files
                // and reload browser on change
                watch(
                    path.join(__dirname, '../../server/'),
                    filter(/\.js|.html$/, (file) => {
                        console.log('watch file:', file);
                        if (!file.match('webpack-app.json')) {
                            console.log('restarting koa application');
                            serverReload = true;
                            server.kill('SIGTERM');
                            return startServer();
                        }
                    })
                );
            }
        }
    });
};

// kill server on exit
process.on('exit', () => server.kill('SIGTERM'));

export default function() {
    if (!server) {
        return startServer();
    }
}
