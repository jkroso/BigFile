var chai = require('./chai')
  , Build = require('..')
  , path = require('path')
  , vm = require('vm')
  , write = require('fs').writeFileSync

describe('the jade plugin', function (build) {
  it('should work with single file templates', function (done) {
    var b = new Build('jade')
      .use('transform')
      .use('development')
      .use('umd')
      .plugin('jade')
      .use(function (code) {
        // uncomment if you want to try running the code in a browser
        // write(__dirname+'/tmp/file.js', code)
        var a = {}
        vm.runInNewContext(code, a)
        a.should.have.property('jade')
          .that.is.an('object')
          .that.have.property('text', '<p>uno</p>')
      })
      b.entry = '/jade/index.js'
      b.send(require('./fixtures/jade-simple')).node(done)
  })

  it('should work with require statements', function (done) {
    var b = new Build('jade')
      .use('transform')
      .use('development')
      .use('umd')
      .plugin('css')
      .plugin('jade')
      .use(function (code) {
        // write(__dirname+'/tmp/file.js', code)
        code.should.include('/node_modules/css-install')
        code.should.include('/node_modules/jade-runtime')
        code.should.include('#user {border: blue;}')
      })
      b.entry = '/jade/index.jade'
      b.send(require('./fixtures/jade-requires')).node(done)
  })

  // I don't need this atm
  it.skip('should work with inherited templates', function(done){
    var p = base + 'inherit.js'
    build.include(p)
    build.run(function (code, next) {
      // write(__dirname+'/tmp/file.js', code)
      var a = {}
      vm.runInNewContext(code, a)
      a.should.have.property('jade')
        .that.is.an('object')
        .that.have.property('text', '<div><h1>inherit</h1></div>')
      done()
    })
  })
})
