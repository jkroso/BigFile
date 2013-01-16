var Build = require('../../src');

new Build()
.include('./simple.js')
.use(function (files, next) {
	console.log(files.slice())
	next(files)
})
.run()