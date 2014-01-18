
var chai = require('./chai')
  , spawn = require('child_process').spawn
  , write = require('fs').writeFileSync
  , vm = require('vm')

var file = require.resolve('../bin/_bigfile')
var entry = require.resolve('../example/simple')

describe('cli', function (build) {
  it('should produce runable code', function (done) {
    var child = spawn(file, ['-x', 'test'], {stdio: ['pipe', 'pipe', 'pipe']})
    var code = ''
    child.stdout.on('data', function(d){
      code += d
    }).on('end', function(){
      // write(__dirname+'/tmp/file.js', code)
      var a = {}
      expect(vm.runInNewContext(code, a)).to.be.a('function')
      Object.keys(a).should.have.a.lengthOf(0)
      done()
    })
    child.stderr.on('data', function(d){
      // silence normal info logs
      if ((d+'').length > 31) console.log(d+'')
    })
    child.stdin.end(JSON.stringify(require('./fixtures/nodeish')))
  })
})
