var expect = require('chai').expect
  , Build = require('../src')
  , vm = require('vm')
  , fs = require('fs')

describe('short-paths middleware', function (build) {
	it('should produce runnable output', function (done) {
		var path = require.resolve('./fixtures/nodeish.js')
		var files = JSON.parse(fs.readFileSync(path, 'utf-8'))
		var build = new Build('shortPaths', files)
		build.entry = '/path/to/racks/index.js'
		build
			.use('transform')
			.use('short-paths')
			.use('development')
			.plugin('javascript')
			.use(function (code, next) {
				// uncomment if you want to try running the code in a browser
				// fs.writeFileSync(__dirname+'/tmp/file.js', code)
				var a = {}
				vm.runInNewContext(code, a)
				expect(a).to.have.property('modules')
					.that.is.an('object')
				expect(a).to.have.property('require')
					.that.is.a('function')

				expect(a.require('/rack/index.js'))
					.to.be.be.a('function')

				done()
			})
			.run()
	})
})