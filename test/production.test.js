var should = require('chai').should()
  , expect = require('chai').expect
  , Build = require('../src')
  , path = require('path')
  , vm = require('vm')
  , write = require('fs').writeFileSync

describe.skip('the production plugin', function (build) {
	it('should load', function () {
		var build = new Build().use('production')
		build.stack.should.have.a.lengthOf(1)
	})

	// production middleware depends on sourcegraph
	it.skip('should produce runnable output', function (done) {
		var files = require('./fixtures/nodeish.js')
		build = new Build('production', files)
			.use('transform')
			.use('production')
			.use(function (code, next) {
				// uncomment if you want to try running the code in a browser
				// write(__dirname+'/tmp/file.js', code)
				var a = {}
				vm.runInNewContext(code, a)
				a.should.have.property('modules')
					.that.is.a('array')
				a.should.have.property('require')
					.that.is.a('function')

				done()
			})
		build.entry = '/racks/index.js'
		build.run()
	})
})