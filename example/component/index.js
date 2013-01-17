var Build = require('../../src')
  , fs = require('fs');

new Build()
.use(
  'transform',
  'dict',
  'development',
  'umd'
)
.include('./rack/component.json')
.run(function (code) {
  fs.writeFileSync(__dirname+'/built.js', code)
  process.exit(0)
})
