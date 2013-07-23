
var chai = require('./chai')
  , Build = require('..')

describe('transform middleware', function(build){
	it('should transform matching files', function(done){
		new Build('transform')
			.handle(/\.js/, function(file){
				file.text += '$$signature$$'
				return file
			})
			.use('transform')
			.use(function(files){
				files.should.have.a.lengthOf(2)
				files.forEach(function(file){
					file.text.should.include('$$signature$$')
				})
			}).send(require('./fixtures/simple'))
				.node(done)
	})

	it('should pass unmatched files through unchanged', function(done){
		var files = require('./fixtures/aliases')
		new Build('transform')
			.use('transform')
			.use(function(res){
				res.should.eql(files)
			})
			.send(files)
			.node(done)
	})
})