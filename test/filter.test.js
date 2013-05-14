var should = require('chai').should()
  , Build = require('../src')

describe('filter middleware', function (build) {
	it('should filter out all matching files', function (done) {
		var files = require('./fixtures/simple')
		new Build('filter', files)
			.use(Build.filter(/a\.js/))
			.use(function (files, next) {
				files.should.have.a.lengthOf(1)
				done()
			})
			.run()
	})
})
