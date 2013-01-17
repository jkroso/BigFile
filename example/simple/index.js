var Build = require('../../src');

new Build('simple')
	.include('./simple.js')
	.use(function (files, next) {
		console.log(files.slice())
	})
	.run()