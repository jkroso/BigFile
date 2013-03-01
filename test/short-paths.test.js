var expect = require('chai').expect
  , Build = require('../src')
  , vm = require('vm')
  , write = require('fs').writeFileSync
  , read = require('fs').readFileSync

describe('the short-paths plugin', function (build) {
	it('should load', function () {
		var build = new Build().use('short-paths')
		expect(build.stack).to.have.a.lengthOf(1)
	})

	it('should produce runnable output', function (done) {
		var path = require.resolve('./fixtures/nodeish.js')
		var files = JSON.parse(read(path, 'utf-8'))
		var build = new Build('shortPaths', files)
		build.entry = '/path/to/racks/index.js'
		build
			.use('transform')
			.use('short-paths')
			.use('dict')
			.use('development')
			.plugin('javascript')
			.use(function (code, next) {
				// uncomment if you want to try running the code in a browser
				write(__dirname+'/tmp/file.js', code)
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