
var spawn = require('child_process').spawn
var write = require('fs').writeFileSync
var vm = require('vm')

var file = require.resolve('../bin/bigfile')

it('should produce runable code', function(done){
  var child = spawn(file, [], {stdio: ['pipe', 'pipe', 'pipe']})
  var code = ''
  child.stdout.on('data', function(d){
    code += d
  }).on('end', function(){
    var ret = vm.runInNewContext(code)
    expect(ret).to.eql({a:{b:{c:true}}})
    done()
  })
  child.stderr.on('data', done)
  child.stdin.end(JSON.stringify(require('./fixtures/aliases')))
})
