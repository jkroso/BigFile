var Build = require('..')
var fs = require('fs')

var files = [
	{
		path: '/a/b/index.js',
		text: 'var text = require(\'./c\')\nvar end = "!"\nconsole.log(text + end)'
	},
	{
		path: '/a/b/c.js',
		text: 'module.exports = "hello world!"'
	}
];

new Build('simple', '/a/b')
	.use('transform')
	.use('development')
	.use('umd')
	.send(files)
	.read(function(code){
		console.log(code)
		fs.writeFileSync(__dirname+'/out.js', code)
		fs.writeFileSync(__dirname+'/index.html', '<script src="out.js"><\/script>')
	})