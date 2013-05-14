
var should = require('chai').should()
  , expect = require('chai').expect
  , Build = require('../src')
  , path = require('path')
  , vm = require('vm')
  , write = require('fs').writeFileSync

describe.skip('production middleware', function (build) {
	// production middleware depends on sourcegraph
	it('should produce runnable output', function (done) {
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