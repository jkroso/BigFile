#!/usr/bin/env node

var program = require('commander')
  , Build = require('../src')
  , path = require('path')
  , all = require('when-all')
  , renderJSON = require('prettyjson').render
  , fs = require('fs')
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
	.option('--plug <plugins...>', 'A comma seperated list of plugins. These are in addition to the default [javascript, json]', list)
	.option('--mw <middleware...>',
		'A comma seperated list of middleware. Note: these will be used in place of the default rather than in addition', list)
	.option('-g, --no-umd', 'Just export a global. Only available for production builds')
	.option('-d, debug', 'bigfile takes any of node\'s debug options')

function list (args) {
	return args.split(',')
}

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
	console.log('  - Writting to the a file')
	console.log('     $ bigfile src/index.js > built.js'.grey)
	console.log('')
})

program.command('list')
	.description('show available plugins and middleware')
	.action(function (cmd) {
		var list = fs.readdirSync(path.resolve(__dirname, '../src/plugins'))
		// Don't show the ones that are included by defautl
		list = list.filter(function (plugin) {
			switch (plugin) {
				case 'javascript':
				case 'json': return false
			}
			return true
		})
		console.log('')
		console.log('  Available plugins: \n%s', render(list))
		console.log('')
		var list = fs.readdirSync(path.resolve(__dirname, '../src/middleware'))
		console.log('  Available middleware: \n%s', render(list))
		console.log('')

		function removeExt (file) {
			return file.replace(/\.js$/, '')
		}
		function render (list) {
			return renderJSON(list.map(removeExt).sort()).replace(/^/gm, '    ')
		}
		process.exit(0)
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


program.plug && program.plug.forEach(function (plugin) {
	console.warn('install plugin: %s'.blue, plugin)
	build.plugin(plugin)
})

// Explicit middleware
if (program.mw) {
	program.mw.forEach(function (middleware) {
		console.warn('install middleware: %s'.blue, middleware)
		build.use(middleware)
	})
}
else if (program.production) {
	build.use(
		'filter',
		'transform',
		'production'
	)
	if (program.umd) {
		build.use('umd')
	} else {
		build.use('global')
	}
	build.use('compress')
} else {
	build.use('filter', 'transform')
	if (!program.leavePaths) build.use('short-paths')
	build.use(
		'dict',
		'development',
		'umd'
	)
	if (program.compress) {
		// Will only compress the require implementation
		build.use('compress')
	}
}

if (files.length) {
	files.forEach(function (file) {
		console.warn(('Including file: %j').green, file)
		build.include(file)
	})
	run()
} else {
	var buf = ''
	process.stdin.setEncoding('utf8')

	process.stdin.on('data', function(chunk){ buf += chunk })

	process.stdin.on('end', function(){
		var files = JSON.parse(buf)
		for (var i = 0, len = files.length; i < len; i++) {
			if (files[i].parents.length === 0) build.entry = files[i].path
		}
		if (!build.entry) throw new Error('Unable to determine an entry file')
		debug('Entry file determined as %s', build.entry)
		// Needs to be stored on the sourcegraph since some middleware makes use
		// of sourcegraphs methods
		build.graph.data = files
		// Create the mapping that sourcegraph expects
		files.forEach(function (file) {
			files[file.path] = file
		})
		run()
	}).resume()
}

function run () {
	build.run(function (code) {
		process.stdout.write(code)
		process.stderr.write('\n')
		process.exit(0)
	})
}