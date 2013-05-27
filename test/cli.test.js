
var chai = require('./chai')
  , Build = require('../src')
  , vm = require('vm')
  , write = require('fs').writeFileSync
  , spawn = require('child_process').spawn

var file = require.resolve('../bin/_bigfile')
var entry = require.resolve('../example/simple/simple')

describe('cli', function (build) {
	it('should produce runable code', function (done) {
		var child = spawn(file, ['-x', 'test'], {stdio: ['pipe', 'pipe', 'ignore']})
		var code = ''
		child.stdout
			.on('data', function(d){
				code += d
			})
			.on('end', function(){
				// write(__dirname+'/tmp/file.js', code)
				var a = {}
				vm.runInNewContext(code, a)
				a.should.have.property('test')
					.that.is.a('function')
				done()
			})
		child.stdin.end(JSON.stringify(require('./fixtures/nodeish')))
	})
})