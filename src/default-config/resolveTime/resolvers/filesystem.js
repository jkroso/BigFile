var detectSeries = require('async').detectSeries,
    readFile = require('SourceGraph/src/file.js').readLocal,
    variants = require('SourceGraph/src/file.js').variants,
    dirname = require('path').dirname,
    join = require('path').join,
    fs = require('fs'),
    core = dirname(require.resolve('SourceGraph'))+'/node_modules/'

var node_core = [
    'assert', 'buffer_ieee754', 'buffer', 'child_process', 'cluster', 'console',
    'constants', 'crypto', '_debugger', 'dgram', 'dns', 'events', 'freelist',
    'fs', 'http', 'https', '_linklist', 'module', 'net', 'os', 'path',
    'punycode', 'querystring', 'readline', 'repl', 'stream', 'string_decoder',
    'sys', 'timers', 'tls', 'tty', 'url', 'util', 'vm', 'zlib'
].reduce(function (acc, x) { acc[x] = true; return acc }, {});

module.exports = [
    function node_modules (dir, name, done) {
        // In node core modules take priority over custom
        if (node_core[name]) {
            readFile(core+name+'.js').finish(done)
        } 
        else {
            var names = variants(name).map(function (name) {
                return join(dir, 'node_modules', name)
            })
            if (!names[0].match(/\.\w+$/)) names.shift()
            names.push(join(dir, 'node_modules', name, 'package.json'))
            detectSeries(names, fs.exists, function(winner){
                if (winner) {
                    readFile(winner).finish(done)
                } 
                else {
                    done()
                }
            })
        }
    },
    function components (dir, name, done) {
        var name = join(dir, 'components', name, 'component.json')
        fs.exists(name, function (bool) {
            if (bool) {
                readFile(name).finish(function (file) {
                    done(file)
                })
            } 
            else {
                done()
            }
        })
    },
]