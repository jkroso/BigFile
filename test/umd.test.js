
var chai = require('./chai')
  , clone = require('clone')
  , write = require('fs').writeFileSync
  , Build = require('..')
  , vm = require('vm')

describe('umd middleware', function(){
  it('should work with the development plugins output', function(done){
    new Build('umd', '/path/to/rack/index.js')
      .use('transform')
      .use('development')
      .use('umd')
      .use(function (code) {
        // write(__dirname+'/tmp/file.js', code)
        var a = {}
        vm.runInNewContext(code, a)
        a.should.have.property('umd')
          .that.is.a('function')
      }).send(clone(require('./fixtures/nodeish')))
        .node(done)
  })
})
