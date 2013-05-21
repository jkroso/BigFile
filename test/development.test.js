
var chai = require('chai') 
  , should = chai.should()
  , expect = chai.expect
  , Build = require('../src')
  , vm = require('vm')
  , write = require('fs').writeFileSync

var base = __dirname +'/fixtures'

describe('development middleware', function (build) {
	beforeEach(function () {
		build = new Build('compile')
			.use('transform')
			.use('development')
	})

	it('should compile to a string', function (done) {
		build.use(function (code) {
			code.should.include('function completions')
				.and.include('function join')
				.and.include('function normalize')
				.and.include('exports.simple = true')
			done()
		}).send(require('./fixtures/simple'))
	})

	it('should support relative paths', function (done) {
		build.use(function (code) {
			var ret = vm.runInNewContext(code+';require(\'/a\')')
			expect(ret).to.deep.equal({
				has_dependency: true,
				dependency: {
					simple: true
				}
			})
			done()
		}).send(require('./fixtures/simple'))
	})

	it('should support npm style packages', function (done) {
		build.use(function (code, next) {
			code += ';require(\'/expandindex\')'
			// uncomment if you want to try running the code in a browser
			// write(__dirname+'/tmp/file.js', code)
			var ret = vm.runInNewContext(code)
			expect(ret).to.eql({
				foo:{
					bar:'baz'
				}
			})
			done()
		})
		.plugin('nodeish')
		.send(require('./fixtures/node-expand-index.js'))
	})

	it('should support remote paths', function (done) {
		build.use(function (code) {
			code += ';require(\'/remote\')'
			// write(__dirname+'/tmp/file.js', code)
			var ret = vm.runInNewContext(code)
			expect(ret).to.exist
				.and.have.property('names')
				.and.have.property(13, 'enter')
			done()
		}).send(require('./fixtures/remote'))
	})

	describe('aliased modules', function () {
		it('basic case', function (done) {
			build.use(function (code) {
				code += ';require("/expandindex")'
				// write(__dirname+'/tmp/file.js', code)
				var ret = vm.runInNewContext(code)
				expect(ret).to.exist
					.and.have.property('foo')
				done()
			}).send(require('./fixtures/aliases'))
		})
	})
})