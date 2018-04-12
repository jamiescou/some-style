import Koa from 'koa';
import R from './router';

const port = 8555;
const app = new Koa();

R.init(app);

app.listen(port);

console.log(`Application started on port: ${port}`);
