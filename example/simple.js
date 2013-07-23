var Build = require('..')

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
	.send(files)
	.read(function(code){
		console.log(code)
	})