var should = require('chai').should()
  , expect = require('chai').expect
  , Build = require('../src')
  , path = require('path')
  , vm = require('vm')
  , write = require('fs').writeFileSync

describe('the production plugin', function (build) {
	it('should load', function () {
		var build = new Build()
			.use('transform')
			.use('production')
			.plugin('component')

		build._handlers.should.have.a.lengthOf(4)
		build.stack.should.have.a.lengthOf(2)
	})

	beforeEach(function () {
		build = new Build('production')
			.use('transform')
			.use('production')
			.plugin('component')
	})

	it('should produce runnable output', function (done) {
		var p = path.join(__dirname, '../example/component/rack/component.json')
		build.include(p).use(function (code, next) {
			// uncomment if you want to try running the code in a browser
			// write(__dirname+'/tmp/file.js', code)
			var a = {}
			vm.runInNewContext(code, a)
			a.should.have.property('modules')
				.that.is.a('array')
			a.should.have.property('require')
				.that.is.a('function')
			next()
		}).run(function () {done()})
	})
})