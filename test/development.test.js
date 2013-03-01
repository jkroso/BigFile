var should = require('chai').should()
  , expect = require('chai').expect
  , Build = require('../src')
  , Graph = require('sourcegraph')
  , vm = require('vm')
  , write = require('fs').writeFileSync

var base = __dirname +'/fixtures'

describe('the development plugin', function (build) {
	it('should load', function () {
		var build = new Build()
			.use('dict')
			.use('transform')
			.use('development')
			.plugin('component')
			.plugin('javascript')
			.plugin('json')

		build._handlers.should.have.a.lengthOf(4)
		build.stack.should.have.a.lengthOf(3)
	})

	it('should compile the modules into a large file', function (done) {
		var files = require('./fixtures/simple')
		new Build('compile', files)
			.use('transform')
			.use('dict')
			.use('development')
			.use(function (code, next) {
				code.should.include('function node_modules')
					.and.include('function variants')
					.and.include('function join')
					.and.include('function normalize')
					.and.include('function slice')
				done()
			})
			.run()
	})

	it('should be runnable when the modules use relative paths', function (done) {
		var files = require('./fixtures/simple')
		new Build('compile', files)
			.use('transform')
			.use('dict')
			.use('development')
			.use(function (code, next) {
				var ret = vm.runInNewContext(code+';require(\'/a\')')
				expect(ret).to.deep.equal({
					has_dependency: true,
					dependency: {
						simple: true
					}
				})
				done()
			})
			.plugin('javascript')
			.run()
	})

	it('should be runnable when the modules use node_modules', function (done) {
		var files = require('./fixtures/node/expandindex')
		new Build('compile', files)
			.use('transform')
			.use('dict')
			.use('development')
			.use(function (code, next) {
				code += ';require(\'/expandindex\')'
				// uncomment if you want to try running the code in a browser
				// write(__dirname+'/tmp/file.js', code)
				var ret = vm.runInNewContext(code)
				expect(ret).to.deep.equal({
					foo:{
						bar:'baz'
					}
				})
				done()
			})
			.plugin('javascript')
			.plugin('nodeish')
			.run()
	})

	// not supported anymore
	it.skip('should be runnable when the modules use components', function (done) {
		var files = require('./fixtures/simple-component')
		new Build('compile_component', files)
			.plugin('javascript')
			.plugin('nodeish')
			.plugin('component')
			.use('transform')
			.use('dict')
			.use('development')
			.use(function (code) {
				code += ';require(\'/simple/component.json\')'
				// uncomment if you want to try running the code in a browser
				write(__dirname+'/tmp/file.js', code)
				var ret = vm.runInNewContext(code)

				expect(ret).to.deep.equal({
					animal: {
						inherit: 'simple'
					}
				})
				done()
			})
			.run()
	})

	it('should be runnable when modules use remote paths', function (done) {
		var files = require('./fixtures/remote')
		new Build('compile_remote', files)
			.plugin('javascript')
			.use('transform')
			.use('dict')
			.use('development')
			.use(function (code) {
				code += ';require(\'/remote\')'
				// uncomment if you want to try running the code in a browser
				// write(__dirname+'/tmp/file.js', code)
				var ret = vm.runInNewContext(code)

				expect(ret).to.exist
					.and.have.property('names')
					.and.have.property(13, 'enter')
				done()
			})
			.run()
	})
})