
var should = require('chai').should()
  , Build = require('../src')

describe('the transform plugin', function (build) {
	it('should transform matching files', function (done) {
		var files = require('./fixtures/simple')
		new Build('transform', files)
			.handle(/\.js/, function (file) {
				file.text += '$$signature$$'
				return file
			})
			.use('transform')
			.run(function (files) {
				files.should.have.a.lengthOf(2)
				files.forEach(function (file) {
					file.text.should.include('$$signature$$')
				})
				done()
			})
	})

	it('should allow pass unmatched files through unchanged', function (done) {
		var files = require('./fixtures/aliases')
		new Build('transform', files)
			.use('transform')
			.run(function (res) {
				res.should.eql(files)
				done()
			})
	})
})