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
	
	it('should transform matching files', function (done) {
		var p = base+'/simple/has_dependency.js'
		// Remove defualt handlers
		build._handlers.length = 0
		build.include(p).handle(/\.js/, function (file) {
			file.text += '$$bigfile-signature$$'
			return file
		})
		build.run(function (files) {
			files.should.have.a.lengthOf(2)
			files.forEach(function (file) {
				file.text.should.include('$$bigfile-signature$$')
			})
			done()
		})
	})
})