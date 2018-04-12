import fs from 'fs';
import path from 'path';

const STATS_PATH = path.resolve(__dirname, '../../server/stats/webpack-app.json');

// 只影响生成的stats文件
export default function(stats) {
    // get chunks by name and extensions
    const getChunks = function(name, ext) {
        ext = ext || /.js$/;
        let chunks = json.assetsByChunkName[name];

        // a chunk could be a string or an array, so make sure it is an array
        if (!(Array.isArray(chunks))) {
            chunks = [chunks];
        }

        return chunks
            .filter(chunk => ext.test(path.extname(chunk))) // filter by extension
            .map(chunk => `${publicPath}${chunk}`); // add public path to it
    };
    
    const publicPath = this.options.output.publicPath;
    const json = stats.toJson();

    const content = {
        app:{
            script: getChunks('app', /js/),
            style: getChunks('app', /css/)
        }
    };

    fs.writeFileSync(STATS_PATH, JSON.stringify(content));
}
