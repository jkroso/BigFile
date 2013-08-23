var chai = require('./chai')
  , clone = require('clone-component')
  , Build = require('..')
  , vm = require('vm')
  , fs = require('fs')

describe('short-paths middleware', function(){
	it('should produce runnable output', function(done){
		new Build('shortPaths', '/path/to/rack/index.js')
			.use('transform')
			.use('short-paths')
			.use('development')
			.use('umd')
			.use(function(code, next){
				// fs.writeFileSync(__dirname+'/tmp/file.js', code)
				var a = {}
				vm.runInNewContext(code, a)
				expect(a).to.have.property('shortPaths')
					.that.is.a('function')
			}).send(clone(require('./fixtures/nodeish')))
				.node(done)
	})

	describe('quick-shorten', function(){
		var build
		beforeEach(function(){
			build = new Build('shortPaths')
				.use('transform')
				.use('quick-path-shorten')
		})

		it('should also shorten aliases', function(done){
			build.entry = '/path/to/racks/index.js'
			build.use(function(files){
				files.forEach(function(file){
					file.path.should.match(/^\/b/)
					if (file.aliases) file.aliases.forEach(function(a){
						a.should.match(/^\/b/)
					})
				})
			}).send(clone(require('./fixtures/alias3')))
				.node(done)
		})

		it('should treat the packin cache as top level project dependencies', function(done){
			build.entry = process.env.HOME + '/Dev/components/graph/index.js'
			build.use(function(files){
				files.should.have.a.lengthOf(2)
				files[0].should.have.property('path', '/index.js')
				files[1].should.have.property('path', '/node_modules/github.com/marcelklehr/toposort/tarball/0.2.9/index.js')
				build.entry.should.equal('/index.js')
			}).send(clone(require('./fixtures/packin')))
				.node(done)
		})
	})
})