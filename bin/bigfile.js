var program = require('commander')
  , Graph = require('SourceGraph')
  , Build = require('../src')
  , path = require('path')
  , fs = require('fs')
  , uglify = require('uglify-js')
  , all = require('jkroso-promises').all
  , cwd = process.cwd()

require('colors')

program.version('0.1.0')
	.usage('[options]')
	.option('-e, --entry [path]', 'Path to the head of your code', './src/index.js')
	.option('-w, --write [path]', 'Path to your built code', './dist/index.js')
	.option('-x, --export [name]', 'Global variable for your package')
	.option('-b, --beautify', 'Format to idiomatic JS')
	.option('-c, --compress', 'Minify the loader script')
	.option('-l, --leave-ast', 'Leave ast alone')
	.option('-L, --leave-code', 'Leave code as is')
	.option('-p, --production', 'Remove all paths in favour of indexs')
	.option('-d, debug', 'Bigfile takes all node\'s debug options')
	.parse(process.argv)

var entry = path.resolve(cwd, program.entry)
var output = path.resolve(cwd, program.write);

process.stdout.write(('Tracking files from: '+entry+'\n').green)

var build = new Build()
	.include(entry)
	.minify(program.leaveCode 
		? false
		: {
			beautify: program.beautify || false,
			compress: program.compress || false,
			leaveAst: program.leaveAst || false
		}
	)

if (program.export) build.export(program.export)
if (program.production) build.debug(false)

build.render(function (out) {
	process.stdout.write('Done: '.green.bold)
	output && fs.writeFile(output, out, 'utf-8', function (err) {
		process.stdout.write(err 
			? ('but unable to write the file.' + err).red
			: ('output written to ' + output).green
		)
		if (program.export) {
			process.stdout.write('\nModule exporting as: '.blue)
			process.stdout.write(program.export.blue.bold)
		}
		process.stdout.write('\n')
		process.exit()
	})
})