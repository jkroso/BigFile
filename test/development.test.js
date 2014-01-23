
var write = require('fs').writeFileSync
var build = require('..')
var vm = require('vm')

var base = __dirname + '/fixtures'

it('should compile to a string', function(){
  build(require('./fixtures/simple')).should
    .include('function completions')
    .include('function join')
    .include('function normalize')
    .include('exports.simple = true')
})

it('should produce consistent output', function(){
  var files = require('./fixtures/simple')
  var copy = files.slice().reverse()
  copy.unshift(copy.pop())
  var a = build(files)
  var b = build(copy)
  a.should.equal(b)
})

it('should support relative paths', function(){
  var code = build(require('./fixtures/simple'))
  var ret = vm.runInNewContext(code)
  expect(ret).to.eql({
    has_dependency: true,
    dependency: { simple: true }
  })
})

it('should support npm style packages', function(){
  var code = build(require('./fixtures/node-expand-index'))
  var ret = vm.runInNewContext(code)
  expect(ret).to.eql({foo:{bar:'baz'}})
})

describe('aliased modules', function(){
  it('basic case', function(){
    var code = build(require('./fixtures/aliases'))
    var ret = vm.runInNewContext(code)
    expect(ret).to.exist.and.have.property('foo')
  })

  it('requiring from aliased files', function(){
    var code = build(require('./fixtures/alias2'))
    var ret = vm.runInNewContext(code)
    expect(ret).to.eql({a:{b:{c:true}}})
  })
})
