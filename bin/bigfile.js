var program = require('commander')
  , Build = require('../src')
  , path = require('path')
  , all = require('when-all')
  , debug = require('debug')('bigfile:cli')

require('colors')

program.version(require('../package').version)
	.usage('[options] <entry files...> usually there is only one')
	.option('-x, --export [name]',
		'Use a global variable of your choice instead of the one inferred from\n\t\t\t'
		+'   your working directory. If your pass false nothing will be exported\n\t\t\t'
		+'   though your entry script will still be initialized with a require()')
	.option('-c, --compress', 'Minify the loader script of a development build')
	.option('-l, --leave-paths', 'Don\'t shorten paths in the production build')
	.option('-p, --production', 'Produce a highly optimised build')
	.option('-g, --no-umd', 'Just export a global. Only available for production builds')
	.option('-d, debug', 'bigfile takes any of node\'s debug options')

program.on('--help', function () {
	console.log('  Examples: ')
	console.log('  - Basic development build')
	console.log('     $ bigfile src/index.js'.grey)
	console.log('')
	console.log('  - Basic production build')
	console.log('     $ bigfile -p src/index.js'.grey)
	console.log('')
	console.log('  - With debugging enabled; this enables you to step through the build process')
	console.log('     $ bigfile -p src/index.js debug'.grey)
	console.log('')
})

program.parse(process.argv)

var files = program.args.map(function (file) {
	return path.resolve(file)
})

if (program.export == null) {
	program.export = path.basename(process.cwd()).replace(/[^\w]/, '')
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

if (program.production) {
	build.use(
		'filter',
		'transform',
		'production'
	)
	if (!program.noUmd) {
		build.use(
			'umd',
			'compress'
		)
	} else {
		build.use('globalise')
	}
} else {
	build.use(
		'filter',
		'transform',
		'short-paths',
		'dict',
		'development',
		'umd'
	)
	if (program.compress) {
		// Will only compress the require implementation
		build.use('compress')
	}
}

build.run(function (code) {
	process.stdout.write(code)
	process.stderr.write('\n')
	process.exit(0)
})




// .option('-b, --beautify', 'Format to idiomatic JS')
// .option('-l, --leave-ast', 'Don\'t optimize the ast')
// .option('-L, --leave-code', 'Leave code completely')
// if (program.leaveCode) {
// 	build.minify(false)
// } else {
// 	build.minify({
// 		compress: !!program.compress,
// 		beautify: !!program.beautify,
// 		leaveAst: !!program.leaveAst
// 	})
// }
