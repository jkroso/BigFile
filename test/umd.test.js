var should = require('chai').should()
  , expect = require('chai').expect
  , Build = require('../src')
  , path = require('path')
  , vm = require('vm')
  , write = require('fs').writeFileSync

describe('the umd plugin', function (build) {
	it('should load', function () {
		var build = new Build()
			.use('dict')
			.use('transform')
			.use('development')
			.use('umd')
			.plugin('component')

		build._handlers.should.have.a.lengthOf(4)
		build.stack.should.have.a.lengthOf(4)
	})

	beforeEach(function () {
		build = new Build('umd')
			.use('transform')
			.use('dict')
			.use('development')
			.use('umd')
			.plugin('component')
	})

	it.only('should be runnable', function (done) {
		var p = path.join(__dirname, '../example/component/rack/component.json')
		build.include(p).use(function (code, next) {
			// uncomment if you want to try running the code in a browser
			// write(__dirname+'/tmp/file.js', code)
			var a = {}
			vm.runInNewContext(code, a)
			a.should.have.property('umd')
				.that.is.a('function')
			next()
		}).run(function () {done()})
	})
})