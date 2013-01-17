var should = require('chai').should()
  , expect = require('chai').expect
  , Build = require('../src')
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

		build._handlers.should.have.a.lengthOf(4)
		build.stack.should.have.a.lengthOf(3)
	})

	beforeEach(function () {
		build = new Build()
			.use('transform')
			.use('dict')
			.use('development')
			.plugin('component')
	})
	
	it('should compile the modules into a large file', function (done) {
		var p = base+'/simple/has_dependency.js'
		build.include(p).use(function (code, next) {
			code.should.include('function node_modules')
				.and.include('function nodeishVariants')
				.and.include('function componentVariants')
				.and.include('function join')
				.and.include('function normalize')
				.and.include('function slice')
				.and.include('function components')
				.and.include('checks = [node_modules, components]')
			next()
		}).run(function () {done()})
	})

	it('should be runnable when the modules use relative paths', function (done) {
		var p = base+'/simple/has_dependency.js'
		build.include(p).use(function (code, next) {
			var ret = vm.runInNewContext(code+';require('+JSON.stringify(p)+')')

			expect(ret).to.deep.equal({
				has_dependency: true,
				dependency: {
					simple: true
				}
			})
			next()
		}).run(function () {done()})
	})

	it('should be runnable when the modules use node_modules', function (done) {
		var p = base+'/node/expandindex/index.js'
		build.include(p).use(function (code, next) {
			code += '\nrequire('+JSON.stringify(p)+')'
			// uncomment if you want to try running the code in a browser
			// write(__dirname+'/tmp/file.js', code)
			var ret = vm.runInNewContext(code)

			expect(ret).to.deep.equal({
				foo: 'foo/index.js'
			})
			next()
		}).run(function () {done()})
	})

	it('should be runnable when the modules use components', function (done) {
		var p = base+'/cc/simple/component.json'
		build.include(p).use(function (code, next) {
			code += '\nrequire('+JSON.stringify(p)+')'
			// uncomment if you want to try running the code in a browser
			// write(__dirname+'/tmp/file.js', code)
			var ret = vm.runInNewContext(code)

			expect(ret).to.deep.equal({
				animal: {
					inherit: 'inherit'
				}
			})
			next()
		}).run(function () {done()})
	})

	it('should be runnable when modules use remote paths', function (done) {
		var p = base+'/remote/simple/index.js'
		build.include(p).use(function (code, next) {
			code += '\nrequire('+JSON.stringify(p)+')'
			// uncomment if you want to try running the code in a browser
			// write(__dirname+'/tmp/file.js', code)
			var ret = vm.runInNewContext(code)
			expect(ret).to.exist
				.and.have.property('title')
				.and.have.property(13, 'enter')
			next()
		}).run(function () {done()})
	})
})