var Build = require('..')

var files = [
	{
		path: '/a.js',
		text: 'var text = require(\'./b\')\nvar end = "!"\nconsole.log(text + end)'
	},
	{
		path: '/b.js',
		text: 'module.exports = "hello world!"'
	}
];

new Build('simple', '/a.js')
	.use('transform')
	.use('development')
	.use('umd')
	.send(files)
	.read(console.log)