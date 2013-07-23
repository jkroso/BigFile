
var chai = require('./chai')
  , write = require('fs').writeFileSync
  , path = require('path')
  , Build = require('..')
  , vm = require('vm')

describe.skip('production middleware', function(){
	// production middleware depends on sourcegraph
	it('should produce runnable output', function(done){
		var build = new Build('production')
			.use('transform')
			.use('production')
			.use(function (code, next) {
				// uncomment if you want to try running the code in a browser
				// write(__dirname+'/tmp/file.js', code)
				var a = {}
				vm.runInNewContext(code, a)
				a.should.have.property('modules')
					.that.is.a('array')
				a.should.have.property('require')
					.that.is.a('function')

				done()
			})
		build.entry = '/racks/index.js'
		build.send(require('./fixtures/nodeish.js')).node(done)
	})
})