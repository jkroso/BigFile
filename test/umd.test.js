var should = require('chai').should()
  , expect = require('chai').expect
  , Build = require('../src')
  , vm = require('vm')
  , write = require('fs').writeFileSync
  , read = require('fs').readFileSync

describe('umd middleware', function (build) {
	it('should work with the development plugins output', function (done) {
		var path = require.resolve('./fixtures/nodeish.js')
		var files = JSON.parse(read(path, 'utf-8'))
		var build = new Build('umd', files)
		build.entry = '/path/to/rack/index.js'
		build
			.use('transform')
			.use('development')
			.use('umd')
			.plugin('javascript')
			.use(function (code, next) {
				// uncomment if you want to try running the code in a browser
				// write(__dirname+'/tmp/file.js', code)
				var a = {}
				vm.runInNewContext(code, a)
				a.should.have.property('umd')
					.that.is.a('function')

				done()
			})
			.run()
	})

	// TODO: update the production plugin
	it.skip('should work with the production plugins output', function (done) {
		var p = path.join(__dirname, '../example/component/rack/component.json')
		var build = new Build('umd')
		build.use('transform')
			.use('production')
			.use('umd')
			.use('compress')
			.plugin('component')
			.include(p)
			.use(function (code, next) {
				// uncomment if you want to try running the code in a browser
				// write(__dirname+'/tmp/file.js', code)
				var a = {}
				vm.runInNewContext(code, a)
				a.should.have.property('umd')
					.that.is.a('function')
				next()
			})
			.run(function () {done()})
	})
})