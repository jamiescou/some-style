import Koa from 'koa';
import R from './router';
import M from './middleware';

const port = 8332;
const app = new Koa();

M.init(app);
R.init(app);

app.listen(port);
app.on('error', err => console.log('ERROR-->', err));
console.log(`Application started on port: ${port}`);

if (process.send) {
    process.send('online');
}
