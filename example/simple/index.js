var Build = require('../../src');

var files = [
	{
		path: '/simple.js',
		text: 'module.exports = simple example with no dependencies'
	}
];

var build = new Build('simple', files)
build.entry = '/simple.js'

build
	.plugin('javascript')
	.use('transform')
	.use('dict')
	.use('development')
	.use('umd')
	.use(function (code, next) {
		console.log(code)
	})
	.run()