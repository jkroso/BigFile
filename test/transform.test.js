var should = require('chai').should()
  , Build = require('../src')

var base = __dirname +'/fixtures'

describe('the transform plugin', function (build) {
	it('should load', function () {
		var build = new Build().use('transform')
		build.stack.should.have.a.lengthOf(1)
	})

	beforeEach(function () {
		build = new Build().use('transform')
	})
	
	it('should filter out all matching files', function (done) {
		var p = base+'/simple/has_dependency.js'
		build.include(p)
			.handle(/\.js/, function (file) {
				file.text += '$$bigfile-signature$$'
				return file
			})
			.use(function (files, next) {
				files.should.have.a.lengthOf(2)
				files.forEach(function (file) {
					file.text.should.include('$$bigfile-signature$$')
				})
				done()
			})
			.run()
	})
})