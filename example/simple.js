var Build = require('..')
var fs = require('fs')

var files = require('./in.json');

new Build('simple', '/a/b')
  .use('transform')
  .use('development')
  .use('invoke')
  .send(files)
  .read(function(code){
    console.log(code)
    fs.writeFileSync(__dirname+'/out.js', code)
    fs.writeFileSync(__dirname+'/index.html', '<script src="out.js"><\/script>')
  })