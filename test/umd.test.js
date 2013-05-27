
var chai = require('./chai')
  , Build = require('../src')
  , vm = require('vm')
  , write = require('fs').writeFileSync
  , clone = require('clone')

describe('umd middleware', function (build) {
	it('should work with the development plugins output', function (done) {
		new Build('umd', '/path/to/rack/index.js')
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
			}).send(clone(require('./fixtures/nodeish')))
	})
})