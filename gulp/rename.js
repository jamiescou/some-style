var path = require('path')
    , fs = require('fs')
    , through = require('through2')
    , crypto = require('crypto');

module.exports = function(options) {
    var separator,
        size;

    if (typeof options === 'object') {
        separator = options.separator || '_';
        size = options.size | 0;
    } else {
        size = options | 0;
        separator = '_';
    }

    var filesMap = {};

    return through.obj(function(file, enc, cb) {
        if (file.isStream()) {
            return cb();
        }

        var md5Hash = calcMd5(file, size),
            filename = path.basename(file.path),
            dir;
        var _oldFileName = filename;
        filesMap[_oldFileName] = '';

        if (file.path[0] == '.') {
            dir = path.join(file.base, file.path);
        } else {
            dir = file.path;
        }
        dir = path.dirname(dir);

        filename = filename.split('.').map(function(item, i, arr) {
            return i == arr.length - 2 ? item + separator + md5Hash : item;
        }).join('.');

        filesMap[_oldFileName] = filename;

        file.path = path.join(dir, filename);

        this.push(file);
        cb();
    }, function(cb) {
        cb();
    }).on('end', function() {
        if (options.outMap) {
            fs.writeFileSync(options.outMap, JSON.stringify(filesMap));
        }
    });
};


function calcMd5(file, slice) {
    var md5 = crypto.createHash('md5');
    md5.update(file.contents, 'utf8');

    return slice > 0 ? md5.digest('hex').slice(0, slice) : md5.digest('hex');
}