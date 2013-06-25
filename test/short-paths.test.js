var chai = require('./chai')
  , clone = require('clone-component')
  , Build = require('../src')
  , vm = require('vm')
  , fs = require('fs')

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
		var build
		beforeEach(function () {
			build = new Build('shortPaths')
				.use('transform')
				.use('quick-path-shorten')
		})

		it('should also shorten aliases', function (done) {
			build.entry = '/path/to/racks/index.js'
			build.use(function(files){
				files.forEach(function(file){
					file.path.should.match(/^\/b/)
					if (file.aliases) file.aliases.forEach(function(a){
						a.should.match(/^\/b/)
					})
				})
				done()
			}).send(clone(require('./fixtures/alias3')))
		})

		it('should treat the packin cache as top level project dependencies', function (done) {
			build.entry = process.env.HOME + '/Dev/components/graph/index.js'
			build.use(function(files){
				files.should.have.a.lengthOf(2)
				files[0].should.have.property('path', '/index.js')
				files[1].should.have.property('path', '/node_modules/github.com/marcelklehr/toposort/tarball/0.2.9/index.js')
				build.entry.should.equal('/index.js')
				done()
			}).send(clone(require('./fixtures/packin')))
		})
	})
})