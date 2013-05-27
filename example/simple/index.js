var Build = require('../../src');

var files = [
	{
		path: '/simple.js',
		text: 'module.exports = simple example with no dependencies'
	}
];

new Build('simple', '/simple.js')
	.use('transform')
	.use('development')
	.use('umd')
	.use(function (code, next) {
		console.log(code)
	})
	.send(files)