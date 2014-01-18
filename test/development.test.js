
var chai = require('./chai')
  , write = require('fs').writeFileSync
  , Build = require('..')
  , vm = require('vm')

var base = __dirname +'/fixtures'

describe('development middleware', function(build){
  beforeEach(function(){
    build = new Build('compile')
      .use('transform')
      .use('development')
  })

  it('should compile to a string', function(done){
    build.use(function(code){
      code.should.include('function completions')
        .and.include('function join')
        .and.include('function normalize')
        .and.include('exports.simple = true')
    }).send(require('./fixtures/simple')).node(done)
  })

  it('should produce consistent output', function(done){
    var files = require('./fixtures/simple')
    build.send(files).then(function(a){
      return build.send(files.slice().reverse()).then(function(b){
        a.should.equal(b)
      })
    }).node(done)
  })

  it('should support relative paths', function(done){
    build.use(function(code){
      var ret = vm.runInNewContext(code+'\n(\'/a\')')
      expect(ret).to.deep.equal({
        has_dependency: true,
        dependency: {
          simple: true
        }
      })
    }).send(require('./fixtures/simple'))
      .node(done)
  })

  it('should support npm style packages', function(done){
    build.use(function(code, next){
      code += '\n(\'/expandindex\')'
      // uncomment if you want to try running the code in a browser
      // write(__dirname+'/tmp/file.js', code)
      var ret = vm.runInNewContext(code)
      expect(ret).to.eql({
        foo:{
          bar:'baz'
        }
      })
    })
    .plugin('nodeish')
    .send(require('./fixtures/node-expand-index.js'))
    .node(done)
  })

  it('should support remote paths', function(done){
    build.use(function(code){
      code += '\n(\'/remote\')'
      // write(__dirname+'/tmp/file.js', code)
      var ret = vm.runInNewContext(code)
      expect(ret).to.exist
        .and.have.property('names')
        .and.have.property(13, 'enter')
    }).send(require('./fixtures/remote'))
      .node(done)
  })

  describe('aliased modules', function(){
    it('basic case', function(done){
      build.use(function(code){
        code += '\n("/expandindex")'
        // write(__dirname+'/tmp/file.js', code)
        var ret = vm.runInNewContext(code)
        expect(ret).to.exist
          .and.have.property('foo')
      }).send(require('./fixtures/aliases'))
        .node(done)
    })

    it('requiring from aliased files', function(done){
      build.use(function(code){
        code += '\n("/project/index.js")'
        // write(__dirname+'/tmp/file.js', code)
        var ret = vm.runInNewContext(code)
        expect(ret).to.eql({a:{b:{c:true}}})
      }).send(require('./fixtures/alias2'))
        .node(done)
    })
  })
})
