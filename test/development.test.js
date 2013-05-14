
var chai = require('chai') 
  , should = chai.should()
  , expect = chai.expect
  , Build = require('../src')
  , vm = require('vm')
  , write = require('fs').writeFileSync

var base = __dirname +'/fixtures'

describe('development middleware', function (build) {
	it('should compile to a string', function (done) {
		var files = require('./fixtures/simple')
		new Build('compile', files)
			.use('transform')
			.use('development')
			.plugin('javascript')
			.use(function (code, next) {
				code.should.include('function completions')
					.and.include('function join')
					.and.include('function normalize')
					.and.include('exports.simple = true')
				done()
			})
			.run()
	})

	it('should support relative paths', function (done) {
		var files = require('./fixtures/simple')
		new Build('compile', files)
			.use('transform')
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

	it('should support npm style packages', function (done) {
		var files = require('./fixtures/node-expand-index.js')
		new Build('compile', files)
			.use('transform')
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
			.plugin('nodeish')
			.run()
	})

	it('should support remote paths', function (done) {
		var files = require('./fixtures/remote')
		new Build('compile_remote', files)
			.plugin('javascript')
			.use('transform')
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

	it('should support aliased modules', function (done) {
		var files = require('./fixtures/aliases')
		new Build('aliases', files)
			.use('transform')
			.use('development')
			.plugin('javascript')
			.use(function (code) {
				code += ';require("/expandindex")'
				// uncomment if you want to try running the code in a browser
				// write(__dirname+'/tmp/file.js', code)
				var ret = vm.runInNewContext(code)

				expect(ret).to.exist
					.and.have.property('foo')
				done()
			})
			.run()
	})
})