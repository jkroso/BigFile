var program = require('commander')
  , Build = require('../src')
  , path = require('path')
  , all = require('when-all')
  , debug = require('debug')('bigfile:cli')

require('colors')

program.version(require('../package').version)
	.usage('[options] <files...>')
	.option('-x, --export [name]', 'Global variable for your package')
	.option('-b, --beautify', 'Format to idiomatic JS')
	.option('-c, --compress', 'Minify the loader script')
	.option('-l, --leave-ast', 'Don\'t optimise the ast')
	.option('-L, --leave-code', 'Leave code completely')
	.option('-p, --production', 'Remove all paths in favor of index\'s')
	.option('-d, debug', 'Bigfile takes all node\'s debug options')


program.on('--help', function () {
	console.log('  Example: ')
	console.log('    $ bigfile src/index.js')
	console.log('    Tidy output')
	console.log('    $ bigfile -b src/index.js')
	console.log('')
})

program.parse(process.argv)

var files = program.args.map(function (file) {
	return path.resolve(file)
})

if (program.export == null) {
	program.export = path.basename(process.cwd())
	debug('Inferred build name from path: %s', program.export)
}

var build = new Build(program.export)
process.stderr.write('Module exporting as: '.blue)
process.stderr.write(program.export.blue.bold)
process.stderr.write('\n')

files.forEach(function (file) {
	console.warn(('Including file: %j').green, file)
	build.include(file)
})

if (program.leaveCode) {
	build.minify(false)
} else {
	build.minify({
		compress: !!program.compress,
		beautify: !!program.beautify,
		leaveAst: !!program.leaveAst
	})
}


if (program.production) build.debug(false)

build.use(
	'filter',
	'transform',
	'dict',
	'development',
	'umd'
).run(function (code) {
	process.stdout.write(code)
	process.stdout.write('\n')
	process.exit(0)
})
