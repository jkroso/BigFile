
var should = require('chai').should()
  , Build = require('../src')
  , vm = require('vm')
  , write = require('fs').writeFileSync

describe('umd middleware', function (build) {
	it('should work with the development plugins output', function (done) {
		var build = new Build('umd')
		build.entry = '/path/to/rack/index.js'
		build
			.use('transform')
			.use('development')
			.use('umd')
			.use(function (code) {
				// write(__dirname+'/tmp/file.js', code)
				var a = {}
				vm.runInNewContext(code, a)
				a.should.have.property('umd')
					.that.is.a('function')
				done()
			}).send(require('./fixtures/nodeish'))
	})
})