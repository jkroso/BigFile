var should = require('chai').should()
  , Build = require('../src')
  , path = require('path')
  , vm = require('vm')
  , write = require('fs').writeFileSync

describe('the jade plugin', function (build) {
	it('should load', function () {
		var build = new Build()
			.plugin('jade')

		build._handlers.should.have.a.lengthOf(3)
	})

	var base = path.join(__dirname, './fixtures/jade')+'/'
	var build

	beforeEach(function () {
		build = new Build('jade')
			.use('transform')
			.use('dict')
			.use('development')
			.use('umd')
			.plugin('nodeish')
			.plugin('jade')
		build.graph.use('jade')
		build.graph.use('nodeish')
	})

	it('should work with single file templates', function (done) {
		var p = base + 'index.js'
		build.include(p)
		build.run(function (code, next) {
			// uncomment if you want to try running the code in a browser
			// write(__dirname+'/tmp/file.js', code)
			var a = {}
			vm.runInNewContext(code, a)
			a.should.have.property('jade')
				.that.is.an('object')
				.that.have.property('text', '<p>uno</p>')
			done()
		})
	})

	it('should work with inherited templates', function (done) {
		var p = base + 'inherit.js'
		build.include(p)
		build.run(function (code, next) {
			// uncomment if you want to try running the code in a browser
			// write(__dirname+'/tmp/file.js', code)
			var a = {}
			vm.runInNewContext(code, a)
			a.should.have.property('jade')
				.that.is.an('object')
				.that.have.property('text', '<div><h1>inherit</h1></div>')
			done()
		})
	})
})