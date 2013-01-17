var should = require('chai').should()
  , Build = require('../src')

var base = __dirname +'/fixtures'

describe('the filter plugin', function (build) {
	it('should load', function () {
		var build = new Build().use('filter')
		build.stack.should.have.a.lengthOf(1)
	})

	beforeEach(function () {
		build = new Build().use('filter')
	})
	
	it('should filter out all matching files', function (done) {
		var p = base+'/simple/has_dependency.js'
		build.include(p)
			.exclude(/index/)
			.use(function (files, next) {
				files.should.have.a.lengthOf(1)
				next()
			})
			.run(function () {done()})
	})
})