var should = require('chai').should()
  , Build = require('../src')
  , path = require('path')
  , vm = require('vm')
  , write = require('fs').writeFileSync

describe('the short-paths plugin', function (build) {
	it('should load', function () {
		var build = new Build()
			.use('short-paths')
			.plugin('component')

		build._handlers.should.have.a.lengthOf(4)
		build.stack.should.have.a.lengthOf(1)
	})

	it('should produce runnable output', function (done) {
		var p = path.join(__dirname, '../example/component/rack/component.json');
		new Build('shortPaths')
			.use('transform')
			.use('short-paths')
			.use('dict')
			.use('development')
			.plugin('component')
			.include(p)
			.use(function (code, next) {
				code += ';\nvar exporting = require("/rack/component.json");'
				// uncomment if you want to try running the code in a browser
				write(__dirname+'/tmp/file.js', code)
				var a = {}
				vm.runInNewContext(code, a)
				a.should.have.property('modules')
					.that.is.an('object')
				a.should.have.property('require')
					.that.is.a('function')
				a.should.have.property('exporting')
					.that.is.a('function')
					.and.have.property('name', 'Racks')
				next()
			})
			.run(function () {done()})
	})
})