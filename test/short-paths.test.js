var expect = require('chai').expect
  , Build = require('../src')
  , vm = require('vm')
  , fs = require('fs')
  , clone = require('clone')

describe('short-paths middleware', function (build) {
	it('should produce runnable output', function (done) {
		var build = new Build('shortPaths')
		build.entry = '/path/to/racks/index.js'
		build
			.use('transform')
			.use('short-paths')
			.use('development')
			.use(function (code, next) {
				// fs.writeFileSync(__dirname+'/tmp/file.js', code)
				var a = {}
				vm.runInNewContext(code, a)
				expect(a).to.have.property('modules')
					.that.is.an('object')
				expect(a).to.have.property('require')
					.that.is.a('function')
				expect(a.require('/rack/index.js'))
					.to.be.be.a('function')
				done()
			}).send(clone(require('./fixtures/nodeish')))
	})

	describe('quick-shorten', function () {
		it('should also shorten aliases', function (done) {
			var build = new Build('shortPaths')
			build.entry = '/path/to/racks/index.js'
			build
				.use('transform')
				.use('quick-path-shorten')
				.use(function(files){
					files.forEach(function(file){
						file.path.should.match(/^\/b/)
						if (file.aliases) file.aliases.forEach(function(a){
							a.should.match(/^\/b/)
						})
					})
					done()
				}).send(clone(require('./fixtures/alias3')))
		})
	})
})