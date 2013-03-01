var should = require('chai').should()
  , Build = require('../src')
  , path = require('path')
  , vm = require('vm')
  , write = require('fs').writeFileSync

describe('the jade plugin', function (build) {
	it('should load', function () {
		var build = new Build('jade', []).plugin('jade')
		build._handlers.should.have.a.lengthOf(1)
	})

	it('should work with single file templates', function (done) {
		var files = require('./fixtures/jade-simple.js')
		var b = new Build('jade', files)
			.use('transform')
			.use('dict')
			.use('development')
			.use('umd')
			.plugin('javascript')
			.plugin('jade')
			.use(function (code) {
				// uncomment if you want to try running the code in a browser
				// write(__dirname+'/tmp/file.js', code)
				var a = {}
				vm.runInNewContext(code, a)
				a.should.have.property('jade')
					.that.is.an('object')
					.that.have.property('text', '<p>uno</p>')

				done()
			})
			b.entry = '/jade/index.js'
			b.run()
	})

	// I don't need this atm
	it.skip('should work with inherited templates', function (done) {
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