
var chai = require('./chai')
  , Build = require('../src')

describe('filter middleware', function (build) {
	it('should filter out all matching files', function (done) {
		new Build('filter')
			.use(Build.filter(/a\.js/))
			.use(function (files, next) {
				files.should.have.a.lengthOf(1)
				done()
			}).send(require('./fixtures/simple'))
	})
})
