
var build = require('..')
var fs = require('fs')

var files = require('./in.json')

var code = build(files)

console.log(code)
fs.writeFileSync(__dirname+'/out.js', code)
fs.writeFileSync(__dirname+'/index.html', '<script src="out.js"><\/script>')
