var Build = require('../../src')
  , fs = require('fs');

new Build('Racks')
	.use(
	  'transform',
	  'short-paths',
	  'dict',
	  'development',
	  'umd'
	  // 'compress'
	)
	.include('./rack/component.json')
	.run(function (code) {
	  fs.writeFileSync(__dirname+'/built.js', code)
	})
